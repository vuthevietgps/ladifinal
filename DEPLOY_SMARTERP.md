# Deploy smarterp.vn

This project already includes a generic deploy script for one domain:
- `deploy-new-domain.sh`

For `smarterp.vn`, use the domain wrapper:
- `deploy-smarterp.sh`

## Quick deploy (on Ubuntu server)

```bash
cd /path/to/ladifinal
chmod +x deploy-new-domain.sh deploy-smarterp.sh
sudo ./deploy-smarterp.sh
```

Default behavior:
- Domain: `smarterp.vn` and `www.smarterp.vn`
- Host port: `8088` (auto-shift to next free port if busy)
- Docker image: `vutheviet/ladifinal:latest`
- Site path: `/opt/websites/sites/smarterp-vn`
- Tunnel config file: `/etc/cloudflared/config.yml` (if present)

## Useful options

```bash
# Keep exact port 8088, fail if busy
sudo ./deploy-smarterp.sh --keep-port-only

# Remove old container before deploy
sudo ./deploy-smarterp.sh --old-action remove

# Deploy specific image
sudo ./deploy-smarterp.sh --image yourdocker/ladifinal:tag

# Skip tunnel update
sudo ./deploy-smarterp.sh --no-tunnel
```

## Verify after deploy

```bash
curl -I http://127.0.0.1:8088/health
curl -I https://smarterp.vn
curl -I https://www.smarterp.vn
```

## DNS (Cloudflare)

Point both records to your tunnel target (proxied):
- `@` -> `<tunnel-id>.cfargotunnel.com`
- `www` -> `<tunnel-id>.cfargotunnel.com`

If you have `cloudflared` CLI:

```bash
sudo cloudflared tunnel list
sudo cloudflared tunnel route dns <TUNNEL_ID_OR_NAME> smarterp.vn
sudo cloudflared tunnel route dns <TUNNEL_ID_OR_NAME> www.smarterp.vn
```
