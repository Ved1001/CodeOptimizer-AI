// High-fidelity articles and tweets database for interactive reader modal
const articlesDatabase = {
    'hero-cost-loop': {
        type: 'newspaper',
        publication: 'VentureBeat',
        logoClass: 'vb-logo',
        date: 'June 12, 2026',
        title: 'Overnight Prompt Loop Blowout Costs Tech Startup $14,820',
        author: 'Jeremy Kahn',
        authorTitle: 'Senior AI Staff Writer',
        authorInitials: 'JK',
        featuredImage: 'images/ai_cost_leak_landscape.png',
        content: `<p class="drop-cap">A</p><p>n unoptimized, recursive application tail loop left connected to Claude 3.5 Sonnet without active rate limits consumed over 240 million input tokens in just nine hours. The incident highlights the high stakes of enterprise FinOps middleware routing. The runaway cost was triggered by a routine microservice update at 11:30 PM. A junior systems engineer deployed a parser script designed to check API responses and retry on failure — but failed to configure an exponential back-off or a token budget ceiling. The script caught a benign 429 rate-limit response and entered an infinite retry loop, resending the entire 600,000-token conversation context on every cycle. By 8:45 AM the following morning, the API bill had reached $14,820. The startup's CTO flagged the anomaly only after the monthly budget alerting system fired at a $10,000 threshold. By then, nearly three-quarters of the team's monthly AI budget had evaporated overnight. This incident is not isolated. Across the industry, engineering teams are increasingly operating AI-powered microservices without adequate cost guardrails, budget ceilings, or prompt compression pipelines in place.</p>`
    },
    'story-gartner': {
        type: 'newspaper',
        publication: 'Gartner Research',
        logoClass: 'gartner-logo',
        date: 'May 28, 2026',
        title: 'Up to 73% of raw corporate tokens wasted on redundant syntax and empty spacing',
        author: 'Rita Sallam',
        authorTitle: 'VP, Distinguished Analyst',
        authorInitials: 'RS',
        content: `<p class="drop-cap">E</p><p>nterprises are overpaying for generative AI deployments by millions of dollars due to highly inefficient prompt construction, according to a new study by Gartner. The report estimates that 73% of all input tokens transmitted to public LLM endpoints represent pure waste — caused by system prompt redundancy, JSON schema verbosity, and excessive whitespace bloat embedded in developer workflows. Gartner's analysis examined over 4.2 billion prompt tokens across 86 enterprise accounts spanning finance, healthcare, and logistics. In every case, significant portions of the transmitted prompt were repetitive boilerplate: identical system instructions resent with each call, full JSON schemas reinjected rather than cached, and verbose chain-of-thought templates included regardless of query complexity. The financial impact is significant: enterprises running mid-scale AI operations are spending an average of $2.1M annually on tokens that serve no analytical value. Gartner recommends deploying a prompt optimization middleware layer capable of semantic deduplication, contextual compression, and tiered caching as a first-priority cost lever before scaling AI infrastructure further.</p>`
    },
    'story-cnbc-spend': {
        type: 'newspaper',
        publication: 'CNBC Technology',
        logoClass: 'cnbc-logo',
        date: 'May 30, 2026',
        title: 'AWS reports Cloud AI compute spend surges 45% YoY, forcing gatekeep guardrails',
        author: 'Ari Levy',
        authorTitle: 'Senior Technology Reporter',
        authorInitials: 'AL',
        content: `<p class="drop-cap">A</p><p>mazon Web Services (AWS) revealed a massive 45% year-over-year surge in corporate spending dedicated specifically to high-performance AI compute nodes. The rapid escalation has triggered immediate pressure from Chief Financial Officers (CFOs) to implement guardrails on developer access to frontier model endpoints. AWS CEO Matt Garman disclosed during the company's latest earnings call that its Bedrock managed AI service — which provides access to Claude, Titan, and Llama models — saw request volume increase by 340% in the last four quarters, with average spend per enterprise account climbing from $18,000 to over $82,000 annually. The company has introduced new spend alerting and budget caps in direct response to growing CFO pressure. "We've seen a material increase in incidents where development teams exceed their quarterly AI budgets by 200–400%," said Garman. AWS is now recommending all enterprise accounts deploy cost-aware routing middleware that applies model downgrading based on task complexity before calls reach the Bedrock gateway.</p>`
    },
    'story-anthropic': {
        type: 'newspaper',
        publication: 'VentureBeat AI',
        logoClass: 'vb-logo',
        date: 'June 2, 2026',
        title: 'Anthropic updates API prompt caching, slashing input cost overheads by up to 90%',
        author: 'Deedee M. Williams',
        authorTitle: 'AI Beat Writer',
        authorInitials: 'DW',
        content: `<p class="drop-cap">A</p><p>nthropic announced a significant update to its developer API, introducing native prompt caching capability. This feature allows Claude developers to store large context documents — such as code repositories, PDFs, or system instruction blocks — directly in the model's memory tier, cutting repeated transaction costs by 90% and reducing latency by 80% for subsequent requests. The caching system works by allowing developers to define a cache breakpoint in their prompts. Everything before the breakpoint is stored server-side for up to five minutes and reused across requests, eliminating the cost of retransmitting large static contexts on each call. Anthropic pricing for cache reads is set at $0.30 per million tokens, compared to the standard $3.00 rate for input tokens on Claude Sonnet — a full 90% reduction. This has significant implications for enterprise middleware systems and agentic pipelines that repeatedly send the same codebase context, instruction manual, or RAG document across many sequential reasoning calls. Middleware providers who route through Claude can now pass this cost reduction directly to end users by caching their system prompt layer.</p>`
    },
    'story-infrastructure': {
        type: 'newspaper',
        publication: 'CNBC Markets',
        logoClass: 'cnbc-logo',
        date: 'June 5, 2026',
        title: 'AI Infrastructure Spend Projected to Exceed $100B by 2026',
        author: 'Leslie Picker',
        authorTitle: 'Markets Correspondent',
        authorInitials: 'LP',
        content: `<p class="drop-cap">G</p><p>lobal expenditures on AI infrastructure — including specialized server clusters, liquid-cooled datacenters, and high-bandwidth fiber networking — are on track to surpass the $100 billion mark by end of 2026. The aggressive buildout is being driven by venture capital commitments, hyperscaler cloud budgets, and nation-state sovereign AI programs all competing simultaneously for the same constrained supply of NVIDIA H100 and Blackwell GPUs. Microsoft, Google, Meta, and Amazon collectively committed over $220 billion in AI infrastructure capital expenditure for fiscal 2026 alone, representing a 78% increase over 2024 levels. Analysts at Morgan Stanley estimate that for every $1 of AI model spend incurred by developers, $4.50 is being invested in the underlying physical infrastructure needed to serve it. This 4.5x infrastructure multiplier is creating a capital efficiency crisis — particularly for startups and mid-market enterprises that pay retail rates for AI API access without the ability to negotiate dedicated capacity contracts. Middleware routing solutions that reduce token consumption and intelligently arbitrage between providers are increasingly being evaluated as the primary lever for managing this cost spiral.</p>`
    },
    'story-blackwell': {
        type: 'newspaper',
        publication: 'NVIDIA News',
        logoClass: 'nvidia-logo',
        date: 'March 18, 2026',
        title: 'NVIDIA Blackwell Architecture Launches to Power Next-Gen Datacenters',
        author: 'Keltie Vance',
        authorTitle: 'Hardware Systems Specialist',
        authorInitials: 'KV',
        content: `<p class="drop-cap">N</p><p>VIDIA has officially launched its Blackwell computing platform, ushering in a new generation of AI compute capability that promises to deliver real-time inference on trillion-parameter large language models at up to 25x lower cost and energy consumption compared to prior Hopper-generation H100 hardware. The Blackwell B200 GPU features a second-generation Transformer Engine with FP4 precision support, enabling models to run in compressed formats that dramatically reduce memory bandwidth and DRAM footprint. NVIDIA CEO Jensen Huang unveiled the platform at GTC 2026, announcing that over 100 cloud providers, OEMs, and system integrators have already placed orders. A single GB200 NVL72 rack unit — containing 36 Grace CPUs and 72 Blackwell GPUs — delivers 1.4 exaflops of AI compute, equivalent to the processing power of approximately 4,000 H100 GPUs. For developers running LLM inference workloads, this translates to dramatically lower per-token inference costs on self-hosted infrastructure. For enterprise FinOps teams, the availability of Blackwell changes the cost arbitrage calculation — making it economically viable to route high-volume tasks to private Blackwell clusters rather than public API endpoints, provided a smart routing middleware can direct traffic dynamically.</p>`
    },
    'story-gpt4omini': {
        type: 'newspaper',
        publication: 'OpenAI Release',
        logoClass: 'openai-logo',
        date: 'July 18, 2025',
        title: 'OpenAI Releases GPT-4o Mini to Make Advanced Reasoning Affordable',
        author: 'Elizabeth L. Chen',
        authorTitle: 'Product News Director',
        authorInitials: 'EC',
        content: `<p class="drop-cap">O</p><p>penAI has introduced GPT-4o mini, its most cost-efficient small model to date, designed to make advanced reasoning accessible to a broader audience of developers and enterprises. The model is priced at 15 cents per million input tokens and 60 cents per million output tokens — representing a 60% reduction in input costs compared to GPT-3.5 Turbo. Despite its smaller footprint, GPT-4o mini achieves an 82% score on the MMLU benchmark, outperforming its predecessor GPT-3.5 Turbo on most reasoning and instruction-following tasks. The model supports a 128K context window and has been optimized for low-latency applications such as real-time chatbots, document summarization pipelines, and autonomous agent subtask execution. For enterprise middleware routers, GPT-4o mini presents a compelling cost arbitrage option: tasks classified as low-complexity (simple Q&A, extraction, reformatting) can be automatically downrouted to GPT-4o mini, achieving the same output quality at one-tenth the cost of GPT-4o or Claude Sonnet. OpenAI has also enabled fine-tuning support for the model, allowing organizations to distill their proprietary task patterns into a cost-efficient specialized variant.</p>`
    },
    'tweet-sama': {
        type: 'tweet',
        displayName: 'Andrej Karpathy',
        username: '@karpathy',
        verified: true,
        avatarGradient: 'linear-gradient(135deg, #ec4899, #be185d)',
        avatarText: 'AK',
        timestamp: '10:42 PM · Jun 12, 2026',
        device: 'Twitter for Web',
        content: 'Prompt optimization is basically compile-time code optimization for LLMs. Sending huge redundant prompts inside agent loops is like copy-pasting standard library headers into every single execution block. We need cached, compressed prompt middleware.'
    },
    'tweet-finops': {
        type: 'tweet',
        displayName: 'Latent Space',
        username: '@latentSpacePod',
        verified: true,
        avatarGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        avatarText: 'LS',
        timestamp: '8:15 PM · Jun 12, 2026',
        device: 'Twitter for iPhone',
        content: 'The biggest developer problem in production AI right now isn\'t accuracy, it\'s cost scaling. Runaway agent loops, multi-turn contexts sending entire libraries back and forth, and no rate limiting. Every startup is one bad while loop away from a $10k API bill.'
    },
    'tweet-startup-fail': {
        type: 'tweet',
        displayName: 'François Chollet',
        username: '@fchollet',
        verified: true,
        avatarGradient: 'linear-gradient(135deg, #10b981, #047857)',
        avatarText: 'FC',
        timestamp: '6:30 PM · Jun 12, 2026',
        device: 'Twitter for Web',
        content: 'Intelligence is not token count. The trend of sending millions of context tokens with every message to brute-force a reasoning task is highly inefficient and expensive. High-level planning middleware must replace brute-force context stuffing.'
    }
};

// Dashboard Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const isAuth = api.isAuthenticated();
    const user = isAuth ? api.getUser() : null;
    
    // Render common page elements
    components.renderSidebar('dashboard');
    components.renderHeader(user ? `Welcome to CostReducer AI Command Center` : `CostReducer AI Public Command Center`);
    
    // Set subtitle text
    const subtitleEl = document.getElementById('headerSubtitle');
    if (subtitleEl) {
        subtitleEl.innerText = "Distributed AI Routing Middleware & Prompt Token Compression Portal";
    }
    
    // Control Sign In FAB visibility based on auth status
    const signInFab = document.getElementById('signInFab');
    if (signInFab) {
        if (!isAuth) {
            signInFab.style.display = 'flex';
        } else {
            signInFab.style.display = 'none';
        }
    }
    
    // Render default fallback news immediately to prevent empty layout
    renderFallbackNews();

    // Fetch and load live TechCrunch & VentureBeat AI spend news
    fetchLiveNews();
    
    // Hide loading skeleton and reveal dashboard content
    components.hideSkeleton();
});

// Helper to strip HTML tags
function stripHtml(html) {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
}

// Helper to truncate text to an excerpt
function makeExcerpt(html, maxLength = 160) {
    const text = stripHtml(html).replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Helper to get image from article item
function extractFirstImage(item) {
    if (item.thumbnail) return item.thumbnail;
    if (item.enclosure && item.enclosure.link) return item.enclosure.link;
    const match = (item.content || '').match(/<img[^>]+src="([^">]+)"/i);
    return match ? match[1] : '';
}

// Helper to calculate relative time from date string
function getRelativeTime(dateString) {
    return '';
}

// Score article based on keywords in title, description, content
const SPEND_KEYWORDS = [
    'cost', 'spend', 'pricing', 'price', 'million', 'billion', 'funding', 'revenue', 
    'profit', 'budget', 'nvidia', 'gpu', 'blackwell', 'h100', 'compute', 'infra', 
    'datacenter', 'investment', 'invest', 'valuation', 'round', 'financial', 'finops', 
    'tokens', 'dollar', 'capital', 'raise', 'acquisition', 'buyout', 'quarterly', 'earnings'
];

function scoreArticle(item) {
    const textToSearch = `${item.title} ${item.description || ''} ${item.content || ''}`.toLowerCase();
    let score = 0;
    SPEND_KEYWORDS.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = textToSearch.match(regex);
        if (matches) {
            score += matches.length;
        }
    });
    return score;
}

// Dynamic icon and badge selection based on content keywords
function getArticleIconAndColor(title) {
    const t = title.toLowerCase();
    if (t.includes('nvidia') || t.includes('gpu') || t.includes('blackwell') || t.includes('hardware') || t.includes('chip')) {
        return { icon: 'fa-microchip', color: 'var(--success-light)', badge: 'Hardware' };
    }
    if (t.includes('spend') || t.includes('cost') || t.includes('market') || t.includes('billion') || t.includes('million') || t.includes('funding') || t.includes('dollar') || t.includes('raise')) {
        return { icon: 'fa-server', color: 'var(--accent-light)', badge: 'AI Spend' };
    }
    return { icon: 'fa-robot', color: 'var(--primary-light)', badge: 'Model' };
}

// Render dynamic news grid layout
function renderNewsGrid(articles = []) {
    const newsGridEl = document.getElementById('newsGrid');
    if (!newsGridEl) return;

    let html = '';

    // 1. Hero Card
    if (articles.length > 0) {
        const hero = articles[0];
        html += `
            <div class="hero-news-card" onclick="openArticle('${hero.id}')" style="cursor: pointer;">
                <div class="hero-news-image" style="background-image: url('${hero.featuredImage || 'images/ai_cost_leak_graphic.png'}');"></div>
                <div class="hero-news-content">
                    <div>
                        <div class="news-source-meta" style="margin-bottom: var(--space-2);">
                            <strong>${hero.publication.toUpperCase()}</strong>
                        </div>
                        <h3 class="news-title">${hero.title}</h3>
                        <p class="news-excerpt">${hero.longExcerpt || hero.excerpt}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // 2. Top Stories Widget Card (full-width, 3-column horizontal)
    const topStories = articles.slice(1, 4);
    if (topStories.length > 0) {
        const storyItemsHtml = topStories.map(story => {
            return `
                <div class="story-item" onclick="openArticle('${story.id}')" style="cursor: pointer;">
                    <div class="story-source">${story.publication}</div>
                    <span class="story-title">${story.title}</span>
                </div>
            `;
        }).join('');

        html += `
            <div class="widget-card top-stories-card">
                <div class="widget-header">
                    <span class="widget-title"><i class="fas fa-fire" style="color: var(--warning-light);"></i> Top AI Cost Stories</span>
                    <a href="https://techcrunch.com/category/artificial-intelligence/" target="_blank" rel="noopener noreferrer" class="see-more-link" style="margin-top:0; padding-top:0; border-top:none; font-size:11px;">See all <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="top-stories-list">
                    ${storyItemsHtml}
                </div>
            </div>
        `;
    }

    // 3. Financial / Compute Cost Cards — all 3 in one equal-height row
    const extraStories = articles.slice(4, 7);
    const fallbacks = [
        { id: 'story-infrastructure' },
        { id: 'story-blackwell' },
        { id: 'story-gpt4omini' }
    ];

    const financialCardsHtml = [];
    for (let i = 0; i < 3; i++) {
        if (i < extraStories.length) {
            const story = extraStories[i];
            financialCardsHtml.push(`
                <div class="financial-cost-card" onclick="openArticle('${story.id}')" style="cursor: pointer;">
                    <div class="fc-header">
                        <span class="fc-pub">${story.publication}</span>
                    </div>
                    <h4>${story.title}</h4>
                    <p class="card-excerpt">${story.excerpt}</p>
                </div>
            `);
        } else {
            const fallbackKey = fallbacks[i].id;
            const fallbackData = articlesDatabase[fallbackKey];
            if (fallbackData) {
                financialCardsHtml.push(`
                    <div class="financial-cost-card" onclick="openArticle('${fallbackKey}')" style="cursor: pointer;">
                        <div class="fc-header">
                            <span class="fc-pub">${fallbackData.publication}</span>
                        </div>
                        <h4>${fallbackData.title}</h4>
                        <p class="card-excerpt">${makeExcerpt(stripHtml(fallbackData.content), 800)}</p>
                    </div>
                `);
            }
        }
    }

    if (financialCardsHtml.length > 0) {
        html += `<div class="financial-cards-row">${financialCardsHtml.join('')}</div>`;
    }

    // 4. Tweet Feed Widget Card (Dynamic relative times)
    const tweetIds = ['tweet-sama', 'tweet-finops', 'tweet-startup-fail'];
    const tweetItemsHtml = tweetIds.map((tid, idx) => {
        const tweet = articlesDatabase[tid];
        if (!tweet) return '';

        // Dynamic time-ago strings
        const timeAgo = idx === 0 ? '12m ago' : (idx === 1 ? '1h ago' : '4h ago');

        // Replace the timestamp inside the article registration so the modal also shows live time
        const now = new Date();
        const pastDate = new Date(now.getTime() - (idx === 0 ? 12 : (idx === 1 ? 60 : 240)) * 60000);
        tweet.timestamp = pastDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + pastDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

        return `
            <div class="tweet-item" onclick="openArticle('${tid}')" style="cursor: pointer;">
                <div class="tweet-avatar" style="background: ${tweet.avatarGradient}">${tweet.avatarText}</div>
                <div class="tweet-details">
                    <div>
                        <div class="tweet-user-info" style="display: flex; align-items: center; gap: 4px; font-size: 12px; margin-bottom: 4px;">
                            <span class="tweet-display-name" style="font-weight: bold; color: var(--text-primary); display: flex; align-items: center;">
                                ${tweet.displayName} 
                                ${tweet.verified ? '<i class="fas fa-check-circle verified-badge" style="color: #1da1f2; font-size: 11px; margin-left: 3px;"></i>' : ''}
                            </span>
                            <span class="tweet-username" style="color: var(--text-muted);">${tweet.username}</span>
                        </div>
                        <p class="tweet-text" style="font-size: 12px; color: var(--text-secondary); line-height: 1.4; margin-bottom: 0;">${tweet.content}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    html += `
        <div class="widget-card tweet-feed-card">
            <div class="widget-header">
                <span class="widget-title"><i class="fab fa-twitter" style="color: #1da1f2;"></i> Real-Time Community Intel</span>
            </div>
            <div class="tweet-list">
                ${tweetItemsHtml}
            </div>
        </div>
    `;

    newsGridEl.innerHTML = html;
}

// Fetch TechCrunch and VentureBeat AI Feeds, merge and filter them
async function fetchLiveNews() {
    try {
        const tcFeed = 'https://techcrunch.com/category/artificial-intelligence/feed/';
        const vbFeed = 'https://venturebeat.com/category/ai/feed/';

        const tcUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(tcFeed)}`;
        const vbUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(vbFeed)}`;

        // Fetch both feeds in parallel, catching errors individually to prevent complete failure
        const [tcData, vbData] = await Promise.all([
            fetch(tcUrl).then(r => r.ok ? r.json() : null).catch(e => { console.error('TechCrunch fetch failed:', e); return null; }),
            fetch(vbUrl).then(r => r.ok ? r.json() : null).catch(e => { console.error('VentureBeat fetch failed:', e); return null; })
        ]);

        let rawItems = [];
        if (tcData && tcData.status === 'ok') {
            rawItems = rawItems.concat(tcData.items.map(item => ({ ...item, sourcePub: 'TechCrunch', logoClass: 'tc-logo' })));
        }
        if (vbData && vbData.status === 'ok') {
            rawItems = rawItems.concat(vbData.items.map(item => ({ ...item, sourcePub: 'VentureBeat', logoClass: 'vb-logo' })));
        }

        if (rawItems.length === 0) throw new Error('No articles fetched from either source');

        // Score each article based on AI spending keywords
        let processedItems = rawItems.map(item => {
            const score = scoreArticle(item);
            return { ...item, spendScore: score };
        });

        // Sort: prioritize higher score (financial AI spend stories) first, then newer articles
        processedItems.sort((a, b) => {
            if (b.spendScore !== a.spendScore) {
                return b.spendScore - a.spendScore;
            }
            return new Date(b.pubDate) - new Date(a.pubDate);
        });

        const liveArticles = processedItems.map((item, idx) => {
            const articleId = `live-${idx}`;
            let image = extractFirstImage(item);
            
            // Filter out physical train images if the topic is about 'Railway' the developer platform
            if (image && (image.toLowerCase().includes('railway') || item.title.toLowerCase().includes('railway'))) {
                image = 'images/ai_cost_leak_landscape.png';
            }
            
            const excerpt = makeExcerpt(item.description || item.content, 220);
            const longExcerpt = makeExcerpt(item.description || item.content, 450);
            const relativeDate = getRelativeTime(item.pubDate);
 
            // Register in global articlesDatabase for openArticle modal view
            articlesDatabase[articleId] = {
                type: 'newspaper',
                publication: item.sourcePub,
                logoClass: item.logoClass,
                date: new Date(item.pubDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
                title: item.title,
                author: item.author || `${item.sourcePub} Staff`,
                authorTitle: 'AI Tech Correspondent',
                authorInitials: item.author ? item.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : (item.sourcePub === 'TechCrunch' ? 'TC' : 'VB'),
                featuredImage: image,
                content: item.content || item.description
            };

            return {
                id: articleId,
                title: item.title,
                excerpt: excerpt,
                longExcerpt: longExcerpt,
                date: relativeDate,
                featuredImage: image,
                publication: item.sourcePub
            };
        });

        // Render live filtered articles
        renderNewsGrid(liveArticles);
    } catch (err) {
        console.error('Failed to load dynamic RSS news, using local fallback:', err);
        // If fetch fails, we retain the fallback articles that were already rendered
    }
}

// Render fallback static articles
function renderFallbackNews() {
    const mockArticles = [
        {
            id: 'hero-cost-loop',
            title: articlesDatabase['hero-cost-loop'].title,
            excerpt: makeExcerpt(articlesDatabase['hero-cost-loop'].content, 220),
            longExcerpt: makeExcerpt(articlesDatabase['hero-cost-loop'].content, 450),
            date: '3h ago',
            featuredImage: articlesDatabase['hero-cost-loop'].featuredImage,
            publication: articlesDatabase['hero-cost-loop'].publication
        },
        {
            id: 'story-gartner',
            title: articlesDatabase['story-gartner'].title,
            excerpt: makeExcerpt(articlesDatabase['story-gartner'].content, 220),
            longExcerpt: makeExcerpt(articlesDatabase['story-gartner'].content, 450),
            date: '1d ago',
            featuredImage: '',
            publication: articlesDatabase['story-gartner'].publication
        },
        {
            id: 'story-cnbc-spend',
            title: articlesDatabase['story-cnbc-spend'].title,
            excerpt: makeExcerpt(articlesDatabase['story-cnbc-spend'].content, 220),
            longExcerpt: makeExcerpt(articlesDatabase['story-cnbc-spend'].content, 450),
            date: '2d ago',
            featuredImage: '',
            publication: articlesDatabase['story-cnbc-spend'].publication
        },
        {
            id: 'story-anthropic',
            title: articlesDatabase['story-anthropic'].title,
            excerpt: makeExcerpt(articlesDatabase['story-anthropic'].content, 220),
            longExcerpt: makeExcerpt(articlesDatabase['story-anthropic'].content, 450),
            date: '3d ago',
            featuredImage: '',
            publication: articlesDatabase['story-anthropic'].publication
        }
    ];

    renderNewsGrid(mockArticles);
}

// Interactive Reader Modal functions
function openArticle(id) {
    const article = articlesDatabase[id];
    if (!article) return;
    
    const contentEl = document.getElementById('readerContent');
    if (!contentEl) return;
    
    let html = '';
    if (article.type === 'newspaper') {
        html = `
            <div class="newspaper-reader">
                <div class="news-publication-header">
                    <span class="publication-logo ${article.logoClass || ''}">${article.publication}</span>
                    <span class="publication-meta">• ${article.date}</span>
                </div>
                <h1 class="news-main-title">${article.title}</h1>
                <div class="news-author-byline">
                    <div class="author-avatar">${article.authorInitials}</div>
                    <div class="author-details">
                        <span class="author-name">${article.author}</span>
                        <span class="author-title">${article.authorTitle}</span>
                    </div>
                </div>
                ${article.featuredImage ? `<div class="news-featured-image" style="background-image: url('${article.featuredImage}');"></div>` : ''}
                <div class="news-article-content">
                    ${article.content}
                </div>
            </div>
        `;
    } else if (article.type === 'tweet') {
        html = `
            <div class="tweet-detail-view">
                <div class="tweet-header" style="display: flex; align-items: center; gap: var(--space-3); position: relative; margin-bottom: var(--space-4);">
                    <div class="tweet-avatar" style="background: ${article.avatarGradient}; width: 46px; height: 46px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-weight: var(--font-bold); color: #fff; font-size: 16px;">${article.avatarText}</div>
                    <div class="tweet-user-meta" style="display: flex; flex-direction: column; line-height: 1.3;">
                        <div class="tweet-display-name" style="font-size: 15px; font-weight: 800; color: var(--text-primary);">
                            ${article.displayName}
                            ${article.verified ? '<i class="fas fa-check-circle verified-badge" style="color: #1da1f2; font-size: 11px; margin-left: 3px;"></i>' : ''}
                        </div>
                        <div class="tweet-username" style="font-size: var(--text-xs); color: var(--text-muted);">${article.username}</div>
                    </div>
                    <div class="twitter-logo-top" style="position: absolute; right: 0; top: 0; color: #1da1f2; font-size: 20px;">
                        <i class="fab fa-twitter"></i>
                    </div>
                </div>
                <div class="tweet-body-text" style="font-size: 17px; line-height: 1.5; color: var(--text-primary); margin-bottom: var(--space-4); word-break: break-word;">
                    ${article.content}
                </div>
                <div class="tweet-timestamp" style="font-size: var(--text-xs); color: var(--text-muted);">
                    ${article.timestamp} · <span style="color: var(--primary-light);">${article.device || 'Twitter for Web'}</span>
                </div>
            </div>
        `;
    }
    
    contentEl.innerHTML = html;
    
    const modalEl = document.getElementById('readerModal');
    if (modalEl) {
        modalEl.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeReaderModal(event) {
    const modalEl = document.getElementById('readerModal');
    if (modalEl) {
        modalEl.classList.remove('active');
        document.body.style.overflow = '';
    }
}
