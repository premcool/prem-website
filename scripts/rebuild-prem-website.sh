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

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

# Change to project directory
cd "$PROJECT_DIR" || exit 1

# Log file location (optional, can be overridden)
LOG_FILE="${LOG_FILE:-/var/log/prem-website-rebuild.log}"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
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
    # Source with error suppression - syntax errors will be logged but won't stop execution
    if source /home/.env.premwebsite 2>&1 | grep -q "error\|Error\|syntax"; then
        log "⚠️  Warning: Some errors detected in /home/.env.premwebsite (check line 20)"
        log "   Attempting to load anyway..."
    fi
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
       node scripts/rebuild-and-send-newsletter.js >> "$LOG_FILE" 2>&1; then
    log "✅ Rebuild and newsletter process completed successfully"
else
    log "❌ Process failed - check logs for details"
    exit 1
fi

log "=========================================="
log "Process Completed"
log "=========================================="
