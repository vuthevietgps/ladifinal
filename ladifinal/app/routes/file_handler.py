# File Upload & Validation Utilities
import os
import shutil
import tempfile
import zipfile
import re
from typing import Dict, Any, List
from ..constants import ALLOWED_EXTENSIONS, MAX_FILE_SIZE, MAX_TOTAL_SIZE, MAX_FILES
from ..exceptions import ValidationError, FileUploadError, ZipProcessingError
from urllib.parse import urlparse

def validate_zip_structure(zip_file):
    """Validate ZIP file structure and check for index.html"""

    try:
        with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            file_list = [f.filename for f in zip_ref.infolist() if not f.is_dir()]
            
            if len(file_list) > MAX_FILES:
                return {
                    'status': 'error',
                    'message': f'Quá nhiều file. Tối đa {MAX_FILES} file được phép.',
                    'index_location': 'not_found'
                }
            
            total_size = sum(f.file_size for f in zip_ref.infolist() if not f.is_dir())
            if total_size > MAX_TOTAL_SIZE:
                return {
                    'status': 'error',
                    'message': 'Tổng dung lượng ZIP quá lớn. Tối đa 500MB.',
                    'index_location': 'not_found'
                }
            
            # Validate file extensions and sizes
            for file_info in zip_ref.infolist():
                if file_info.is_dir():
                    continue
                    
                if file_info.file_size > MAX_FILE_SIZE:
                    return {
                        'status': 'error',
                        'message': f'File {file_info.filename} quá lớn. Tối đa 50MB mỗi file.',
                        'index_location': 'not_found'
                    }
                
                _, ext = os.path.splitext(file_info.filename.lower())
                if ext not in ALLOWED_EXTENSIONS:
                    return {
                        'status': 'error',
                        'message': f'File extension {ext} không được phép.',
                        'index_location': 'not_found'
                    }
            
            # Check for index.html at root level
            index_at_root = any(
                f.lower() in ['index.html', 'index.htm']
                for f in file_list
                if ('/' not in f and '\\' not in f)
            )
            
            if index_at_root:
                return {
                    'status': 'valid',
                    'message': 'ZIP structure is correct - index.html found at root level',
                    'index_location': 'root'
                }
            
            # Check for index.html in subfolders
            subfolders_with_index = []
            for file_path in file_list:
                if ('/' in file_path) or ('\\' in file_path):
                    parts = re.split(r'[\\\\/]+', file_path)
                    if len(parts) == 2 and parts[1].lower() in ['index.html', 'index.htm']:
                        subfolders_with_index.append(parts[0])
            
            if subfolders_with_index:
                return {
                    'status': 'fixable',
                    'message': f'index.html found in subfolder(s): {", ".join(subfolders_with_index)}. System will auto-extract from subfolder.',
                    'index_location': 'subfolder',
                    'subfolders': subfolders_with_index
                }
            
            return {
                'status': 'error',
                'message': 'No index.html found in ZIP file (checked root and 1-level subfolders)',
                'index_location': 'not_found'
            }
            
    except zipfile.BadZipFile:
        return {
            'status': 'error',
            'message': 'Invalid ZIP file format',
            'index_location': 'not_found'
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': f'Error reading ZIP file: {str(e)}',
            'index_location': 'not_found'
        }


def extract_and_validate_folder(zip_file, target_dir):
    """Extract ZIP file and validate folder structure with auto-subfolder detection"""

    
    extracted_files = []
    folder_structure = {}
    total_size = 0
    
    with tempfile.TemporaryDirectory() as temp_dir:
        # Extract to temp directory first
        with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            file_list = zip_ref.infolist()
            
            if len(file_list) > MAX_FILES:
                raise ValueError(f'Quá nhiều file. Tối đa {MAX_FILES} file được phép.')
            
            # Validate each file
            for file_info in file_list:
                if file_info.is_dir():
                    continue
                    
                if file_info.file_size > MAX_FILE_SIZE:
                    raise ValueError(f'File {file_info.filename} quá lớn. Tối đa 50MB mỗi file.')
                
                total_size += file_info.file_size
                if total_size > MAX_TOTAL_SIZE:
                    raise ValueError('Tổng dung lượng folder quá lớn. Tối đa 500MB.')
                
                _, ext = os.path.splitext(file_info.filename.lower())
                if ext not in ALLOWED_EXTENSIONS:
                    raise ValueError(f'File extension {ext} không được phép. Chỉ chấp nhận: {", ".join(ALLOWED_EXTENSIONS)}')
                
                if '..' in file_info.filename or file_info.filename.startswith('/'):
                    raise ValueError(f'Đường dẫn file không an toàn: {file_info.filename}')

            # Extract all files with normalized paths
            for file_info in file_list:
                if file_info.is_dir():
                    continue
                
                raw_name = file_info.filename.lstrip('/\\')
                parts = [p for p in re.split(r'[\\\\/]+', raw_name) if p not in ('', '.')]
                if any(p == '..' for p in parts):
                    raise ValueError(f'Đường dẫn file không an toàn: {file_info.filename}')
                
                normalized_rel_path = os.path.join(*parts) if parts else os.path.basename(raw_name)
                dest_path = os.path.join(temp_dir, normalized_rel_path)
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                
                with zip_ref.open(file_info) as src, open(dest_path, 'wb') as dst:
                    shutil.copyfileobj(src, dst)
        
        # Smart detection of index.html location
        index_html_path = None
        root_source_dir = None
        
        # First, try to find index.html at root level
        for file in os.listdir(temp_dir):
            if file.lower() in ['index.html', 'index.htm']:
                index_html_path = os.path.join(temp_dir, file)
                root_source_dir = temp_dir
                break
        
        # If not found at root, look in subfolders (one level deep only)
        if not index_html_path:
            for item in os.listdir(temp_dir):
                item_path = os.path.join(temp_dir, item)
                if os.path.isdir(item_path):
                    for file in os.listdir(item_path):
                        if file.lower() in ['index.html', 'index.htm']:
                            index_html_path = os.path.join(item_path, file)
                            root_source_dir = item_path
                            print(f"Found index.html in subfolder: {item}/")
                            break
                    if index_html_path:
                        break
        
        if not index_html_path:
            raise ValueError('Không tìm thấy file index.html trong folder (tìm kiếm ở root và subfolder level 1).')
        
        # Copy files from the detected source directory to target directory
        for root, dirs, files in os.walk(root_source_dir):
            for file in files:
                src_path = os.path.join(root, file)
                rel_path = os.path.relpath(src_path, root_source_dir)
                dest_path = os.path.join(target_dir, rel_path)
                
                # Create directory if needed
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                
                # Copy file
                shutil.copy2(src_path, dest_path)
                
                # Get file info
                file_size = os.path.getsize(src_path)
                _, ext = os.path.splitext(file.lower())
                
                # Determine file type
                if ext in ['.html', '.htm']:
                    file_type = 'html'
                elif ext in ['.css']:
                    file_type = 'css'
                elif ext in ['.js']:
                    file_type = 'js'
                elif ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']:
                    file_type = 'image'
                else:
                    file_type = 'other'
                
                extracted_files.append({
                    'path': rel_path,
                    'original_name': file,
                    'type': file_type,
                    'size': file_size
                })
                
                # Build folder structure
                path_parts = rel_path.split(os.sep)
                current = folder_structure
                for part in path_parts[:-1]:
                    if part not in current:
                        current[part] = {}
                    current = current[part]
                current[path_parts[-1]] = {'type': file_type, 'size': file_size}
    
    return extracted_files, folder_structure


ANALYTICS_BLOCK_RE = re.compile(
    r'<!--\s*Analytics\s*&\s*Tracking\s*-->.*?<!--\s*/Analytics\s*&\s*Tracking\s*-->\s*',
    re.IGNORECASE | re.DOTALL
)
CUSTOM_TRACKING_BLOCK_RE = re.compile(
    r'<!--\s*Custom\s*Tracking\s*Events\s*-->.*?<!--\s*/Custom\s*Tracking\s*Events\s*-->\s*',
    re.IGNORECASE | re.DOTALL
)


def _insert_before_closing_tag(content: str, tag: str, snippet: str, fallback_to_start: bool) -> str:
    """Insert snippet before closing HTML tag (case-insensitive)."""
    pattern = re.compile(rf'</{tag}\s*>', re.IGNORECASE)
    if pattern.search(content):
        return pattern.sub(f'\n{snippet}\n</{tag}>', content, count=1)
    if fallback_to_start:
        return f"{snippet}\n{content}"
    return f"{content}\n{snippet}"


def inject_tracking(html_content, head_snippet="", body_snippet=""):
    """Inject tracking codes into HTML content (idempotent by managed markers)."""
    try:
        if not html_content:
            return html_content

        # Remove previously managed tracking blocks before injecting fresh snippets.
        html_content = ANALYTICS_BLOCK_RE.sub('', html_content)
        html_content = CUSTOM_TRACKING_BLOCK_RE.sub('', html_content)

        if head_snippet.strip():
            html_content = _insert_before_closing_tag(
                html_content,
                'head',
                head_snippet.strip(),
                fallback_to_start=True
            )

        if body_snippet.strip():
            html_content = _insert_before_closing_tag(
                html_content,
                'body',
                body_snippet.strip(),
                fallback_to_start=False
            )

        return html_content
    except Exception as e:
        raise Exception(f'Lỗi inject tracking: {str(e)}')


def process_html_tracking_in_folder(target_dir, head_snippet, body_snippet):
    """Process all HTML files in folder to inject tracking codes"""
    processed_files = []
    
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.lower().endswith(('.html', '.htm')):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, target_dir)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Inject tracking
                    processed_content = inject_tracking(content, head_snippet, body_snippet)
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(processed_content)
                        
                    processed_files.append(rel_path)
                except Exception as e:
                    raise Exception(f'Lỗi xử lý file {rel_path}: {str(e)}')
    
    return processed_files


def _should_rewrite_url(u: str) -> bool:
    """Return True if URL is an absolute-path we should rewrite (starts with '/' but not protocol or protocol-relative)."""
    if not u:
        return False
    s = u.strip()
    if s.startswith('http://') or s.startswith('https://'):
        return False
    if s.startswith('data:') or s.startswith('mailto:') or s.startswith('#'):
        return False
    if s.startswith('//'):
        return False
    return s.startswith('/')


def rewrite_html_paths(content: str, subdomain: str) -> str:
    """Rewrite src/href-like attributes that start with '/' to '/landing/<subdomain>/...'."""
    import re
    if not content:
        return content
    prefix = f"/landing/{subdomain}/"

    def repl(m: re.Match) -> str:
        attr = m.group('attr')
        quote = m.group('q')
        url = m.group('url')
        if _should_rewrite_url(url) and not url.startswith(prefix):
            new_url = prefix + url.lstrip('/')
            return f"{attr}={quote}{new_url}{quote}"
        return m.group(0)

    # src, href, data-src, data-href, poster
    pattern = re.compile(r"(?P<attr>\b(?:src|href|data-src|data-href|poster))\s*=\s*(?P<q>[\"\'])\s*(?P<url>[^\"\']+)\s*(?P=q)")
    content = pattern.sub(repl, content)

    # srcset: contains multiple URLs possibly with descriptors
    def repl_srcset(m: re.Match) -> str:
        quote = m.group('q')
        val = m.group('val')
        parts = [p.strip() for p in val.split(',')]
        out = []
        for p in parts:
            if not p:
                continue
            segs = p.split()
            if segs:
                u = segs[0]
                rest = ' '.join(segs[1:])
                if _should_rewrite_url(u) and not u.startswith(prefix):
                    u = prefix + u.lstrip('/')
                out.append((u + (' ' + rest if rest else '')).strip())
        return f"srcset={quote}{', '.join(out)}{quote}"

    pattern_srcset = re.compile(r"\bsrcset\s*=\s*(?P<q>[\"\'])\s*(?P<val>[^\"\']+)\s*(?P=q)")
    content = pattern_srcset.sub(repl_srcset, content)
    return content


def rewrite_css_paths(content: str, subdomain: str) -> str:
    """Rewrite url(/path) in CSS to /landing/<subdomain>/path when absolute-path URLs are used."""
    import re
    if not content:
        return content
    prefix = f"/landing/{subdomain}/"

    def repl(m: re.Match) -> str:
        raw = m.group('raw')
        u = raw.strip().strip('\"\'')
        if _should_rewrite_url(u) and not u.startswith(prefix):
            u = prefix + u.lstrip('/')
        # keep original quoting if any
        if raw.strip().startswith(('"', "'")):
            q = raw.strip()[0]
            return f"url({q}{u}{q})"
        return f"url({u})"

    pattern = re.compile(r"url\(\s*(?P<raw>[^)]+?)\s*\)")
    return pattern.sub(repl, content)


def rewrite_asset_paths_in_folder(target_dir: str, subdomain: str) -> List[str]:
    """Walk target_dir and rewrite HTML and CSS absolute paths to work under /landing/<subdomain>/. Returns list of changed files."""
    changed: List[str] = []
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            lower = file.lower()
            if lower.endswith(('.html', '.htm', '.css')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    new_content = content
                    if lower.endswith(('.html', '.htm')):
                        new_content = rewrite_html_paths(new_content, subdomain)
                    else:
                        new_content = rewrite_css_paths(new_content, subdomain)
                    if new_content != content:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        rel = os.path.relpath(path, target_dir)
                        changed.append(rel)
                except Exception:
                    # Skip file on error; do not break upload
                    continue
    return changed

