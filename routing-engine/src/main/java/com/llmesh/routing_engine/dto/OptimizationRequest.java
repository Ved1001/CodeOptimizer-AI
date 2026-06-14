package com.llmesh.routing_engine.dto;

public record OptimizationRequest(
        String username,
        String provider,
        String prompt
) {}