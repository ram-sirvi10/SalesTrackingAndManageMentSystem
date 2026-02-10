package com.company.salestracker.runner;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.company.salestracker.entity.User;
import com.company.salestracker.entity.UserStatus;
import com.company.salestracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SuperAdminRunner implements CommandLineRunner {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder encoder;

    @Override
    public void run(String... args) {

        String superAdminEmail = "superadmin@gmail.com";

        if (userRepo.findByEmail(superAdminEmail).isEmpty()) {

            User superAdmin = User.builder()
                    .name("Super Admin")
                    .email(superAdminEmail)
                    .phone("9999999999")
                    .password(encoder.encode("Super@123"))
                    .status(UserStatus.ACTIVE)
                    .build();

            userRepo.save(superAdmin);
        }
    }
}
