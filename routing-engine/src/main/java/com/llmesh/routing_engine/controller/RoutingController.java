package com.llmesh.routing_engine.controller;

import com.llmesh.routing_engine.dto.AdvisoryResponse;
import com.llmesh.routing_engine.dto.OptimizationRequest;
import com.llmesh.routing_engine.service.BudgetService;
import com.llmesh.routing_engine.service.GroqOrchestrationService;
import com.llmesh.routing_engine.utils.PromptOptimizer;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.concurrent.ConcurrentHashMap;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/route")
public class RoutingController {

    private final BudgetService budgetService;
    private final GroqOrchestrationService groqService;
    private final ConcurrentHashMap<String, Integer> guestIpCreditsMap = new ConcurrentHashMap<>();

    public RoutingController(BudgetService budgetService, GroqOrchestrationService groqService) {
        this.budgetService = budgetService;
        this.groqService = groqService;
    }

    private String getClientIp(ServerHttpRequest request) {
        String xForwardedFor = request.getHeaders().getFirst("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        if (request.getRemoteAddress() != null && request.getRemoteAddress().getAddress() != null) {
            return request.getRemoteAddress().getAddress().getHostAddress();
        }
        return "unknown";
    }

    private int getRemainingGuestCredits(String ip) {
        return guestIpCreditsMap.computeIfAbsent(ip, k -> 3);
    }

    private int useGuestCredit(String ip) {
        return guestIpCreditsMap.compute(ip, (k, current) -> {
            if (current == null) {
                return 2;
            }
            return Math.max(0, current - 1);
        });
    }

    @GetMapping("/guest-credits")
    public Mono<ResponseEntity<java.util.Map<String, Object>>> getGuestCredits(
            ServerHttpRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);
        int credits = getRemainingGuestCredits(clientIp);
        return Mono.just(ResponseEntity.ok(java.util.Map.of(
                "credits", credits
        )));
    }

    @PostMapping("/analyze-and-advise")
    public Mono<ResponseEntity<AdvisoryResponse>> analyzeAndAdvise(
            @RequestBody OptimizationRequest request,
            ServerHttpRequest httpRequest) {

        String clientIp = getClientIp(httpRequest);
        boolean isAuth = httpRequest.getHeaders().containsKey("Authorization");

        if (!isAuth) {
            int currentCredits = getRemainingGuestCredits(clientIp);
            if (currentCredits <= 0) {
                return Mono.just(ResponseEntity.ok(
                        AdvisoryResponse.errorWithGuestCredits(
                                request.username(),
                                "You have used all guest credits. Please sign in.",
                                0
                        )
                ));
            }
        }

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

                                AdvisoryResponse response;
                                if (!isAuth) {
                                    int newCredits = useGuestCredit(clientIp);
                                    response = AdvisoryResponse.successWithGuestCredits(
                                            request.username(),
                                            budgetSavior,
                                            smartBalanced,
                                            taskPowerhouse,
                                            tokens,
                                            costs,
                                            request.prompt(),
                                            aiReducedPrompt,
                                            telemetryReport.specializedDomain(),
                                            telemetryReport.finalArbitrageScore(),
                                            newCredits
                                    );
                                } else {
                                    response = AdvisoryResponse.success(
                                            request.username(),
                                            budgetSavior,
                                            smartBalanced,
                                            taskPowerhouse,
                                            tokens,
                                            costs,
                                            request.prompt(),
                                            aiReducedPrompt,
                                            telemetryReport.specializedDomain(),
                                            telemetryReport.finalArbitrageScore()
                                    );
                                }

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