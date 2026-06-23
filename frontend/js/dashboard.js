/* =============================================
   COSTREDUCER AI — Dashboard Controller
   Premium editorial layout logic
   ============================================= */

// ─── Articles Database ───
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
        featuredImage: 'images/reel_cost_graph.png',
        gradient: 'linear-gradient(135deg, #1a0e0a 0%, #3a2318 50%, #c48f47 100%)',
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
        gradient: 'linear-gradient(135deg, #21130d 0%, #2b1911 50%, #96682b 100%)',
        featuredImage: 'images/reel_datacenter.png',
        content: `<p class="drop-cap">E</p><p>nterprises are overpaying for generative AI deployments by millions of dollars due to highly inefficient prompt construction, according to a new study by Gartner. The report estimates that 73% of all input tokens transmitted to public LLM endpoints represent pure waste — caused by system prompt redundancy, JSON schema verbosity, and excessive whitespace bloat embedded in developer workflows. Gartner's analysis examined over 4.2 billion prompt tokens across 86 enterprise accounts spanning finance, healthcare, and logistics. In every case, significant portions of the transmitted prompt were repetitive boilerplate. The financial impact is significant: enterprises running mid-scale AI operations are spending an average of $2.1M annually on tokens that serve no analytical value. Gartner recommends deploying a prompt optimization middleware layer capable of semantic deduplication, contextual compression, and tiered caching as a first-priority cost lever before scaling AI infrastructure further.</p>`
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
        gradient: 'linear-gradient(135deg, #0f0a07 0%, #2b1911 50%, #d98a3b 100%)',
        featuredImage: 'images/reel_ai_chip.png',
        content: `<p class="drop-cap">A</p><p>mazon Web Services (AWS) revealed a massive 45% year-over-year surge in corporate spending dedicated specifically to high-performance AI compute nodes. The rapid escalation has triggered immediate pressure from Chief Financial Officers (CFOs) to implement guardrails on developer access to frontier model endpoints. AWS CEO Matt Garman disclosed during the company's latest earnings call that its Bedrock managed AI service saw request volume increase by 340% in the last four quarters, with average spend per enterprise account climbing from $18,000 to over $82,000 annually. The company has introduced new spend alerting and budget caps in direct response to growing CFO pressure. AWS is now recommending all enterprise accounts deploy cost-aware routing middleware that applies model downgrading based on task complexity before calls reach the Bedrock gateway.</p>`
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
        gradient: 'linear-gradient(135deg, #1a0e0a 0%, #3a2318 50%, #ae7f41 100%)',
        content: `<p class="drop-cap">A</p><p>nthropic announced a significant update to its developer API, introducing native prompt caching capability. This feature allows Claude developers to store large context documents directly in the model's memory tier, cutting repeated transaction costs by 90% and reducing latency by 80% for subsequent requests. The caching system works by allowing developers to define a cache breakpoint in their prompts. Everything before the breakpoint is stored server-side for up to five minutes and reused across requests. Anthropic pricing for cache reads is set at $0.30 per million tokens, compared to the standard $3.00 rate for input tokens on Claude Sonnet — a full 90% reduction. This has significant implications for enterprise middleware systems and agentic pipelines that repeatedly send the same codebase context across many sequential reasoning calls.</p>`
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
        gradient: 'linear-gradient(135deg, #21130d 0%, #3a2318 50%, #c48f47 100%)',
        content: `<p class="drop-cap">G</p><p>lobal expenditures on AI infrastructure — including specialized server clusters, liquid-cooled datacenters, and high-bandwidth fiber networking — are on track to surpass the $100 billion mark by end of 2026. The aggressive buildout is being driven by venture capital commitments, hyperscaler cloud budgets, and nation-state sovereign AI programs all competing simultaneously for the same constrained supply of NVIDIA H100 and Blackwell GPUs. Microsoft, Google, Meta, and Amazon collectively committed over $220 billion in AI infrastructure capital expenditure for fiscal 2026 alone. Analysts at Morgan Stanley estimate that for every $1 of AI model spend, $4.50 is being invested in the underlying physical infrastructure needed to serve it. Middleware routing solutions that reduce token consumption are increasingly being evaluated as the primary lever for managing this cost spiral.</p>`
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
        gradient: 'linear-gradient(135deg, #0f0a07 0%, #21130d 50%, #76b900 100%)',
        content: `<p class="drop-cap">N</p><p>VIDIA has officially launched its Blackwell computing platform, ushering in a new generation of AI compute capability that promises to deliver real-time inference on trillion-parameter large language models at up to 25x lower cost and energy consumption compared to prior Hopper-generation H100 hardware. The Blackwell B200 GPU features a second-generation Transformer Engine with FP4 precision support, enabling models to run in compressed formats that dramatically reduce memory bandwidth and DRAM footprint. A single GB200 NVL72 rack unit delivers 1.4 exaflops of AI compute, equivalent to the processing power of approximately 4,000 H100 GPUs. For enterprise FinOps teams, the availability of Blackwell changes the cost arbitrage calculation — making it economically viable to route high-volume tasks to private Blackwell clusters rather than public API endpoints.</p>`
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
        gradient: 'linear-gradient(135deg, #1a0e0a 0%, #2b1911 50%, #10a37f 100%)',
        content: `<p class="drop-cap">O</p><p>penAI has introduced GPT-4o mini, its most cost-efficient small model to date, designed to make advanced reasoning accessible to a broader audience of developers and enterprises. The model is priced at 15 cents per million input tokens and 60 cents per million output tokens — representing a 60% reduction compared to GPT-3.5 Turbo. Despite its smaller footprint, GPT-4o mini achieves an 82% score on the MMLU benchmark, outperforming its predecessor on most reasoning tasks. For enterprise middleware routers, GPT-4o mini presents a compelling cost arbitrage option: tasks classified as low-complexity can be automatically downrouted to GPT-4o mini, achieving the same output quality at one-tenth the cost. OpenAI has also enabled fine-tuning support for the model.</p>`
    },
    'tweet-sama': {
        type: 'tweet',
        displayName: 'Andrej Karpathy',
        username: '@karpathy',
        verified: true,
        avatarGradient: 'linear-gradient(135deg, #c48f47, #96682b)',
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
        avatarGradient: 'linear-gradient(135deg, #d98a3b, #ae7f41)',
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
        avatarGradient: 'linear-gradient(135deg, #5a8f76, #48725e)',
        avatarText: 'FC',
        timestamp: '6:30 PM · Jun 12, 2026',
        device: 'Twitter for Web',
        content: 'Intelligence is not token count. The trend of sending millions of context tokens with every message to brute-force a reasoning task is highly inefficient and expensive. High-level planning middleware must replace brute-force context stuffing.'
    }
};


// ─── Page Initialization ───
document.addEventListener('DOMContentLoaded', () => {
    document.title = 'Dashboard - CostReducer AI';
    const isAuth = api.isAuthenticated();
    const user = isAuth ? api.getUser() : null;

    // ── Setup Navbar (no sidebar on dashboard) ──
    // Auth link in navbar
    const authSpan = document.getElementById('navAuthLink');
    if (authSpan) {
        if (isAuth) {
            authSpan.innerHTML = `<a href="#" class="nav-link" id="navLogout">Logout</a>`;
            document.getElementById('navLogout')?.addEventListener('click', (e) => {
                e.preventDefault();
                api.logout();
            });
        } else {
            authSpan.innerHTML = `<a href="login.html" class="nav-link nav-link-cta">Sign In</a>`;
        }
    }

    // Theme toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeToggleIcon');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
    }
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isLight = document.documentElement.classList.toggle('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            if (themeIcon) themeIcon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
        });
    }

    // Navbar background on scroll
    const navbar = document.getElementById('dashNavbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('nav-scrolled', window.scrollY > 60);
        }
    });

    // Control Sign In FAB
    const signInFab = document.getElementById('signInFab');
    if (signInFab) signInFab.style.display = isAuth ? 'none' : 'flex';

    // Render all sections
    renderReelsSection();
    renderEditorialSection();

    // Reveal animations on scroll
    initScrollReveal();
});


// ─── Helpers ───
function stripHtml(html) {
    if (!html) return '';
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent || d.innerText || '';
}

function makeExcerpt(html, maxLength = 160) {
    const text = stripHtml(html).replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function extractFirstImage(item) {
    if (item.thumbnail) return item.thumbnail;
    if (item.enclosure && item.enclosure.link) return item.enclosure.link;
    const match = (item.content || '').match(/<img[^>]+src="([^">]+)"/i);
    return match ? match[1] : '';
}


// ─── Section: Instagram Reel Cards ───
// Uses CSS classes: .reel-card, .reel-source, .reel-category, .reel-title, .reel-desc, .reel-meta
function renderReelsSection() {
    const grid = document.getElementById('reelsGrid');
    if (!grid) return;

    const reelArticles = [
        { id: 'hero-cost-loop', badge: 'BREAKING' },
        { id: 'story-gartner', badge: 'RESEARCH' },
        { id: 'story-cnbc-spend', badge: 'MARKETS' }
    ];

    grid.innerHTML = reelArticles.map(({ id, badge }) => {
        const a = articlesDatabase[id];
        if (!a) return '';
        const bgStyle = a.featuredImage
            ? `background-image: url('${a.featuredImage}'); background-size: cover; background-position: center;`
            : `background: ${a.gradient};`;
        const excerpt = makeExcerpt(a.content, 100);
        return `
            <div class="reel-card" onclick="openArticle('${id}')" style="${bgStyle} cursor: pointer;">
                <div class="reel-source">${a.publication} · ${a.date}</div>
                <div class="reel-content">
                    <div class="reel-category">${badge}</div>
                    <h3 class="reel-title">${a.title}</h3>
                    <p class="reel-desc">${excerpt}</p>
                    <div class="reel-meta">Read Full Story →</div>
                </div>
            </div>
        `;
    }).join('');
}


// ─── Section: Numbered Editorial Cards ───
// Uses CSS classes: .editorial-card, .editorial-number, .editorial-category, .editorial-title, .editorial-desc, .editorial-link
function renderEditorialSection() {
    const grid = document.getElementById('editorialGrid');
    if (!grid) return;

    const editorials = [
        { id: 'story-infrastructure', badge: 'AI Bubble & Spend', num: '01' },
        { id: 'story-blackwell', badge: 'Hardware Shift', num: '02' },
        { id: 'story-gpt4omini', badge: 'LLM Cost Arbitrage', num: '03' }
    ];

    grid.innerHTML = editorials.map(({ id, badge, num }) => {
        const a = articlesDatabase[id];
        if (!a) return '';
        const excerpt = makeExcerpt(a.content, 140);
        return `
            <div class="editorial-card" onclick="openArticle('${id}')" style="cursor: pointer;">
                <div class="editorial-number">${num}</div>
                <div class="editorial-category">${badge.toUpperCase()}</div>
                <h4 class="editorial-title">${a.title}</h4>
                <p class="editorial-desc">${excerpt}</p>
                <div class="editorial-link">Read Insight</div>
            </div>
        `;
    }).join('');
}


// ─── Section: Community / Tweets ───
// Uses CSS classes: .tweet-item, .tweet-avatar, .tweet-details, .tweet-user-info, .tweet-display-name, .tweet-username, .tweet-text
function renderCommunitySection() {
    const grid = document.getElementById('communityGrid');
    if (!grid) return;

    const tweetIds = ['tweet-sama', 'tweet-finops', 'tweet-startup-fail'];
    const timeAgos = ['12m ago', '1h ago', '4h ago'];

    grid.innerHTML = tweetIds.map((tid, idx) => {
        const t = articlesDatabase[tid];
        if (!t) return '';

        // Update timestamp dynamically
        const now = new Date();
        const pastDate = new Date(now.getTime() - [12, 60, 240][idx] * 60000);
        t.timestamp = pastDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' +
                      pastDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

        return `
            <div class="tweet-item" onclick="openArticle('${tid}')" style="cursor: pointer;">
                <div class="tweet-avatar" style="background: ${t.avatarGradient}">${t.avatarText}</div>
                <div class="tweet-details">
                    <div class="tweet-user-info">
                        <span class="tweet-display-name">
                            ${t.displayName}
                            ${t.verified ? '<i class="fas fa-check-circle" style="color: #1da1f2; font-size: 11px; margin-left: 3px;"></i>' : ''}
                        </span>
                        <span class="tweet-username">${t.username}</span>
                    </div>
                    <p class="tweet-text">${t.content}</p>
                    <div style="font-size: 10px; color: var(--text-muted); font-family: var(--font-mono);">${timeAgos[idx]}</div>
                </div>
            </div>
        `;
    }).join('');
}


// ─── Live News Fetch ───
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
        if (matches) score += matches.length;
    });
    return score;
}

async function fetchLiveNews() {
    try {
        const tcFeed = 'https://techcrunch.com/category/artificial-intelligence/feed/';
        const vbFeed = 'https://venturebeat.com/category/ai/feed/';
        const tcUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(tcFeed)}`;
        const vbUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(vbFeed)}`;

        const [tcData, vbData] = await Promise.all([
            fetch(tcUrl).then(r => r.ok ? r.json() : null).catch(() => null),
            fetch(vbUrl).then(r => r.ok ? r.json() : null).catch(() => null)
        ]);

        let rawItems = [];
        if (tcData && tcData.status === 'ok') {
            rawItems = rawItems.concat(tcData.items.map(item => ({ ...item, sourcePub: 'TechCrunch', logoClass: 'tc-logo' })));
        }
        if (vbData && vbData.status === 'ok') {
            rawItems = rawItems.concat(vbData.items.map(item => ({ ...item, sourcePub: 'VentureBeat', logoClass: 'vb-logo' })));
        }

        if (rawItems.length === 0) return;

        let processedItems = rawItems.map(item => ({ ...item, spendScore: scoreArticle(item) }));
        processedItems.sort((a, b) => b.spendScore !== a.spendScore ? b.spendScore - a.spendScore : new Date(b.pubDate) - new Date(a.pubDate));

        const topArticles = processedItems.slice(0, 6);
        const gradients = [
            'linear-gradient(135deg, #1a0e0a 0%, #3a2318 50%, #c48f47 100%)',
            'linear-gradient(135deg, #21130d 0%, #2b1911 50%, #96682b 100%)',
            'linear-gradient(135deg, #0f0a07 0%, #2b1911 50%, #d98a3b 100%)',
            'linear-gradient(135deg, #1a0e0a 0%, #3a2318 50%, #ae7f41 100%)',
            'linear-gradient(135deg, #21130d 0%, #3a2318 50%, #5a8f76 100%)',
            'linear-gradient(135deg, #0f0a07 0%, #21130d 50%, #c94b4b 100%)'
        ];

        topArticles.forEach((item, idx) => {
            const articleId = `live-${idx}`;
            let image = extractFirstImage(item);
            if (image && image.toLowerCase().includes('railway')) image = '';

            articlesDatabase[articleId] = {
                type: 'newspaper',
                publication: item.sourcePub,
                logoClass: item.logoClass,
                date: new Date(item.pubDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
                title: item.title,
                author: item.author || `${item.sourcePub} Staff`,
                authorTitle: 'AI Tech Correspondent',
                authorInitials: item.author ? item.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AI',
                featuredImage: image,
                gradient: gradients[idx % gradients.length],
                content: item.content || item.description
            };
        });

        // Update reels with live data
        if (topArticles.length >= 3) {
            const grid = document.getElementById('reelsGrid');
            if (grid) {
                const reelBadges = ['TRENDING', 'BREAKING', 'ANALYSIS'];
                grid.innerHTML = topArticles.slice(0, 3).map((item, idx) => {
                    const aid = `live-${idx}`;
                    const a = articlesDatabase[aid];
                    const bgStyle = a.featuredImage
                        ? `background-image: url('${a.featuredImage}'); background-size: cover; background-position: center;`
                        : `background: ${a.gradient};`;
                    const excerpt = makeExcerpt(a.content, 100);
                    return `
                        <div class="reel-card" onclick="openArticle('${aid}')" style="${bgStyle} cursor: pointer;">
                            <div class="reel-source">${a.publication} · ${a.date}</div>
                            <div class="reel-content">
                                <div class="reel-category">${reelBadges[idx]}</div>
                                <h3 class="reel-title">${a.title}</h3>
                                <p class="reel-desc">${excerpt}</p>
                                <div class="reel-meta">Read Full Story →</div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Update editorial with live data
        if (topArticles.length >= 6) {
            const grid = document.getElementById('editorialGrid');
            if (grid) {
                const editBadges = ['AI SPEND', 'INFRASTRUCTURE', 'MARKETS'];
                grid.innerHTML = topArticles.slice(3, 6).map((item, idx) => {
                    const aid = `live-${idx + 3}`;
                    const a = articlesDatabase[aid];
                    const excerpt = makeExcerpt(a.content, 140);
                    const num = String(idx + 1).padStart(2, '0');
                    return `
                        <div class="editorial-card" onclick="openArticle('${aid}')" style="cursor: pointer;">
                            <div class="editorial-number">${num}</div>
                            <div class="editorial-category">${editBadges[idx]}</div>
                            <h4 class="editorial-title">${a.title}</h4>
                            <p class="editorial-desc">${excerpt}</p>
                            <div class="editorial-link">Read Insight</div>
                        </div>
                    `;
                }).join('');
            }
        }
    } catch (err) {
        console.error('Live news fetch failed, using fallback articles:', err);
    }
}


// ─── Scroll Reveal Animation ───
function initScrollReveal() {
    const sections = document.querySelectorAll('.dash-section:not(.dash-hero)');

    // Use requestAnimationFrame to add the hidden class AFTER first paint,
    // preventing the flash/rectangle popup on initial load
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            sections.forEach(section => {
                // Only hide sections that are NOT already in the viewport
                const rect = section.getBoundingClientRect();
                if (rect.top > window.innerHeight) {
                    section.classList.add('reveal-ready');
                }
            });
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.classList.remove('reveal-ready');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    sections.forEach(section => observer.observe(section));
}


// ─── Article Reader Modal ───
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
                    <div style="position: absolute; right: 0; top: 0; color: #1da1f2; font-size: 20px;">
                        <i class="fab fa-twitter"></i>
                    </div>
                </div>
                <div style="font-size: 17px; line-height: 1.5; color: var(--text-primary); margin-bottom: var(--space-4); word-break: break-word;">
                    ${article.content}
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-muted);">
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
