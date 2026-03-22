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
 * - PREM_WEBSITE_GIT_BRANCH (optional, default: main)
 * - PREM_WEBSITE_GIT_REMOTE (optional, default: origin)
 * - PREM_WEBSITE_GIT_RESET_HARD=1 (optional) — after fetch, git reset --hard to match
 *   remote exactly (use on deploy servers with no local commits to keep)
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
  // Clear require cache for this module in case it's corrupted
  const modulePath = require.resolve('@upstash/redis');
  delete require.cache[modulePath];
  
  // Use normal require - Node.js will find it in node_modules since we're in project root
  const upstashRedis = require('@upstash/redis');
  Redis = upstashRedis.Redis;
} catch (error) {
  console.error('❌ Failed to load @upstash/redis:');
  console.error('   Error:', error.message);
  console.error('   Current directory:', process.cwd());
  console.error('   Project root:', projectRoot);
  console.error('   Module should be at:', upstashRedisPath);
  console.error('   Module exists:', fs.existsSync(upstashRedisPath));
  
  // If module exists but can't be loaded, it might be corrupted
  if (fs.existsSync(upstashRedisPath)) {
    console.error('');
    console.error('   Module exists but appears corrupted. Try reinstalling:');
    console.error('   cd ' + projectRoot + ' && rm -rf node_modules/@upstash && npm install');
  } else {
    console.error('');
    console.error('   Please ensure dependencies are installed:');
    console.error('   cd ' + projectRoot + ' && npm install');
  }
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

// Canonical slug for Redis + API: frontmatter slug when set, else filename (matches readBlogPost)
function getCanonicalSlugForPostFile(filePath) {
  const fileName = path.basename(filePath, '.md');
  try {
    const matter = require('gray-matter');
    const result = matter(fs.readFileSync(filePath, 'utf8'));
    const fromMatter = result.data.slug;
    if (fromMatter != null && String(fromMatter).trim() !== '') {
      return String(fromMatter).trim();
    }
  } catch {
    // missing/invalid frontmatter — use filename
  }
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
      .map(file => {
        const fullPath = path.join(postsDirectory, file);
        return {
          slug: getCanonicalSlugForPostFile(fullPath),
          path: fullPath,
          mtime: fs.statSync(fullPath).mtime,
        };
      });
  } catch (error) {
    console.error('Error reading blog posts directory:', error);
    return [];
  }
}

// Read blog post file and extract frontmatter and content
function readBlogPost(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matter = require('gray-matter');
    const result = matter(fileContents);
    
    return {
      slug: result.data.slug || path.basename(filePath, '.md'),
      title: result.data.title,
      date: result.data.date,
      category: result.data.category,
      image: result.data.image,
      content: result.content.trim(),
    };
  } catch (error) {
    throw new Error(`Failed to read blog post file ${filePath}: ${error.message}`);
  }
}

// Send newsletter for a post (using Node.js http/https)
function sendNewsletter(postData) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${baseUrl}/api/newsletter/send`);
    const jsonData = JSON.stringify(postData);

    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(jsonData),
    };

    // Add webhook secret if configured (trim whitespace)
    if (webhookSecret && webhookSecret.trim() !== '') {
      headers['x-webhook-secret'] = webhookSecret.trim();
    }

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: headers,
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

    req.write(jsonData);
    req.end();
  });
}

// Main function
async function main() {
  console.log('🚀 Starting rebuild and newsletter process...\n');
  console.log(`📁 Working directory: ${process.cwd()}\n`);


  // Step 1: Sync with remote (explicit merge strategy avoids Git 2.27+ "divergent branches" fatal)
  const gitBranch = process.env.PREM_WEBSITE_GIT_BRANCH || 'main';
  const gitRemote = process.env.PREM_WEBSITE_GIT_REMOTE || 'origin';
  const gitResetHard = process.env.PREM_WEBSITE_GIT_RESET_HARD === '1';

  try {
    console.log('📥 Syncing repository with GitHub...');
    if (gitResetHard) {
      execSync(`git fetch ${gitRemote}`, { stdio: 'inherit', cwd: projectRoot });
      execSync(`git reset --hard ${gitRemote}/${gitBranch}`, {
        stdio: 'inherit',
        cwd: projectRoot,
      });
    } else {
      execSync(`git pull --no-rebase ${gitRemote} ${gitBranch}`, {
        stdio: 'inherit',
        cwd: projectRoot,
      });
    }
    console.log('✅ Repository is up to date\n');
  } catch (error) {
    console.warn('⚠️  Git sync failed — build and newsletters use whatever is already on disk.');
    console.warn('   Error:', error.message);
    console.warn('   If this server should always match GitHub: fix merge conflicts, or set');
    console.warn('   PREM_WEBSITE_GIT_RESET_HARD=1 (discards local commits on this clone).');
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
  
  // Debug: Check if webhook secret is loaded
  if (!webhookSecret || webhookSecret.trim() === '') {
    console.warn('⚠️  WARNING: NEWSLETTER_WEBHOOK_SECRET is not set or empty.');
    console.warn('   The newsletter API will reject requests without authentication.');
    console.warn('   Please set NEWSLETTER_WEBHOOK_SECRET in your .env.premwebsite file.');
    console.warn('   Current value:', JSON.stringify(process.env.NEWSLETTER_WEBHOOK_SECRET || 'NOT SET'));
    console.warn('');
  } else {
    const secretPreview = webhookSecret.substring(0, 10) + '...';
    console.log('✅ Webhook secret is configured (length: ' + webhookSecret.length + ' chars, starts with: ' + secretPreview + ')\n');
  }
  
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
      
      // Read the blog post file to get full post data
      let postData;
      try {
        const fullPost = readBlogPost(post.path);
        postData = fullPost;
        console.log(`   📄 Read post: "${fullPost.title}" (${fullPost.date})`);
      } catch (readError) {
        console.error(`   ⚠️  Failed to read post file, falling back to slug-only: ${readError.message}`);
        // Fallback to slug-only if file read fails
        postData = { slug: post.slug };
      }
      
      const result = await sendNewsletter(postData);

      const nSent = typeof result.success === 'number' ? result.success : 0;
      // API also SADDs to Redis when emails succeed; keep script-side mark for older deploys or same-Redis backup
      if (nSent > 0) {
        await markNewsletterSent(redis, post.slug);
      }

      console.log(`   ✅ Newsletter sent to ${nSent} subscribers`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Failed to send newsletter: ${error.message}`);
      
      // If it's a 404 error (post not found), mark as sent to skip in future
      if (error.message.includes('404') || error.message.includes('not found')) {
        console.error(`   ⚠️  Post not found - marking as sent to skip in future runs`);
        await markNewsletterSent(redis, post.slug);
        // Don't count as error since we've handled it
        continue;
      }
      
      // If it's a 401 error, provide more helpful debugging
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        console.error(`   💡 This is an authentication error. Check:`);
        console.error(`      1. NEWSLETTER_WEBHOOK_SECRET is set in .env.premwebsite`);
        console.error(`      2. The secret matches what's configured in your Next.js app`);
        console.error(`      3. The secret doesn't have extra quotes or whitespace`);
      }
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
