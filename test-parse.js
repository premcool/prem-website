const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');

const blogDir = path.join(__dirname, 'content/blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

console.log(`Found ${files.length} blog post files:\n`);

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const result = matter(content);
  
  console.log(`File: ${file}`);
  console.log(`  Title: ${result.data.title || 'MISSING'}`);
  console.log(`  Date: ${result.data.date || 'MISSING'}`);
  console.log(`  Slug: ${result.data.slug || 'MISSING'}`);
  console.log(`  Valid: ${!!result.data.title && !!result.data.date ? 'YES' : 'NO'}`);
  console.log('');
});
