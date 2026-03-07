#!/usr/bin/env node

/**
 * Rebuild script that:
 * 1. Pulls latest changes from GitHub
 * 2. Rebuilds the Next.js site
 * 3. Detects new blog posts
 * 4. Sends newsletters for new posts
 * 
 * Usage: node scripts/rebuild-and-send-newsletter.js
 * 
 * Environment variables required:
 * - NEXT_PUBLIC_SITE_URL
 * - NEWSLETTER_WEBHOOK_SECRET (optional but recommended)
 * - UPSTASH_REDIS_REST_URL (for tracking sent newsletters)
 * - UPSTASH_REDIS_REST_TOKEN (for tracking sent newsletters)
 * 
 * Requires Node.js 18+ for native fetch support
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Ensure we're in the project root before requiring modules
// __dirname is the scripts directory, so go up one level
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

// Check if node_modules exists, if not, install dependencies
const nodeModulesPath = path.join(projectRoot, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 node_modules not found. Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: projectRoot });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    console.error('   Please run manually: cd ' + projectRoot + ' && npm install');
    process.exit(1);
  }
}

// Check if @upstash/redis is installed
const upstashRedisPath = path.join(nodeModulesPath, '@upstash', 'redis');

if (!fs.existsSync(upstashRedisPath)) {
  console.log('📦 @upstash/redis not found. Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: projectRoot });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    console.error('   Please run manually: cd ' + projectRoot + ' && npm install');
    process.exit(1);
  }
}

// Now require the module - should work since we're in project root and dependencies are installed
let Redis;
try {
  // Use normal require - Node.js will find it in node_modules since we're in project root
  Redis = require('@upstash/redis').Redis;
} catch (error) {
  console.error('❌ Failed to load @upstash/redis:');
  console.error('   Error:', error.message);
  console.error('   Current directory:', process.cwd());
  console.error('   Project root:', projectRoot);
  console.error('   Module should be at:', upstashRedisPath);
  console.error('   Module exists:', fs.existsSync(upstashRedisPath));
  console.error('');
  console.error('   Please ensure dependencies are installed:');
  console.error('   cd ' + projectRoot + ' && npm install');
  process.exit(1);
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prems.in';
const webhookSecret = process.env.NEWSLETTER_WEBHOOK_SECRET || '';
const SENT_NEWSLETTERS_KEY = 'newsletter:sent_posts';
const postsDirectory = path.join(projectRoot, 'content/blog');

// Initialize Redis client
function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.warn('Redis not configured. Newsletter tracking will be skipped.');
    return null;
  }

  return new Redis({
    url,
    token,
  });
}

// Get list of posts that have already had newsletters sent
async function getSentNewsletters(redis) {
  if (!redis) return new Set();
  
  try {
    const sent = await redis.smembers(SENT_NEWSLETTERS_KEY);
    return new Set(sent.map(s => String(s)));
  } catch (error) {
    console.error('Error reading sent newsletters from Redis:', error);
    return new Set();
  }
}

// Mark a post as having newsletter sent
async function markNewsletterSent(redis, slug) {
  if (!redis) return;
  
  try {
    await redis.sadd(SENT_NEWSLETTERS_KEY, slug);
  } catch (error) {
    console.error(`Error marking newsletter as sent for ${slug}:`, error);
  }
}

// Extract slug from markdown file
function getSlugFromFile(filePath) {
  const fileName = path.basename(filePath, '.md');
  return fileName;
}

// Get all blog post files
function getAllBlogPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  try {
    const files = fs.readdirSync(postsDirectory);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        slug: getSlugFromFile(file),
        path: path.join(postsDirectory, file),
        mtime: fs.statSync(path.join(postsDirectory, file)).mtime,
      }));
  } catch (error) {
    console.error('Error reading blog posts directory:', error);
    return [];
  }
}

// Send newsletter for a post (using Node.js http/https)
function sendNewsletter(slug) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${baseUrl}/api/newsletter/send`);
    const postData = JSON.stringify({ slug });

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...(webhookSecret && { 'x-webhook-secret': webhookSecret }),
      },
    };

    const client = url.protocol === 'https:' ? https : http;

    const req = client.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        } else {
          reject(new Error(`Newsletter API error: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}

// Main function
async function main() {
  console.log('🚀 Starting rebuild and newsletter process...\n');
  console.log(`📁 Working directory: ${process.cwd()}\n`);


  // Step 1: Pull latest changes (if in git repo)
  try {
    console.log('📥 Pulling latest changes from GitHub...');
    execSync('git pull origin main', { stdio: 'inherit', cwd: projectRoot });
    console.log('✅ Latest changes pulled\n');
  } catch (error) {
    console.warn('⚠️  Could not pull from git (not a git repo or no changes):', error.message);
  }

  // Step 2: Rebuild Next.js site
  let buildAttempts = 0;
  const maxBuildAttempts = 2;
  
  while (buildAttempts < maxBuildAttempts) {
    try {
      console.log('🔨 Rebuilding Next.js site...');
      execSync('npm run build', { stdio: 'inherit', cwd: projectRoot });
      console.log('✅ Site rebuilt successfully\n');
      break; // Success, exit loop
    } catch (error) {
      buildAttempts++;
      
      if (buildAttempts >= maxBuildAttempts) {
        console.error('❌ Build failed after', maxBuildAttempts, 'attempts');
        console.error('   Error:', error.message);
        console.error('\n💡 Try cleaning and reinstalling dependencies:');
        console.error('   cd', projectRoot);
        console.error('   rm -rf node_modules package-lock.json');
        console.error('   npm install');
        process.exit(1);
      }
      
      // If first attempt failed, try cleaning and reinstalling
      console.warn('⚠️  Build failed. Cleaning and reinstalling dependencies...');
      try {
        // Remove node_modules and package-lock.json
        if (fs.existsSync(path.join(projectRoot, 'node_modules'))) {
          console.log('   Removing node_modules...');
          execSync('rm -rf node_modules', { stdio: 'inherit', cwd: projectRoot });
        }
        if (fs.existsSync(path.join(projectRoot, 'package-lock.json'))) {
          console.log('   Removing package-lock.json...');
          execSync('rm -f package-lock.json', { stdio: 'inherit', cwd: projectRoot });
        }
        
        console.log('   Installing fresh dependencies...');
        execSync('npm install', { stdio: 'inherit', cwd: projectRoot });
        console.log('✅ Dependencies reinstalled, retrying build...\n');
      } catch (cleanError) {
        console.error('❌ Failed to clean/reinstall:', cleanError.message);
        process.exit(1);
      }
    }
  }

  // Step 3: Detect new blog posts and send newsletters
  console.log('📧 Checking for new blog posts to send newsletters...');
  
  const redis = getRedisClient();
  const sentNewsletters = await getSentNewsletters(redis);
  const allPosts = getAllBlogPosts();
  
  const newPosts = allPosts.filter(post => !sentNewsletters.has(post.slug));

  if (newPosts.length === 0) {
    console.log('✅ No new blog posts found. All posts have newsletters sent.\n');
    return;
  }

  console.log(`📝 Found ${newPosts.length} new blog post(s):`);
  newPosts.forEach(post => console.log(`   - ${post.slug}`));
  console.log('');

  // Step 4: Send newsletters for new posts
  let successCount = 0;
  let errorCount = 0;

  for (const post of newPosts) {
    try {
      console.log(`📨 Sending newsletter for: ${post.slug}...`);
      const result = await sendNewsletter(post.slug);
      
      // Mark as sent only if successful
      await markNewsletterSent(redis, post.slug);
      
      console.log(`   ✅ Newsletter sent to ${result.success || 0} subscribers`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Failed to send newsletter: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Successfully sent: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   ❌ Failed: ${errorCount}`);
  }
  console.log('');
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
