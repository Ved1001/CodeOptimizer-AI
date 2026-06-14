package com.llmesh.routing_engine.utils;

import com.knuddels.jtokkit.Encodings;
import com.knuddels.jtokkit.api.Encoding;
import com.knuddels.jtokkit.api.EncodingRegistry;
import com.knuddels.jtokkit.api.EncodingType;

import java.util.*;
import java.util.stream.Collectors;

public final class PromptOptimizer {

    private static final EncodingRegistry REGISTRY = Encodings.newDefaultEncodingRegistry();
    private static final Encoding BASE_ENCODER = REGISTRY.getEncoding(EncodingType.CL100K_BASE);

    private static final Set<String> FILLER_WORDS = new HashSet<>(Arrays.asList(
            "please", "kindly", "could", "would", "hey", "there", "hi", "hello",
            "basically", "actually", "literally", "just", "simply", "really",
            "i", "want", "to", "a", "the", "an", "am", "me",
            "of", "for", "in", "on", "at", "with", "you"
    ));

    private static final Map<String, ProviderMetadata> PROVIDER_REGISTRY;

    static {
        Map<String, ProviderMetadata> map = new LinkedHashMap<>();
        map.put("CHATGPT",   new ProviderMetadata("gpt-4o-mini",           0.150,       0.600,       1.00));
        map.put("CHATGPT4",  new ProviderMetadata("gpt-4o",                5.000,      15.000,       1.00));
        map.put("GROK",      new ProviderMetadata("grok-3-mini",           0.300,       0.500,       1.00));
        map.put("DEEPSEEK",  new ProviderMetadata("deepseek-chat",         0.140,       0.280,       1.05));
        map.put("CLAUDE",    new ProviderMetadata("claude-3-5-haiku-latest",0.800,      4.000,       1.18));
        map.put("CLAUDE_S",  new ProviderMetadata("claude-sonnet-4-5",     3.000,      15.000,       1.18));
        map.put("GEMINI",    new ProviderMetadata("gemini-1.5-flash",      0.075,       0.300,       0.92));
        map.put("GEMINI_P",  new ProviderMetadata("gemini-1.5-pro",        3.500,      10.500,       0.92));
        map.put("MISTRAL",   new ProviderMetadata("mistral-small-latest",  0.100,       0.300,       1.02));
        map.put("COHERE",    new ProviderMetadata("command-r",             0.150,       0.600,       1.08));
        map.put("LLAMA",     new ProviderMetadata("llama-3-70b-instruct",  0.200,       0.400,       1.00));
        map.put("CLAUDE_O",   new ProviderMetadata("claude-3-opus-20240229",     15.000,     75.000,       1.18));
        map.put("GEMINI_ADV",  new ProviderMetadata("gemini-advanced",            7.000,      21.000,       0.92));
        PROVIDER_REGISTRY = Collections.unmodifiableMap(map);
    }

    private PromptOptimizer() {}

    public static String optimizePromptString(String prompt) {
        if (prompt == null || prompt.isBlank()) return "";

        return Arrays.stream(prompt.trim().split("\\s+"))
                .filter(word -> !FILLER_WORDS.contains(word.toLowerCase().replaceAll("[^a-z]", "")))
                .collect(Collectors.joining(" "));
    }

    public static int countBaselineTokens(String text) {
        if (text == null || text.isBlank()) return 0;
        return BASE_ENCODER.countTokens(text);
    }

    public static int countTokensLocally(String text) {
        if (text == null || text.isBlank()) return 0;
        return BASE_ENCODER.countTokens(text);
    }

    public static int calculateProviderTokens(String text, String providerKey) {
        if (text == null || text.isBlank()) return 0;

        int baseline = countBaselineTokens(text);
        ProviderMetadata meta = getProviderMetadata(providerKey);

        return (int) Math.ceil(baseline * meta.tokenMultiplier);
    }

    public static double calculateInputCostUsd(String text, String providerKey) {
        int tokens = calculateProviderTokens(text, providerKey);
        ProviderMetadata meta = getProviderMetadata(providerKey);
        return (tokens / 1_000_000.0) * meta.inputCostPerMillionTokens;
    }

    public static OptimizationReport buildReport(String rawPrompt, String providerKey) {
        String optimizedPrompt = optimizePromptString(rawPrompt);

        int rawBaselineTokens      = countBaselineTokens(rawPrompt);
        int optimizedBaselineTokens = countBaselineTokens(optimizedPrompt);

        String normalizedKey = providerKey.toUpperCase();
        int rawProviderTokens       = calculateProviderTokens(rawPrompt, normalizedKey);
        int optimizedProviderTokens = calculateProviderTokens(optimizedPrompt, normalizedKey);

        double rawCostUsd       = calculateInputCostUsd(rawPrompt, normalizedKey);
        double optimizedCostUsd = calculateInputCostUsd(optimizedPrompt, normalizedKey);

        Map<String, ProviderCostEntry> allProviderCosts = buildCostComparison(rawPrompt);

        String cheapestProvider = allProviderCosts.entrySet().stream()
                .min(Map.Entry.comparingByValue(Comparator.comparingDouble(e -> e.costUsd)))
                .map(Map.Entry::getKey)
                .orElse("GEMINI");

        ProviderMetadata selectedMeta = getProviderMetadata(normalizedKey);

        return new OptimizationReport(
                rawPrompt,
                optimizedPrompt,
                normalizedKey,
                selectedMeta.defaultModel,
                rawBaselineTokens,
                optimizedBaselineTokens,
                rawProviderTokens,
                optimizedProviderTokens,
                rawCostUsd,
                optimizedCostUsd,
                cheapestProvider,
                allProviderCosts
        );
    }

    public static Map<String, ProviderCostEntry> buildCostComparison(String text) {
        return PROVIDER_REGISTRY.entrySet().stream()
                .map(entry -> {
                    String key = entry.getKey();
                    ProviderMetadata meta = entry.getValue();
                    int tokens = (int) Math.ceil(countBaselineTokens(text) * meta.tokenMultiplier);
                    double cost = (tokens / 1_000_000.0) * meta.inputCostPerMillionTokens;
                    return Map.entry(key, new ProviderCostEntry(meta.defaultModel, tokens, cost));
                })
                .sorted(Map.Entry.comparingByValue(Comparator.comparingDouble(e -> e.costUsd)))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (a, b) -> a,
                        LinkedHashMap::new
                ));
    }

    public static ProviderMetadata getProviderMetadata(String providerKey) {
        return PROVIDER_REGISTRY.getOrDefault(
                providerKey.toUpperCase(),
                new ProviderMetadata("gpt-4o-mini", 0.150, 0.600, 1.00)
        );
    }

    public static Set<String> getSupportedProviders() {
        return PROVIDER_REGISTRY.keySet();
    }

    public static final class ProviderMetadata {
        public final String defaultModel;
        public final double inputCostPerMillionTokens;
        public final double outputCostPerMillionTokens;
        public final double tokenMultiplier;

        public ProviderMetadata(String defaultModel,
                                double inputCostPerMillionTokens,
                                double outputCostPerMillionTokens,
                                double tokenMultiplier) {
            this.defaultModel = defaultModel;
            this.inputCostPerMillionTokens = inputCostPerMillionTokens;
            this.outputCostPerMillionTokens = outputCostPerMillionTokens;
            this.tokenMultiplier = tokenMultiplier;
        }
    }

    public static final class ProviderCostEntry {
        public final String modelId;
        public final int estimatedTokens;
        public final double costUsd;

        public ProviderCostEntry(String modelId, int estimatedTokens, double costUsd) {
            this.modelId = modelId;
            this.estimatedTokens = estimatedTokens;
            this.costUsd = costUsd;
        }
    }

    public static final class OptimizationReport {
        public final String rawPrompt;
        public final String optimizedPrompt;
        public final String selectedProvider;
        public final String selectedModel;
        public final int rawBaselineTokens;
        public final int optimizedBaselineTokens;
        public final int rawProviderTokens;
        public final int optimizedProviderTokens;
        public final double rawCostUsd;
        public final double optimizedCostUsd;
        public final String cheapestProvider;
        public final Map<String, ProviderCostEntry> allProviderCosts;

        public OptimizationReport(String rawPrompt,
                                  String optimizedPrompt,
                                  String selectedProvider,
                                  String selectedModel,
                                  int rawBaselineTokens,
                                  int optimizedBaselineTokens,
                                  int rawProviderTokens,
                                  int optimizedProviderTokens,
                                  double rawCostUsd,
                                  double optimizedCostUsd,
                                  String cheapestProvider,
                                  Map<String, ProviderCostEntry> allProviderCosts) {
            this.rawPrompt = rawPrompt;
            this.optimizedPrompt = optimizedPrompt;
            this.selectedProvider = selectedProvider;
            this.selectedModel = selectedModel;
            this.rawBaselineTokens = rawBaselineTokens;
            this.optimizedBaselineTokens = optimizedBaselineTokens;
            this.rawProviderTokens = rawProviderTokens;
            this.optimizedProviderTokens = optimizedProviderTokens;
            this.rawCostUsd = rawCostUsd;
            this.optimizedCostUsd = optimizedCostUsd;
            this.cheapestProvider = cheapestProvider;
            this.allProviderCosts = allProviderCosts;
        }

        public int tokenSavings() {
            return rawProviderTokens - optimizedProviderTokens;
        }

        public double costSavingsUsd() {
            return rawCostUsd - optimizedCostUsd;
        }

        public double optimizationPercent() {
            if (rawProviderTokens == 0) return 0;
            return (tokenSavings() / (double) rawProviderTokens) * 100.0;
        }
    }
}