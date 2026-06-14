package com.llmesh.routing_engine.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.llmesh.routing_engine.utils.PromptOptimizer;
import java.util.Map;

/**
 * OptimizationDtos — Main Wrapper Holder for LLMesh DTOs
 */
public final class OptimizationDtos {
    // This wrapper can remain empty; it just hosts the file footprint.
}

// ------------------------------------------------------------
// INTERNAL TELEMETRY SHAPES (Package-Private is fine here)
// ------------------------------------------------------------
record BudgetCheckRequest(String username, long amountMicrocents) {}
record BudgetCheckResponse(boolean authorized, long remainingBalanceMicrocents, String message) {}
record GrokMessage(String role, String content) {}
record GrokRequest(String model, java.util.List<GrokMessage> messages, double temperature, int max_tokens) {}
record GrokChoice(GrokMessage message) {}
record GrokResponse(java.util.List<GrokChoice> choices) {}