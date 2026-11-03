#!/bin/bash
set -uo pipefail

APP_NAME="myprofile-app"
BASE_DIR="${BASE_DIR:-/opt/myprofile}"
REPO_URL="https://github.com/rajmohan17061982/myprofile.git"
BRANCH_NAME="${BRANCH_NAME:-main}"
REPO_DIR="$BASE_DIR/myprofile"
LOG_FILE="$BASE_DIR/logs/run.log"
export PORT="${PORT:-1710}"
# TLS certificate and key (PEM); the app is served over HTTPS only
export SSL_KEY_FILE="${SSL_KEY_FILE:-$BASE_DIR/certs/privkey.pem}"
export SSL_CERT_FILE="${SSL_CERT_FILE:-$BASE_DIR/certs/fullchain.pem}"

mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"

log() { echo "$*" | tee -a "$LOG_FILE"; }
fail() { log "ERROR: $*"; exit 1; }

log "**************************"
log "****** Deploying $APP_NAME ($(date '+%Y-%m-%d %H:%M:%S')) ***"
log "**************************"

for tool in git node npm; do
  command -v "$tool" >/dev/null 2>&1 || fail "$tool is not installed"
done

# Node >= 18 is required (see package.json engines)
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[ "$NODE_MAJOR" -ge 18 ] || fail "Node.js >= 18 required, found $(node -v)"

[ -r "$SSL_KEY_FILE" ] || fail "TLS key not readable: $SSL_KEY_FILE"
[ -r "$SSL_CERT_FILE" ] || fail "TLS certificate not readable: $SSL_CERT_FILE"

if ! command -v pm2 >/dev/null 2>&1; then
  log "Installing PM2 globally..."
  npm install -g pm2 --silent >>"$LOG_FILE" 2>&1 || fail "Failed to install PM2 (try running with sudo)"
fi

# Fresh checkout of the requested branch
log "Removing old checkout $REPO_DIR"
rm -rf "$REPO_DIR"

log "Cloning $REPO_URL (branch $BRANCH_NAME)..."
git clone --branch "$BRANCH_NAME" "$REPO_URL" "$REPO_DIR" >>"$LOG_FILE" 2>&1 \
  || fail "Failed to clone repository"

cd "$REPO_DIR" || fail "Failed to enter $REPO_DIR"

log "Installing production dependencies..."
npm ci --omit=dev --silent >>"$LOG_FILE" 2>&1 \
  || npm install --omit=dev --silent >>"$LOG_FILE" 2>&1 \
  || fail "Failed to install dependencies"

log "Running tests..."
node --test >>"$LOG_FILE" 2>&1 || fail "Tests failed, see $LOG_FILE"

# Replace only this app's PM2 process, not every process on the machine
pm2 delete "$APP_NAME" >>"$LOG_FILE" 2>&1 || true

log "Starting $APP_NAME on port $PORT..."
pm2 start src/server.js --name "$APP_NAME" >>"$LOG_FILE" 2>&1 \
  || fail "Failed to start $APP_NAME"

pm2 save >>"$LOG_FILE" 2>&1
log "Run 'pm2 startup' once (as root) if you want the app to start on boot."

sleep 2
if curl -fsSk "https://localhost:$PORT/" >/dev/null 2>&1; then
  log "App is responding on https://localhost:$PORT"
else
  log "WARNING: app did not respond on port $PORT yet, check 'pm2 logs $APP_NAME'"
fi

log "****** Process Complete ***"
