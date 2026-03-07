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

# Load environment variables if .env file exists
if [ -f .env.premwebsite ]; then
    set -a
    source .env.premwebsite
    set +a
fi

# Log file location (optional, can be overridden)
LOG_FILE="${LOG_FILE:-/var/log/prem-website-rebuild.log}"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=========================================="
log "Starting Prem Website Rebuild Process"
log "=========================================="

# Call the Node.js script which handles everything:
# - Git pull
# - Rebuild
# - Newsletter sending
log "Running rebuild and newsletter script..."
if node scripts/rebuild-and-send-newsletter.js >> "$LOG_FILE" 2>&1; then
    log "✅ Rebuild and newsletter process completed successfully"
else
    log "❌ Process failed - check logs for details"
    exit 1
fi

log "=========================================="
log "Process Completed"
log "=========================================="
