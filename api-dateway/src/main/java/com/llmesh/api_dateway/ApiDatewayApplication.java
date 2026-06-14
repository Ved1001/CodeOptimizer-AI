package com.llmesh.api_dateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiDatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiDatewayApplication.class, args);
	}

	@Bean
	public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
		return builder.routes()
				.route("routing-service-route", r -> r.path("/api/v1/route/**")
						.uri("lb://routing-engine"))
				.route("budget-service-route", r -> r.path("/api/v1/budget/**")
						.uri("lb://budget-service"))
				.build();
	}
}
