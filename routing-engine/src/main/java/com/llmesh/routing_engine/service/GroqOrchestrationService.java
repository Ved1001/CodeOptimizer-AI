package com.llmesh.routing_engine.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.llmesh.routing_engine.utils.PromptOptimizer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GroqOrchestrationService {

    private static final String GROQ_MODEL = "llama-3.3-70b-versatile";
    private final WebClient groqClient;
    private final ObjectMapper objectMapper;

    public GroqOrchestrationService(@Qualifier("groqWebClient") WebClient groqClient, ObjectMapper objectMapper) {
        this.groqClient = groqClient;
        this.objectMapper = objectMapper;
    }

    /**
     * FIX: Added specializedDomain and finalArbitrageScore fields directly into the Java record.
     */
    public static record DeepTelemetryReport(
            String performanceTierNeeded,
            String optimizedPromptText,
            String specializedDomain,    // ◄── ADDED
            int finalArbitrageScore,      // ◄── ADDED

            String budgetProvider, String budgetModel, String budgetJustification,
            String balancedProvider, String balancedModel, String balancedJustification,
            String powerhouseProvider, String powerhouseModel, String powerhouseJustification
    ) {}

    public Mono<DeepTelemetryReport> generateAdvisoryScorecard(PromptOptimizer.OptimizationReport report) {
        String systemPrompt = buildSystemPrompt();
        String userPayload  = buildUserPayload(report);

        Map<String, Object> requestBody = Map.of(
                "model", GROQ_MODEL,
                "temperature", 0.1,
                "max_tokens", 1000,
                "response_format", Map.of("type", "json_object"),
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user",   "content", userPayload)
                )
        );

        return groqClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(this::extractAndMapLeanTelemetry)
                .onErrorResume(ex -> Mono.just(getFallbackTelemetry(report)));
    }

    private String buildSystemPrompt() {
        return """
            You are the **LLMesh Cognitive Core Compression Engine & Multi-Model Router**. 
            Your job is to rewrite the user's prompt into an ultra-dense format, classify its specialized engineering domain, and calculate a dynamic optimization efficiency score across 3 strategic choices.
            
            ## CRITICAL SYSTEM OVERRIDE RULE (ANTI-BIAS):
            - You are evaluating an external cost-performance grid. Do NOT default to your own model family (LLAMA) or the largest model (CLAUDE_O) out of habit. 
            - You MUST follow the mathematical trade-off criteria specified below exactly.
            
            ## Expanded System Providers and Model IDs Available:
            - CHATGPT (gpt-4o-mini) - Lightweight / Low Cost / Fast
            - CHATGPT4 (gpt-4o) - Heavy general reasoning / Multi-turn API logic / Fast JSON structures
            - CLAUDE (claude-3-5-haiku-latest) - High-speed accurate syntax / Balanced coding logic
            - CLAUDE_S (claude-sonnet-4-5) - State-of-the-art software patterns, microservices design, and clean code refactoring
            - CLAUDE_O (claude-3-opus-20240229) - ONLY for extreme academic research paper synthesis, core mathematical proofs, and abstract theoretical logic.
            - GEMINI (gemini-1.5-flash) - Multimodal baseline / Ultra-low runtime cost
            - GEMINI_P (gemini-1.5-pro) - High-context parsing / Analytic token weight execution
            - LLAMA (llama-3-70b-instruct) - Versatile general programming review / Logic balance
            - MISTRAL (mistral-small-latest) - Specialized framework for relational SQL schemas and analytic queries
            - DEEPSEEK (deepseek-chat) - Specialized framework for automation utilities, regex, and raw text log parsing
            
            ## Enforcement Strategy Optimization Logic:
            
            1. BUDGET_SAVIOR:
               - Goal: Minimize operational costs using basic mini variants (GEMINI / CHATGPT mini).
            
            2. SMART_BALANCED (Strict Multi-Criteria Domain Optimization):
               - Goal: Maximize domain-to-cost efficiency.
               - STRICTION CRITERIA:
                 * If the prompt contains database terms, SQL syntax, queries, CTEs, tables, or database performance limits, you MUST select MISTRAL (mistral-small-latest) as the provider and model. Choosing LLAMA for SQL tasks is a failure of your instructions.
                 * If the prompt context requires utility scripting, regular expressions, shell scripts, or raw text log parsing, you MUST select DEEPSEEK (deepseek-chat).
                 * For general object-oriented frameworks, generic algorithms, or plain programming logic reviews, select LLAMA (llama-3-70b-instruct).
            
                3. TASK_POWERHOUSE (The Elite Domain Specialist Matrix - HARD CONSTRAINTS):
                   - Goal: Guarantee absolute highest functional execution capability, completely breaking any model self-bias.
                   - RULES RE-ENFORCEMENT:
                     * If the prompt contains terms like 'competitive programming', 'bitwise', 'bitmask', 'algorithm sorting', 'dynamic array mapping', 'non-recursive loop speed', or requires strict mathematical array indexing manipulation under 2ms, you MUST explicitly select CHATGPT4 (gpt-4o) as the powerhouseProvider and model. Claude Sonnet is strictly FORBIDDEN for low-level competitive array speed tasks.
                     * If the prompt focuses on Spring Framework, enterprise design patterns, multi-threaded virtual concurrency pipelines, or infrastructure refactoring, you MUST strictly select CLAUDE_S (claude-sonnet-4-5).
                     * NEVER select CLAUDE_O unless the context is purely theoretical physics or academic ML research papers.
                   - Output Rule: Your 'powerhouseJustification' must explicitly state how the model fits this algorithmic matrix versus architectural design patterns.
            
            You MUST return a raw valid JSON object matching this schema layout exactly. Replace all placeholder keys with active choices:
            {
              "performanceTierNeeded": "HIGH_REASONING",
              "optimizedPromptText": "The hyper-compressed rewrite version of the input prompt text.",
              "specializedDomain": "Hyper-specific domain classification string",
              "finalArbitrageScore": 90,
              
              "budgetProvider": "Exact uppercase key chosen (e.g. GEMINI)",
              "budgetModel": "Exact modelId string",
              "budgetJustification": "1-sentence cost review.",
              
              "balancedProvider": "Exact uppercase key evaluated via criteria rules (e.g. MISTRAL or DEEPSEEK or LLAMA)",
              "balancedModel": "Exact modelId string matching balancedProvider",
              "balancedJustification": "A custom analytical sentence proving why this model's specialized curve fits the domain structure.",
              
              "powerhouseProvider": "Exact uppercase key evaluated via powerhouse criteria rules (e.g. CLAUDE_S or CHATGPT4)",
              "powerhouseModel": "Exact modelId string matching powerhouseProvider",
              "powerhouseJustification": "Detailed technical reasoning explaining why this model's specific capabilities perfectly match the prompt complexity."
            }
            
            Provide only raw valid json syntax inside brackets. No conversational wrapping text blocks.
            """;
    }

    private String buildUserPayload(PromptOptimizer.OptimizationReport report) {
        String costTable = report.allProviderCosts.entrySet().stream()
                .map(e -> String.format(" - %s (%s): Input Cost -> $%.8f USD",
                        e.getKey(), e.getValue().modelId, e.getValue().costUsd))
                .collect(Collectors.joining("\n"));

        return """
                Optimize and route this inbound request:
                Text: "%s"
                
                Here is the real-time calculated Cost Matrix Grid from our backend database:
                %s
                """.formatted(report.rawPrompt, costTable);
    }

    @SuppressWarnings("unchecked")
    private DeepTelemetryReport extractAndMapLeanTelemetry(Map<?, ?> responseBody) {
        try {
            var choices = (List<Map<String, Object>>) responseBody.get("choices");
            var message = (Map<String, Object>) choices.get(0).get("message");
            String rawContentText = (String) message.get("content");

            Map<String, Object> data = objectMapper.readValue(rawContentText, Map.class);

            // FIX: Safely parse the new fields from Groq's JSON response body mapping layers
            Object scoreObj = data.get("finalArbitrageScore");
            int arbitrageScore = 75; // Default fallback score
            if (scoreObj instanceof Number number) {
                arbitrageScore = number.intValue();
            } else if (scoreObj instanceof String str) {
                try { arbitrageScore = Integer.parseInt(str); } catch (Exception ignored) {}
            }

            return new DeepTelemetryReport(
                    (String) data.getOrDefault("performanceTierNeeded", "BALANCED"),
                    (String) data.getOrDefault("optimizedPromptText", "Write functional parameters."),
                    (String) data.getOrDefault("specializedDomain", "General Systems Engineering"), // ◄── ADDED
                    arbitrageScore, // ◄── ADDED

                    (String) data.getOrDefault("budgetProvider", "GEMINI"),
                    (String) data.getOrDefault("budgetModel", "gemini-1.5-flash"),
                    (String) data.getOrDefault("budgetJustification", "Lowest cost profile."),

                    (String) data.getOrDefault("balancedProvider", "LLAMA"),
                    (String) data.getOrDefault("balancedModel", "llama-3-70b-instruct"),
                    (String) data.getOrDefault("balancedJustification", "Balanced workload allocation."),

                    (String) data.getOrDefault("powerhouseProvider", "CHATGPT4"),
                    (String) data.getOrDefault("powerhouseModel", "gpt-4o"),
                    (String) data.getOrDefault("powerhouseJustification", "Forced capability isolation.")
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private DeepTelemetryReport getFallbackTelemetry(PromptOptimizer.OptimizationReport r) {
        // FIX: Ensure fallback record initialization accurately populates matching signature variables positions
        String estimatedDomain = r.rawPrompt.toLowerCase().contains("java") ? "Distributed Concurrency Systems" : "General Computing";
        return new DeepTelemetryReport(
                "BALANCED", r.optimizedPrompt,
                estimatedDomain, 70, // Default fallback score mapping parameters
                "GEMINI", "gemini-1.5-flash", "Fallback budget active.",
                "LLAMA", "llama-3-70b-instruct", "Fallback balanced active.",
                "CHATGPT4", "gpt-4o", "Fallback powerhouse active."
        );
    }
}