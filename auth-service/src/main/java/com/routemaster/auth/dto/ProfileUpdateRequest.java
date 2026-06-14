package com.routemaster.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record ProfileUpdateRequest(
    @NotBlank(message = "Name cannot be empty")
    String name
) {}
