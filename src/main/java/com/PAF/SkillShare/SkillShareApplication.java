package com.PAF.SkillShare;

import com.PAF.SkillShare.service.FileStorageService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SkillShareApplication {

	public static void main(String[] args) {
		SpringApplication.run(SkillShareApplication.class, args);
	}

	@Bean
	CommandLineRunner init(FileStorageService fileStorageService) {
		return (args) -> {
			fileStorageService.init();
		};
	}
}
