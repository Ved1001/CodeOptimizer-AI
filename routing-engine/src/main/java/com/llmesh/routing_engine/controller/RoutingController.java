package com.llmesh.routing_engine.controller;

import com.llmesh.routing_engine.dto.AdvisoryResponse;
import com.llmesh.routing_engine.dto.OptimizationRequest;
import com.llmesh.routing_engine.service.BudgetService;
import com.llmesh.routing_engine.service.GroqOrchestrationService;
import com.llmesh.routing_engine.utils.PromptOptimizer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/route")
public class RoutingController {

    private final BudgetService budgetService;
    private final GroqOrchestrationService groqService;

    public RoutingController(BudgetService budgetService, GroqOrchestrationService groqService) {
        this.budgetService = budgetService;
        this.groqService = groqService;
    }

    @PostMapping("/analyze-and-advise")
    public Mono<ResponseEntity<AdvisoryResponse>> analyzeAndAdvise(
            @RequestBody OptimizationRequest request) {

        String validationError = validate(request);
        if (validationError != null) {
            return Mono.just(ResponseEntity.badRequest().body(AdvisoryResponse.error(request.username(), validationError)));
        }

        PromptOptimizer.OptimizationReport report;
        try {
            report = PromptOptimizer.buildReport(request.prompt(), request.provider());
        } catch (Exception ex) {
            return Mono.just(ResponseEntity.internalServerError().body(AdvisoryResponse.error(request.username(), ex.getMessage())));
        }

        final PromptOptimizer.OptimizationReport finalReport = report;

        return budgetService.checkAndCharge(request.username())
                .flatMap(budgetResult -> {

                    if (!budgetResult.authorized()) {
                        return Mono.just(ResponseEntity.status(402).body(AdvisoryResponse.error(request.username(), budgetResult.message())));
                    }

                    return groqService.generateAdvisoryScorecard(finalReport)
                            .map(telemetryReport -> {

                                String aiReducedPrompt = telemetryReport.optimizedPromptText();
                                int aiOptimizedTokensCount = PromptOptimizer.countTokensLocally(aiReducedPrompt);

                                AdvisoryResponse.TokenMetrics tokens = new AdvisoryResponse.TokenMetrics(
                                        finalReport.rawBaselineTokens,
                                        aiOptimizedTokensCount,
                                        (finalReport.rawBaselineTokens - aiOptimizedTokensCount),
                                        ((double) (finalReport.rawBaselineTokens - aiOptimizedTokensCount) / finalReport.rawBaselineTokens) * 100.0
                                );

                                // Fetch costs dynamically based on the exact keys selected by Groq AI
                                double budgetCost = finalReport.allProviderCosts.containsKey(telemetryReport.budgetProvider()) ?
                                        finalReport.allProviderCosts.get(telemetryReport.budgetProvider()).costUsd : 0.0;

                                double balancedCost = finalReport.allProviderCosts.containsKey(telemetryReport.balancedProvider()) ?
                                        finalReport.allProviderCosts.get(telemetryReport.balancedProvider()).costUsd : 0.0;

                                double powerhouseCost = finalReport.allProviderCosts.containsKey(telemetryReport.powerhouseProvider()) ?
                                        finalReport.allProviderCosts.get(telemetryReport.powerhouseProvider()).costUsd : 0.0;

                                // Card 1: Budget Savior
                                AdvisoryResponse.RoutingOption budgetSavior = new AdvisoryResponse.RoutingOption(
                                        "BUDGET_SAVIOR",
                                        telemetryReport.budgetProvider(),
                                        telemetryReport.budgetModel(),
                                        budgetCost,
                                        telemetryReport.budgetJustification()
                                );

                                // Card 2: Smart Balanced
                                AdvisoryResponse.RoutingOption smartBalanced = new AdvisoryResponse.RoutingOption(
                                        "SMART_BALANCED",
                                        telemetryReport.balancedProvider(),
                                        telemetryReport.balancedModel(),
                                        balancedCost,
                                        telemetryReport.balancedJustification()
                                );

                                // Card 3: Task Powerhouse (Completely driven by AI Selection!)
                                AdvisoryResponse.RoutingOption taskPowerhouse = new AdvisoryResponse.RoutingOption(
                                        "TASK_POWERHOUSE",
                                        telemetryReport.powerhouseProvider(),
                                        telemetryReport.powerhouseModel(),
                                        powerhouseCost,
                                        telemetryReport.powerhouseJustification()
                                );

                                java.util.Map<String, AdvisoryResponse.ProviderCostSummary> comparison = new java.util.LinkedHashMap<>();
                                finalReport.allProviderCosts.forEach((k, v) ->
                                        comparison.put(k, new AdvisoryResponse.ProviderCostSummary(v.modelId, v.estimatedTokens, v.costUsd))
                                );

                                AdvisoryResponse.CostMetrics costs = new AdvisoryResponse.CostMetrics(
                                        finalReport.selectedProvider,
                                        finalReport.selectedModel,
                                        finalReport.rawCostUsd,
                                        finalReport.optimizedCostUsd,
                                        finalReport.costSavingsUsd(),
                                        finalReport.cheapestProvider,
                                        comparison
                                );

                                AdvisoryResponse response = AdvisoryResponse.success(
                                        request.username(),
                                        budgetSavior,
                                        smartBalanced,
                                        taskPowerhouse,
                                        tokens,
                                        costs,
                                        request.prompt(),
                                        aiReducedPrompt,
                                        telemetryReport.specializedDomain(),  // ◄── Feed Dynamic Domain directly from Groq AI
                                        telemetryReport.finalArbitrageScore()   // ◄── Feed Dynamic Arbitrage Score directly from Groq AI
                                );

                                return ResponseEntity.ok(response);
                            });
                })
                .onErrorResume(ex -> Mono.just(ResponseEntity.internalServerError().body(AdvisoryResponse.error(request.username(), ex.getMessage()))));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("routing-engine OK");
    }

    private String validate(OptimizationRequest req) {
        if (req.username() == null || req.username().isBlank()) return "Field 'username' is required.";
        if (req.provider() == null || req.provider().isBlank()) return "Field 'provider' is required.";
        if (req.prompt() == null || req.prompt().isBlank()) return "Field 'prompt' is required.";
        if (!PromptOptimizer.getSupportedProviders().contains(req.provider().toUpperCase())) return "Unsupported provider.";
        if (req.prompt().length() > 8000) return "Prompt exceeds maximum length.";
        return null;
    }
}