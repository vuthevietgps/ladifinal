import http.server
import socketserver
import sys
import os

class UTF8Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = dict(http.server.SimpleHTTPRequestHandler.extensions_map)
    extensions_map['.html'] = 'text/html; charset=utf-8'
    extensions_map['.htm'] = 'text/html; charset=utf-8'
    extensions_map['.css'] = 'text/css; charset=utf-8'
    extensions_map['.js'] = 'application/javascript; charset=utf-8'
    extensions_map['.json'] = 'application/json; charset=utf-8'

    def end_headers(self):
        if self.path.endswith('.html'):
            self.send_header('Content-Type', 'text/html; charset=utf-8')
        super().end_headers()

if __name__ == '__main__':
    os.chdir(sys.argv[1])
    with socketserver.TCPServer(('127.0.0.1', 8080), UTF8Handler) as httpd:
        print('Serving UTF-8 at http://127.0.0.1:8080', flush=True)
        httpd.serve_forever()
