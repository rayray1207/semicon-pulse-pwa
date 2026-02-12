/**
 * RSS 피드 수집 스크립트
 * 여러 RSS 소스에서 반도체 뉴스를 수집하여 하나의 JSON으로 통합합니다.
 * 
 * 실행: node scripts/fetchFeeds.js
 * 출력: public/news.json
 */

const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

// RSS 파서 초기화
const parser = new Parser({
  timeout: 10000, // 10초 타임아웃
  headers: {
    'User-Agent': 'SemiconPulse-RSS-Aggregator/1.0'
  }
});

// RSS 피드 소스 목록
// 실제 배포 시 권위 있는 반도체 뉴스 소스로 교체하세요
const RSS_FEEDS = [
  {
    url: 'https://www.semiconductordigest.com/feed/',
    source: 'Semiconductor Digest',
    category: 'Industry'
  },
  {
    url: 'https://www.electronicsweekly.com/feed/',
    source: 'Electronics Weekly',
    category: 'Technology'
  },
  {
    url: 'https://semiengineering.com/feed/',
    source: 'Semiconductor Engineering',
    category: 'Engineering'
  },
  // 더 많은 피드 추가 가능
  // 주의: 각 사이트의 robots.txt와 이용약관을 확인하세요
];

// 반도체 관련 키워드 맵 (카테고리 태깅용)
const KEYWORD_MAP = {
  'HBM': ['HBM', 'High Bandwidth Memory', 'HBM2', 'HBM3'],
  'Foundry': ['TSMC', 'Samsung Foundry', 'Intel Foundry', 'foundry', 'fab'],
  'Equipment': ['ASML', 'Applied Materials', 'Lam Research', 'Tokyo Electron', 'KLA'],
  'Memory': ['DRAM', 'NAND', 'memory chip', 'SK Hynix', 'Micron'],
  'AI': ['AI chip', 'GPU', 'NPU', 'NVIDIA', 'AMD', 'artificial intelligence'],
  'EUV': ['EUV', 'extreme ultraviolet', 'lithography'],
  'Packaging': ['chiplet', 'packaging', '3D IC', 'CoWoS', 'HBM packaging'],
  'Mobile': ['Qualcomm', 'MediaTek', 'mobile processor', 'smartphone chip'],
  'Automotive': ['automotive semiconductor', 'EV chip', 'ADAS'],
  'Policy': ['chip act', 'export control', 'subsidy', 'tariff', 'sanction']
};

/**
 * 제목과 설명에서 관련 태그 추출
 */
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

/**
 * URL에서 도메인만 추출
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Unknown';
  }
}

/**
 * 날짜 문자열을 표준 ISO 형식으로 변환
 */
function normalizeDate(dateString) {
  if (!dateString) return new Date().toISOString();
  
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

/**
 * HTML 태그 제거 및 텍스트 정제
 */
function cleanText(html) {
  if (!html) return '';
  
  return html
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // 중복 공백 제거
    .trim()
    .substring(0, 300); // 최대 300자로 제한
}

/**
 * 단일 RSS 피드 파싱
 */
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
      tags: extractTags(
        item.title || '',
        item.contentSnippet || item.description || ''
      )
    }));
    
    console.log(`✅ ${feedConfig.source}: ${articles.length} articles`);
    return articles;
    
  } catch (error) {
    console.error(`❌ Failed to fetch ${feedConfig.source}:`, error.message);
    return []; // 실패해도 계속 진행
  }
}

/**
 * 모든 피드 수집 및 통합
 */
async function fetchAllFeeds() {
  console.log('🚀 Starting RSS feed collection...\n');
  
  // 모든 피드를 병렬로 처리
  const results = await Promise.all(
    RSS_FEEDS.map(feed => parseFeed(feed))
  );
  
  // 결과 통합 및 중복 제거
  const allArticles = results.flat();
  
  // URL 기준으로 중복 제거
  const uniqueArticles = Array.from(
    new Map(allArticles.map(article => [article.url, article])).values()
  );
  
  // 날짜 기준 내림차순 정렬 (최신순)
  uniqueArticles.sort((a, b) => 
    new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  
  console.log(`\n📊 Total unique articles: ${uniqueArticles.length}`);
  return uniqueArticles;
}

/**
 * 중요도 점수 계산 (Top 섹션용)
 */
function calculateImportance(article) {
  let score = 0;
  
  // 최근성 (24시간 이내 +10점, 48시간 이내 +5점)
  const hoursAgo = (Date.now() - new Date(article.publishedAt)) / (1000 * 60 * 60);
  if (hoursAgo <= 24) score += 10;
  else if (hoursAgo <= 48) score += 5;
  
  // 중요 키워드 가중치
  const importantTags = ['HBM', 'AI', 'EUV', 'TSMC', 'Policy'];
  article.tags.forEach(tag => {
    if (importantTags.includes(tag)) score += 5;
  });
  
  // 여러 태그 = 더 포괄적인 내용
  score += article.tags.length * 2;
  
  return score;
}

/**
 * JSON 파일 저장
 */
async function saveToJson(articles) {
  // Top 기사 선정 (중요도 점수 기준)
  const articlesWithScore = articles.map(article => ({
    ...article,
    importanceScore: calculateImportance(article)
  }));
  
  const topArticles = articlesWithScore
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 10)
    .map(({ importanceScore, ...article }) => article); // 점수 제거
  
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

/**
 * 메인 실행 함수
 */
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

/**
 * 데모 데이터 생성 (피드 수집 실패 시 또는 초기 테스트용)
 */
async function createDemoData() {
  const demoArticles = [
    {
      title: 'SK Hynix announces next-generation HBM3E memory for AI accelerators',
      summary: 'SK Hynix unveiled its latest HBM3E memory solution, delivering unprecedented bandwidth for AI and machine learning workloads...',
      url: 'https://example.com/article1',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: 'Tech News Daily',
      sourceDomain: 'technews.com',
      category: 'Memory',
      tags: ['HBM', 'Memory', 'AI']
    },
    {
      title: 'TSMC accelerates 2nm node development with enhanced EUV technology',
      summary: 'Taiwan Semiconductor Manufacturing Company reported significant progress in 2nm process development, leveraging advanced EUV lithography...',
      url: 'https://example.com/article2',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      source: 'Semiconductor Times',
      sourceDomain: 'semitimes.com',
      category: 'Foundry',
      tags: ['Foundry', 'EUV']
    },
    {
      title: 'U.S. and Japan strengthen semiconductor supply chain partnership',
      summary: 'New bilateral agreement aims to secure critical semiconductor materials and reduce dependency on single-source suppliers...',
      url: 'https://example.com/article3',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: 'Global Policy Review',
      sourceDomain: 'globalpolicy.com',
      category: 'Policy',
      tags: ['Policy']
    },
    {
      title: 'NVIDIA unveils breakthrough GPU architecture for generative AI',
      summary: 'The new Blackwell architecture promises 5x performance improvement in large language model training and inference...',
      url: 'https://example.com/article4',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      source: 'AI Hardware News',
      sourceDomain: 'aihardware.com',
      category: 'AI',
      tags: ['AI', 'GPU']
    },
    {
      title: 'Samsung expands advanced packaging capabilities with new Texas facility',
      summary: 'Samsung Electronics breaks ground on a state-of-the-art packaging plant to support growing demand for chiplet-based designs...',
      url: 'https://example.com/article5',
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      source: 'Industry Insider',
      sourceDomain: 'industryinsider.com',
      category: 'Packaging',
      tags: ['Packaging', 'Foundry']
    }
  ];
  
  await saveToJson(demoArticles);
  console.log('📝 Demo data created successfully');
}

// 스크립트 실행
main();
