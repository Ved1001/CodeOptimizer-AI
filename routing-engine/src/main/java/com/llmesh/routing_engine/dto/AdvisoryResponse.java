package com.llmesh.routing_engine.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AdvisoryResponse(
        String status,
        String username,
        long responseTimestampEpoch,
        RoutingOption budgetSaviorCard,
        RoutingOption smartBalancedCard,
        RoutingOption taskPowerhouseCard,
        TokenMetrics tokenMetrics,
        CostMetrics costMetrics,
        String rawOriginalPrompt,
        String optimizedPrompt,
        String specializedDomain,
        int finalArbitrageScore,
        String errorMessage
) {
    public record RoutingOption(
            String strategyType,
            String recommendedProvider,
            String recommendedModel,
            double estimatedRunCostUsd,
            String justificationText
    ) {}

    /**
     * Upgraded successful response factory method synchronized with Groq AI telemetry nodes
     */
    public static AdvisoryResponse success(
            String username, RoutingOption budget, RoutingOption balanced, RoutingOption powerhouse,
            TokenMetrics tokens, CostMetrics costs, String rawPrompt, String optimizedPrompt,
            String specializedDomain, int finalArbitrageScore) { // ◄── MODIFICATION 2: Accepted parameters

        return new AdvisoryResponse(
                "SUCCESS",
                username,
                System.currentTimeMillis(),
                budget,
                balanced,
                powerhouse,
                tokens,
                costs,
                rawPrompt,
                optimizedPrompt,
                specializedDomain,    // ◄── MODIFICATION 2: Injected field
                finalArbitrageScore,  // ◄── MODIFICATION 2: Injected field
                null
        );
    }

    public static AdvisoryResponse error(String username, String message) {
        return new AdvisoryResponse("ERROR", username, System.currentTimeMillis(),
                null, null, null, null, null, null, null, null, 0, message);
    }

    public record TokenMetrics(
            int rawBaselineTokens,
            int optimizedBaselineTokens,
            int tokensSaved,
            double optimizationPercent
    ) {}

    public record CostMetrics(
            String selectedProvider,
            String selectedModel,
            double rawCostUsd,
            double optimizedCostUsd,
            double costSavingsUsd,
            String cheapestAlternativeProvider,
            Map<String, ProviderCostSummary> allProviderComparison
    ) {}

    public record ProviderCostSummary(
            String modelId,
            int estimatedTokens,
            double costUsd
    ) {}
}