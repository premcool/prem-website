#!/bin/bash

# Rebuild Prem Website and Send Newsletters
# This script rebuilds the Next.js site and sends newsletters for new blog posts
#
# Usage: ./rebuild-prem-website.sh
#
# Make sure to set environment variables or source them from a file:
# - NEXT_PUBLIC_SITE_URL
# - NEWSLETTER_WEBHOOK_SECRET (optional)
# - UPSTASH_REDIS_REST_URL
# - UPSTASH_REDIS_REST_TOKEN
# Optional (see scripts/rebuild-and-send-newsletter.js):
# - PREM_WEBSITE_GIT_RESET_HARD=1 — force clone to match origin/main (drops local server commits)
# - PREM_WEBSITE_GIT_BRANCH / PREM_WEBSITE_GIT_REMOTE — non-default branch or remote name
#
# Node: cron's PATH often lacks nvm. Optionally set NODE_BIN to a full path
# (e.g. /home/you/.nvm/versions/node/v20.10.0/bin/node). Otherwise ~/.nvm/nvm.sh
# is sourced when present. Node 18+ is required.
#
# Logging: this script appends to LOG_FILE. If cron also redirects stdout to the
# same file, you get duplicate lines—prefer: 0 1 * * * /path/to/rebuild-prem-website.sh

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

# Change to project directory
cd "$PROJECT_DIR" || exit 1

# Log file location (optional, can be overridden)
LOG_FILE="${LOG_FILE:-/var/log/prem-website-rebuild.log}"

# Log to file; echo to stdout only when interactive (avoids duplicate lines when
# cron does >> "$LOG_FILE" while we also write the same file)
log() {
    local line="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "$line" >> "$LOG_FILE"
    if [ -t 1 ]; then
        echo "$line"
    fi
}

# Load environment variables if .env file exists
# Check in project directory first, then in /home as fallback
# Suppress errors from sourcing to avoid syntax error messages in logs
if [ -f .env.premwebsite ]; then
    set -a
    source .env.premwebsite 2>/dev/null || true
    set +a
    log "Loaded environment variables from .env.premwebsite (project directory)"
elif [ -f /home/.env.premwebsite ]; then
    set -a
    # Single source in this shell (do not pipe source — that runs in a subshell)
    source /home/.env.premwebsite 2>/dev/null || true
    set +a
    log "Loaded environment variables from /home/.env.premwebsite"
    
    # Verify critical environment variables are loaded and exported
    if [ -z "$NEWSLETTER_WEBHOOK_SECRET" ]; then
        log "⚠️  WARNING: NEWSLETTER_WEBHOOK_SECRET is not set after loading .env file"
    else
        export NEWSLETTER_WEBHOOK_SECRET
        log "✅ NEWSLETTER_WEBHOOK_SECRET is loaded and exported (length: ${#NEWSLETTER_WEBHOOK_SECRET} chars)"
    fi
    
    # Export other critical variables
    export NEXT_PUBLIC_SITE_URL
    export UPSTASH_REDIS_REST_URL
    export UPSTASH_REDIS_REST_TOKEN
else
    log "⚠️  No .env.premwebsite file found. Environment variables may not be set."
    log "   Expected locations: $PROJECT_DIR/.env.premwebsite or /home/.env.premwebsite"
fi

log "=========================================="
log "Starting Prem Website Rebuild Process"
log "=========================================="

# Resolve Node.js 18+ (cron PATH is minimal; nvm is not loaded by default)
NODE=""
if [ -n "${NODE_BIN:-}" ] && [ -x "$NODE_BIN" ]; then
    NODE="$NODE_BIN"
elif [ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]; then
    export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
    # shellcheck source=/dev/null
    . "$NVM_DIR/nvm.sh"
    # Sourcing nvm does not always activate a version in non-interactive shells
    if type nvm >/dev/null 2>&1; then
        nvm use default >/dev/null 2>&1 || nvm use node >/dev/null 2>&1 || true
    fi
    NODE="$(command -v node)"
else
    NODE="$(command -v node)"
fi

if [ -z "$NODE" ] || [ ! -x "$NODE" ]; then
    log "ERROR: node not found. Install Node 18+ or set NODE_BIN to the full path."
    exit 1
fi

NODE_RAW="$("$NODE" -v 2>/dev/null || true)"
NODE_MAJOR="${NODE_RAW#v}"
NODE_MAJOR="${NODE_MAJOR%%.*}"
if ! [[ "$NODE_MAJOR" =~ ^[0-9]+$ ]] || [ "$NODE_MAJOR" -lt 18 ]; then
    log "ERROR: Node.js 18+ required (found: ${NODE_RAW:-none}). Set NODE_BIN or use nvm install 20 && nvm alias default 20"
    exit 1
fi
log "Using Node $NODE_RAW ($NODE)"

# Call the Node.js script which handles everything:
# - Git pull
# - Rebuild
# - Newsletter sending
# Pass environment variables explicitly to ensure they're available to Node.js
log "Running rebuild and newsletter script..."
if env NEWSLETTER_WEBHOOK_SECRET="$NEWSLETTER_WEBHOOK_SECRET" \
       NEXT_PUBLIC_SITE_URL="$NEXT_PUBLIC_SITE_URL" \
       UPSTASH_REDIS_REST_URL="$UPSTASH_REDIS_REST_URL" \
       UPSTASH_REDIS_REST_TOKEN="$UPSTASH_REDIS_REST_TOKEN" \
       "$NODE" scripts/rebuild-and-send-newsletter.js >> "$LOG_FILE" 2>&1; then
    log "✅ Rebuild and newsletter process completed successfully"
else
    log "❌ Process failed - check logs for details"
    exit 1
fi

# Docker container management
# Check if docker-compose is available and if we're in a directory with docker-compose.yml
SERVICE_NAME="prem-website"
if command -v docker-compose >/dev/null 2>&1 || command -v docker >/dev/null 2>&1; then
    # Determine which command to use
    if command -v docker-compose >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker-compose"
    else
        DOCKER_COMPOSE_CMD="docker compose"
    fi
    
    # Check if docker-compose.yml exists (check in project dir and parent dir)
    if [ -f docker-compose.yml ] || [ -f ../docker-compose.yml ]; then
        log "=========================================="
        log "Rebuilding Docker Container"
        log "=========================================="
        
        # Determine docker-compose file location
        if [ -f docker-compose.yml ]; then
            COMPOSE_DIR="$PROJECT_DIR"
        else
            COMPOSE_DIR="$(cd "$PROJECT_DIR/.." && pwd)"
        fi
        
        cd "$COMPOSE_DIR" || exit 1
        
        # Stop container first to avoid ContainerConfig errors
        log "Stopping container..."
        $DOCKER_COMPOSE_CMD stop "$SERVICE_NAME" >> "$LOG_FILE" 2>&1 || true
        
        # Remove the container to avoid ContainerConfig errors
        log "Removing old container..."
        $DOCKER_COMPOSE_CMD rm -f "$SERVICE_NAME" >> "$LOG_FILE" 2>&1 || true
        
        # Safe version that won't exit on error
        log "Cleaning up dangling images..."
        docker images -f "dangling=true" -q | xargs -r docker rmi >> "$LOG_FILE" 2>&1 || true
        
        # Rebuild without cache
        log "Rebuilding container (no cache)..."
        $DOCKER_COMPOSE_CMD build --no-cache "$SERVICE_NAME" >> "$LOG_FILE" 2>&1 || {
            log "ERROR: Build failed"
            exit 1
        }
        
        # Start container (will create new one)
        log "Starting container..."
        $DOCKER_COMPOSE_CMD up -d "$SERVICE_NAME" >> "$LOG_FILE" 2>&1 || {
            log "ERROR: Failed to start container"
            exit 1
        }
        
        log "✅ Docker container rebuilt and started successfully"
        
        # Return to project directory
        cd "$PROJECT_DIR" || exit 1
    else
        log "⚠️  docker-compose.yml not found, skipping Docker rebuild"
        log "   Expected locations: $PROJECT_DIR/docker-compose.yml or $(cd "$PROJECT_DIR/.." && pwd)/docker-compose.yml"
    fi
else
    log "⚠️  Docker/Docker Compose not available, skipping container rebuild"
fi

log "=========================================="
log "Process Completed"
log "=========================================="
