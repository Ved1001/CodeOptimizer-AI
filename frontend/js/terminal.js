// CostReducer AI Code Terminal Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const isAuth = api.isAuthenticated();
    const user = isAuth ? api.getUser() : null;
    
    // Render common page elements
    components.renderSidebar('terminal');
    components.renderHeader('CostReducer AI Code Terminal');
    
    // Set subtitle text
    const subtitleEl = document.getElementById('headerSubtitle');
    if (subtitleEl) {
        subtitleEl.innerText = "Interception portal for token compression and multi-model cost arbitrage routing.";
    }

    const promptTextarea = document.getElementById('promptTextarea');
    const optimizeForm = document.getElementById('optimizeForm');
    const optimizeBtn = document.getElementById('optimizeBtn');
    const providerSelect = document.getElementById('providerSelect');
    const skeletonLoader = document.getElementById('skeletonLoader');
    const outputTelemetry = document.getElementById('outputTelemetry');

    // Pre-fill terminal starting blank
    if (promptTextarea) {
        promptTextarea.value = "";
    }

    if (!isAuth) {
        // Guest user: lock only the submit button with a lock icon
        if (optimizeBtn) {
            optimizeBtn.innerHTML = '<i class="fas fa-lock" style="margin-right: var(--space-2);"></i> Sign In to Run Optimization';
            optimizeBtn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            optimizeBtn.style.color = '#fff';
            optimizeBtn.style.border = 'none';
        }

        const handleRedirect = (event) => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (optimizeBtn) {
                optimizeBtn.disabled = true;
                optimizeBtn.innerHTML = '<i class="fas fa-lock" style="margin-right: var(--space-2);"></i> Locked — Redirecting to Login...';
            }
            components.showToast('Please login to run terminal analysis', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1200);
        };

        if (optimizeForm) {
            optimizeForm.addEventListener('submit', handleRedirect);
        }
        if (optimizeBtn) {
            optimizeBtn.addEventListener('click', handleRedirect);
        }
        
        // Reveal the page content
        components.hideSkeleton();
        return;
    }

    // ── Authenticated User Flow ──
    if (optimizeForm) {
        optimizeForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const promptVal = promptTextarea.value.trim();
            const providerVal = providerSelect.value;

            if (!promptVal) {
                components.showToast('Please enter a query prompt before optimizing.', 'warning');
                return;
            }

            // Show loading indicators
            components.showLoading(optimizeBtn);
            if (outputTelemetry) outputTelemetry.classList.remove('visible');
            if (skeletonLoader) skeletonLoader.style.display = 'flex';

            try {
                // CostReducer AI Routing Engine is on port 8081
                // Endpoint: POST /api/v1/route/analyze-and-advise
                const requestPayload = {
                    username: user.email || 'ved',
                    provider: providerVal,
                    prompt: promptVal
                };

                const data = await api.post(CONFIG.ROUTE_API, '/api/v1/route/analyze-and-advise', requestPayload);
                
                // Hide skeleton
                if (skeletonLoader) skeletonLoader.style.display = 'none';

                if (data.status === 'SUCCESS') {
                    // Populate prompt diff
                    document.getElementById('rawPromptText').innerText = data.rawOriginalPrompt || promptVal;
                    document.getElementById('optimizedPromptText').innerText = data.optimizedPrompt || '';
                    
                    const savedPct = data.tokenMetrics.optimizationPercent.toFixed(1);
                    document.getElementById('rawTokensCount').innerText = `${data.tokenMetrics.rawBaselineTokens} tokens`;
                    document.getElementById('optimizedTokensCount').innerText = `${data.tokenMetrics.optimizedBaselineTokens} tokens (-${savedPct}%)`;

                    // Populate Cards
                    populateStrategyCard('budgetSaviorCard', 'budgetModel', 'budgetProvider', 'budgetCost', 'budgetJustification', data.budgetSaviorCard);
                    populateStrategyCard('smartBalancedCard', 'balancedModel', 'balancedProvider', 'balancedCost', 'balancedJustification', data.smartBalancedCard);
                    populateStrategyCard('taskPowerhouseCard', 'powerhouseModel', 'powerhouseProvider', 'powerhouseCost', 'powerhouseJustification', data.taskPowerhouseCard);

                    // Populate Financial Summary
                    document.getElementById('summarySelectedProvider').innerText = `${data.costMetrics.selectedProvider} (${data.costMetrics.selectedModel})`;
                    document.getElementById('summaryRawCost').innerText = `$${formatUsdCost(data.costMetrics.rawCostUsd)}`;
                    document.getElementById('summaryOptimizedCost').innerText = `$${formatUsdCost(data.costMetrics.optimizedCostUsd)}`;
                    
                    const savingsBadge = document.getElementById('summarySavingsPercent');
                    savingsBadge.innerText = `${savedPct}% Save`;
                    
                    // Domain Badge
                    const domainBadge = document.getElementById('dynamicDomainBadge');
                    domainBadge.innerText = data.specializedDomain || 'General Systems Task';
                    domainBadge.title = data.specializedDomain || '';

                    // Animate Radial Gauge Score
                    animateSpeedometer(data.finalArbitrageScore || 50);

                    // Render Cost Comparison Grid for All Models
                    renderModelCostComparison(data);

                    // Make output visible
                    if (outputTelemetry) outputTelemetry.classList.add('visible');
                    components.showToast('CostReducer AI Token Compression & Strategy Match Complete!', 'success');
                } else {
                    components.showToast(data.message || 'Optimization failed.', 'error');
                }

            } catch (error) {
                console.error(error);
                components.showToast(error.message || 'Error communicating with routing engine API.', 'error');
                if (skeletonLoader) skeletonLoader.style.display = 'none';
            } finally {
                components.hideLoading(optimizeBtn, '<i class="fas fa-bolt" style="margin-right: var(--space-2);"></i> Run CostReducer AI Optimization');
            }
        });
    }
    
    // Hide loading skeleton and reveal terminal content
    components.hideSkeleton();
});

// Helper to format scientific decimal costs into elegant readable text
function formatUsdCost(val) {
    if (val === undefined || val === null) return '0.00';
    // If cost is tiny, format to high precision
    if (val < 0.001) {
        return Number(val).toFixed(8);
    }
    return Number(val).toFixed(4);
}

// Helper to fill strategy recommendations
function populateStrategyCard(cardId, modelId, providerId, costId, justificationId, cardData) {
    const cardEl = document.getElementById(cardId);
    const modelEl = document.getElementById(modelId);
    const providerEl = document.getElementById(providerId);
    const costEl = document.getElementById(costId);
    const justificationEl = document.getElementById(justificationId);

    if (cardEl && cardData) {
        modelEl.innerText = cardData.recommendedModel || '-';
        providerEl.innerText = `Provider: ${cardData.recommendedProvider || '-'}`;
        costEl.innerText = `$${formatUsdCost(cardData.estimatedRunCostUsd)}`;
        justificationEl.innerText = cardData.justificationText || '';
    }
}

// Speedometer Radial Gauge Animation
function animateSpeedometer(targetScore) {
    const gaugeText = document.getElementById('gaugeScoreText');
    const progressArc = document.getElementById('gaugeProgressArc');
    
    if (!gaugeText || !progressArc) return;

    const maxDash = 251.2;
    let currentScore = 0;
    
    const interval = setInterval(() => {
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(interval);
        }
        
        // Update text
        gaugeText.textContent = Math.round(currentScore);
        
        // Update arc dashoffset
        const offset = maxDash - (currentScore / 100) * maxDash;
        progressArc.style.strokeDashoffset = offset;
        
        if (currentScore === targetScore) return;
        currentScore += Math.max(1, targetScore / 25); // increment step
    }, 20);
}

// Premium Mapping for Model Names
const modelDisplayNames = {
    'gpt-4o-mini': 'OpenAI GPT-4o Mini',
    'gpt-4o': 'OpenAI GPT-4o (Reasoning)',
    'grok-3-mini': 'xAI Grok 3 Mini',
    'deepseek-chat': 'DeepSeek Chat V3',
    'claude-3-5-haiku-latest': 'Anthropic Claude 3.5 Haiku',
    'claude-sonnet-4-5': 'Anthropic Claude 4.5 Sonnet',
    'gemini-1.5-flash': 'Google Gemini 1.5 Flash',
    'gemini-1.5-pro': 'Google Gemini 1.5 Pro',
    'mistral-small-latest': 'Mistral Small Latest',
    'command-r': 'Cohere Command R',
    'llama-3-70b-instruct': 'Meta Llama 3 70B',
    'claude-3-opus-20240229': 'Anthropic Claude 3 Opus',
    'gemini-advanced': 'Google Gemini Advanced'
};

// Render Cost Comparison Grid for All Models
function renderModelCostComparison(data) {
    const barsContainer = document.getElementById('modelCostComparisonBars');
    if (!barsContainer || !data.costMetrics || !data.costMetrics.allProviderComparison) return;

    barsContainer.innerHTML = '';
    
    const comparisonEntries = Object.entries(data.costMetrics.allProviderComparison);
    
    // Find maximum cost to scale widths proportionately
    let maxCost = 0;
    comparisonEntries.forEach(([key, val]) => {
        if (val.costUsd > maxCost) {
            maxCost = val.costUsd;
        }
    });
    if (maxCost === 0) maxCost = 0.0001;

    const savingsRatio = data.tokenMetrics.optimizedBaselineTokens / data.tokenMetrics.rawBaselineTokens;

    comparisonEntries.forEach(([key, val]) => {
        const rawCost = val.costUsd;
        const optCost = rawCost * savingsRatio;
        
        const displayName = modelDisplayNames[val.modelId] || `${key} (${val.modelId})`;
        
        // Calculate percentages for width styles
        const rawPct = Math.max(3, (rawCost / maxCost) * 100);
        const optPct = Math.max(3, (optCost / maxCost) * 100);
        
        const pctSaved = Math.max(0, ((rawCost - optCost) / rawCost * 100)).toFixed(0);
        
        const rowEl = document.createElement('div');
        rowEl.style.display = 'grid';
        rowEl.style.gridTemplateColumns = '190px 1fr';
        rowEl.style.gap = 'var(--space-3)';
        rowEl.style.alignItems = 'center';
        rowEl.style.borderBottom = '1px dashed var(--border-light)';
        rowEl.style.paddingBottom = 'var(--space-2)';
        rowEl.style.marginBottom = 'var(--space-2)';
        
        rowEl.innerHTML = `
            <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${displayName}">
                ${displayName}
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px; width: 100%;">
                <!-- Original cost bar -->
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="flex: 1; height: 8px; background: var(--bg-tertiary); border-radius: var(--radius-full); overflow: hidden;">
                        <div style="width: ${rawPct}%; height: 100%; background: linear-gradient(90deg, #ef4444, #b91c1c); border-radius: var(--radius-full);"></div>
                    </div>
                    <span style="font-family: var(--font-mono); font-size: 11.5px; color: var(--danger-light); width: 85px; text-align: right; flex-shrink: 0;">
                        $${formatUsdCost(rawCost)}
                    </span>
                </div>
                <!-- Optimized cost bar -->
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="flex: 1; height: 8px; background: var(--bg-tertiary); border-radius: var(--radius-full); overflow: hidden;">
                        <div style="width: ${optPct}%; height: 100%; background: linear-gradient(90deg, #10b981, #047857); border-radius: var(--radius-full);"></div>
                    </div>
                    <span style="font-family: var(--font-mono); font-size: 11.5px; color: var(--success-light); width: 85px; text-align: right; flex-shrink: 0; font-weight: bold;">
                        $${formatUsdCost(optCost)}
                    </span>
                </div>
            </div>
        `;
        
        barsContainer.appendChild(rowEl);
    });
}

