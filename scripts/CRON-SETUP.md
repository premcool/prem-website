# Cron Job Setup for Rebuild and Newsletter

## Option 1: Use the Shell Script (Recommended)

The shell script handles everything: git pull, rebuild, and newsletter sending.

### Update Your Cron Job

Edit your crontab:
```bash
crontab -e
```

Replace your existing line with:
```bash
# Rebuild site and send newsletters daily at 1 AM
0 1 * * * /path/to/prem-website/scripts/rebuild-prem-website.sh >> /var/log/prem-website-rebuild.log 2>&1
```

**Important:** Replace `/path/to/prem-website` with your actual project path.

### Make Script Executable

```bash
chmod +x /path/to/prem-website/scripts/rebuild-prem-website.sh
```

### Environment Variables

The script will automatically load from `.env.premwebsite` if it exists in the project root. Make sure it contains:

```bash
NEXT_PUBLIC_SITE_URL=https://prems.in
NEWSLETTER_WEBHOOK_SECRET=your-secret-key-here
UPSTASH_REDIS_REST_URL=https://your-db-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

Or set them in the cron job directly:
```bash
0 1 * * * cd /path/to/prem-website && source .env.premwebsite && /path/to/prem-website/scripts/rebuild-prem-website.sh >> /var/log/prem-website-rebuild.log 2>&1
```

---

## Option 2: Use Node.js Script Directly

If you prefer to call the Node.js script directly:

```bash
# Rebuild site and send newsletters daily at 1 AM
0 1 * * * cd /path/to/prem-website && /usr/bin/node scripts/rebuild-and-send-newsletter.js >> /var/log/prem-website-rebuild.log 2>&1
```

**Note:** This requires environment variables to be set. See Option 1 for how to source them.

---

## Option 3: Modify Your Existing Script

If you already have a `rebuild-prem-website.sh` script, add this line at the end:

```bash
# After rebuild completes successfully
node /path/to/prem-website/scripts/rebuild-and-send-newsletter.js >> /var/log/prem-website-rebuild.log 2>&1
```

Or if you want to use the shell script approach, replace your rebuild command with:

```bash
# Instead of just: npm run build
# Use the full script:
/path/to/prem-website/scripts/rebuild-prem-website.sh
```

---

## Finding Your Project Path

To find the exact path to your project:

```bash
cd /path/to/prem-website
pwd
```

Use that output in your cron job.

---

## Finding Node.js Path

To find the full path to node:

```bash
which node
```

Use that path in your cron job (e.g., `/usr/bin/node` or `/usr/local/bin/node`).

---

## Testing

Before setting up the cron job, test manually:

```bash
# Test the shell script
/path/to/prem-website/scripts/rebuild-prem-website.sh

# Or test the Node.js script directly
cd /path/to/prem-website
node scripts/rebuild-and-send-newsletter.js
```

---

## Log File Location

Logs will be written to `/var/log/prem-website-rebuild.log`. Make sure the user running the cron job has write permissions:

```bash
sudo touch /var/log/prem-website-rebuild.log
sudo chmod 666 /var/log/prem-website-rebuild.log
```

Or use a different location in your home directory:

```bash
0 1 * * * /path/to/prem-website/scripts/rebuild-prem-website.sh >> ~/prem-website-rebuild.log 2>&1
```

---

## Troubleshooting

### Script not found
- Use absolute paths in cron jobs
- Check file permissions: `ls -l /path/to/prem-website/scripts/rebuild-prem-website.sh`

### Environment variables not working
- Cron jobs don't inherit shell environment
- Source your `.env.premwebsite` file in the cron command
- Or set variables directly in the cron line

### Build fails
- Check Node.js version: `node --version` (needs 18+)
- Ensure dependencies are installed: `npm install`
- Check build logs in the log file

### Newsletter not sending
- Verify Redis credentials are correct
- Check that blog posts exist in `content/blog/`
- Review log file for specific errors
