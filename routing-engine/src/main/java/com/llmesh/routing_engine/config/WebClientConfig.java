package com.llmesh.routing_engine.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${llmesh.budget-service.base-url:http://localhost:9091}")
    private String budgetServiceBaseUrl;

    @Value("${llmesh.groq.base-url:https://api.groq.com/openai/v1}")
    private String groqBaseUrl;

    @Value("${llmesh.groq.api-key}")
    private String groqApiKey;

    @Bean("budgetWebClient")
    public WebClient budgetWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl(budgetServiceBaseUrl)
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Accept", "application/json")
                .build();
    }

    @Bean("groqWebClient")
    public WebClient groqWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl(groqBaseUrl)
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Accept", "application/json")
                .defaultHeader("Authorization", "Bearer " + groqApiKey)
                .build();
    }
}