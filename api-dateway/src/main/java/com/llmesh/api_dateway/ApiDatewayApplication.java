package com.llmesh.api_dateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class ApiDatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiDatewayApplication.class, args);
    }

    @GetMapping("/health")
    public String health() {
        return "API Gateway OK";
    }
}
