package com.llmesh.routing_engine.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * BudgetService — LLMesh Routing Engine
 *
 * Handles all internal communication with the budget-service microservice.
 *
 * Charges a flat 50 microcents per /analyze-and-advise call.
 * Uses non-blocking WebClient — integrates cleanly into reactive chains.
 */
@Service
public class BudgetService {

    private static final Logger log = LoggerFactory.getLogger(BudgetService.class);

    /** Flat platform fee for each analyze-and-advise call (in microcents) */
    public static final long ANALYSIS_FEE_MICROCENTS = 50L;

    @Value("${llmesh.budget-service.enabled:false}")
    private boolean enabled;

    private final WebClient budgetClient;

    public BudgetService(@Qualifier("budgetWebClient") WebClient budgetClient) {
        this.budgetClient = budgetClient;
    }

    // -------------------------------------------------------------------------
    // PUBLIC API
    // -------------------------------------------------------------------------

    /**
     * Checks if the user has sufficient balance and charges the platform fee.
     *
     * Calls: POST /api/v1/budget/check
     * Expects budget-service to atomically check AND deduct in one operation.
     *
     * @param username LLMesh platform username
     * @return Mono<BudgetResult> — authorized flag + remaining balance + message
     */
    public Mono<BudgetResult> checkAndCharge(String username) {
        if (!enabled) {
            log.info("[Budget] Service disabled. Bypassing check for user={}", username);
            return Mono.just(new BudgetResult(true, -1L, "Budget service disabled"));
        }

        Map<String, Object> requestPayload = Map.of(
                "username",        username,
                "amountMicrocents", ANALYSIS_FEE_MICROCENTS
        );

        return budgetClient.post()
                .uri("/api/v1/budget/check")
                .bodyValue(requestPayload)
                .retrieve()
                // Treat 402 Payment Required as a valid (not exceptional) authorization denial
                .onStatus(
                        status -> status == HttpStatus.PAYMENT_REQUIRED,
                        response -> response.bodyToMono(Map.class)
                                .map(body -> new BudgetAuthorizationException(
                                        extractMessage(body, "Insufficient funds")))
                )
                .bodyToMono(Map.class)
                .map(body -> new BudgetResult(
                        true,
                        toLong(body.get("remainingBalanceMicrocents")),
                        extractMessage(body, "Authorized")
                ))
                .onErrorResume(BudgetAuthorizationException.class, ex ->
                        Mono.just(new BudgetResult(false, 0L, ex.getMessage()))
                )
                .onErrorResume(WebClientResponseException.class, ex -> {
                    log.error("[Budget] HTTP error from budget-service: {} {}", ex.getStatusCode(), ex.getMessage());
                    // Fail-open for 5xx budget-service errors: allow request through with a warning log.
                    // Change to Mono.just(new BudgetResult(false, 0L, "Budget service error")) to fail-closed.
                    return Mono.just(new BudgetResult(true, -1L, "Budget service unavailable — proceeding with caution"));
                })
                .onErrorResume(Exception.class, ex -> {
                    log.error("[Budget] Unexpected error: {}", ex.getMessage(), ex);
                    return Mono.just(new BudgetResult(true, -1L, "Budget check failed — proceeding"));
                })
                .doOnSuccess(result -> log.info("[Budget] user={} authorized={} remaining={}mc",
                        username, result.authorized(), result.remainingBalanceMicrocents()));
    }

    // -------------------------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------------------------

    private String extractMessage(Map<?, ?> body, String fallback) {
        Object msg = body.get("message");
        return msg != null ? msg.toString() : fallback;
    }

    private long toLong(Object val) {
        if (val == null) return 0L;
        if (val instanceof Number n) return n.longValue();
        try { return Long.parseLong(val.toString()); } catch (NumberFormatException e) { return 0L; }
    }

    // -------------------------------------------------------------------------
    // RESULT + EXCEPTION TYPES
    // -------------------------------------------------------------------------

    /**
     * Result of a budget check-and-charge operation.
     *
     * @param authorized                True if the user had sufficient balance and was charged
     * @param remainingBalanceMicrocents Remaining balance after deduction (-1 if unknown)
     * @param message                   Human-readable status from budget-service
     */
    public record BudgetResult(
            boolean authorized,
            long    remainingBalanceMicrocents,
            String  message
    ) {}

    /** Thrown internally when budget-service returns 402 Payment Required */
    static class BudgetAuthorizationException extends RuntimeException {
        public BudgetAuthorizationException(String message) { super(message); }
    }
}
