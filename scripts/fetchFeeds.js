const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'SemiconPulse-RSS-Aggregator/1.0'
  }
});

const RSS_FEEDS = [
  { url: 'https://www.semiconductordigest.com/feed/', source: 'Semiconductor Digest', category: 'Industry' },
  { url: 'https://www.electronicsweekly.com/feed/', source: 'Electronics Weekly', category: 'Technology' },
  { url: 'https://semiengineering.com/feed/', source: 'Semiconductor Engineering', category: 'Engineering' },
  { url: 'https://www.eetimes.com/feed/', source: 'EE Times', category: 'Industry' },
  { url: 'https://www.anandtech.com/rss/', source: 'AnandTech', category: 'Technology' },
  { url: 'https://www.tomshardware.com/feeds/all', source: "Tom's Hardware", category: 'Technology' },
  { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge', category: 'Technology' },
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', category: 'Technology' },
  { url: 'https://www.extremetech.com/feed', source: 'ExtremeTech', category: 'Technology' },
  { url: 'https://www.digitimes.com/rss/daily.xml', source: 'Digitimes', category: 'Industry' },
  { url: 'https://www.trendforce.com/rss/news.xml', source: 'TrendForce', category: 'Industry' }
];

const KEYWORD_MAP = {
  'HBM': ['HBM', 'High Bandwidth Memory', 'HBM2', 'HBM3', 'HBM3E', 'HBM4'],
  'Foundry': ['TSMC', 'Samsung Foundry', 'Intel Foundry', 'foundry', 'fab', 'wafer'],
  'Equipment': ['ASML', 'Applied Materials', 'Lam Research', 'Tokyo Electron', 'KLA', 'AMAT'],
  'Memory': ['DRAM', 'NAND', 'memory chip', 'SK Hynix', 'Micron', 'flash memory', 'DDR5'],
  'AI': ['AI chip', 'GPU', 'NPU', 'NVIDIA', 'AMD', 'artificial intelligence', 'machine learning', 'Blackwell', 'Hopper'],
  'EUV': ['EUV', 'extreme ultraviolet', 'lithography', 'High-NA'],
  'Packaging': ['chiplet', 'packaging', '3D IC', 'CoWoS', 'HBM packaging', 'advanced packaging'],
  'Mobile': ['Qualcomm', 'MediaTek', 'mobile processor', 'smartphone chip', 'Snapdragon'],
  'Automotive': ['automotive semiconductor', 'EV chip', 'ADAS', 'automotive chip'],
  'Policy': ['chip act', 'export control', 'subsidy', 'tariff', 'sanction', 'CHIPS Act']
};

function extractTags(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const tags = new Set();
  for (const [tag, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
      tags.add(tag);
    }
  }
  return Array.from(tags);
}

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Unknown';
  }
}

function normalizeDate(dateString) {
  if (!dateString) return new Date().toISOString();
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function cleanText(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 300);
}

async function parseFeed(feedConfig) {
  try {
    console.log(`📡 Fetching: ${feedConfig.source}...`);
    const feed = await parser.parseURL(feedConfig.url);
    const articles = feed.items.map(item => ({
      title: item.title || 'Untitled',
      summary: cleanText(item.contentSnippet || item.description || ''),
      url: item.link || '',
      publishedAt: normalizeDate(item.pubDate || item.isoDate),
      source: feedConfig.source,
      sourceDomain: extractDomain(item.link || feedConfig.url),
      category: feedConfig.category,
      tags: extractTags(item.title || '', item.contentSnippet || item.description || '')
    }));
    console.log(`✅ ${feedConfig.source}: ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error(`❌ Failed to fetch ${feedConfig.source}:`, error.message);
    return [];
  }
}

async function fetchAllFeeds() {
  console.log('🚀 Starting RSS feed collection...\n');
  const results = await Promise.all(RSS_FEEDS.map(feed => parseFeed(feed)));
  const allArticles = results.flat();
  const uniqueArticles = Array.from(
    new Map(allArticles.map(article => [article.url, article])).values()
  );
  uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const relevantArticles = uniqueArticles.filter(a => a.tags.length > 0);
  console.log(`\n📊 Total unique articles: ${uniqueArticles.length}`);
  console.log(`🎯 Semiconductor-relevant articles: ${relevantArticles.length}`);
  return relevantArticles;
}

function calculateImportance(article) {
  let score = 0;
  const hoursAgo = (Date.now() - new Date(article.publishedAt)) / (1000 * 60 * 60);
  if (hoursAgo <= 24) score += 10;
  else if (hoursAgo <= 48) score += 5;
  const importantTags = ['HBM', 'AI', 'EUV', 'Foundry', 'Policy'];
  article.tags.forEach(tag => {
    if (importantTags.includes(tag)) score += 5;
  });
  score += article.tags.length * 2;
  return score;
}

async function saveToJson(articles) {
  const articlesWithScore = articles.map(article => ({
    ...article,
    importanceScore: calculateImportance(article)
  }));
  const topArticles = articlesWithScore
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 10)
    .map(({ importanceScore, ...article }) => article);
  const outputData = {
    generatedAt: new Date().toISOString(),
    totalArticles: articles.length,
    topArticles,
    allArticles: articles
  };
  const outputPath = path.join(__dirname, '../public/news.json');
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8');
  console.log(`\n💾 Saved to: ${outputPath}`);
  console.log(`📈 Top articles: ${topArticles.length}`);
  console.log(`📰 All articles: ${articles.length}`);
}

async function createDemoData() {
  const demoArticles = [
    {
      title: 'SK Hynix announces next-generation HBM3E memory for AI accelerators',
      summary: 'SK Hynix unveiled its latest HBM3E memory solution...',
      url: 'https://example.com/article1',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: 'Tech News Daily',
      sourceDomain: 'technews.com',
      category: 'Memory',
      tags: ['HBM', 'Memory', 'AI']
    },
    {
      title: 'TSMC accelerates 2nm node development with enhanced EUV technology',
      summary: 'Taiwan Semiconductor Manufacturing Company reported significant progress...',
      url: 'https://example.com/article2',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      source: 'Semiconductor Times',
      sourceDomain: 'semitimes.com',
      category: 'Foundry',
      tags: ['Foundry', 'EUV']
    },
    {
      title: 'NVIDIA unveils breakthrough GPU architecture for generative AI',
      summary: 'The new Blackwell architecture promises 5x performance improvement...',
      url: 'https://example.com/article3',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      source: 'AI Hardware News',
      sourceDomain: 'aihardware.com',
      category: 'AI',
      tags: ['AI', 'GPU']
    }
  ];
  await saveToJson(demoArticles);
  console.log('📝 Demo data created successfully');
}

async function main() {
  try {
    const articles = await fetchAllFeeds();
    if (articles.length === 0) {
      console.error('⚠️  No articles collected. Using demo data...');
      await createDemoData();
    } else {
      await saveToJson(articles);
    }
    console.log('\n✨ Feed collection completed successfully!');
  } catch (error) {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  }
}

main();
