package com.company.salestracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class SalesTrackingApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalesTrackingApplication.class, args);
	}

}
