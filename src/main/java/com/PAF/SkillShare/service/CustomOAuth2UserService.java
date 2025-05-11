package com.PAF.SkillShare.service;

import com.PAF.SkillShare.model.User;
import com.PAF.SkillShare.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);
    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        try {
            OAuth2User oAuth2User = super.loadUser(userRequest);
            return processOAuth2User(oAuth2User);
        } catch (Exception e) {
            logger.error("Error loading OAuth2 user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to load OAuth2 user", e);
        }
    }

    private OAuth2User processOAuth2User(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        if (email == null) {
            logger.error("OAuth2 user email is null. Attributes: {}", oAuth2User.getAttributes());
            throw new RuntimeException("Email not provided by OAuth2 provider");
        }

        logger.info("Processing OAuth2 user with email: {}", email);

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setName(name != null ? name : user.getName());
            user.setProfileImageUrl(picture != null ? picture : user.getProfileImageUrl());
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(name != null ? name : "Unknown");
            user.setProfileImageUrl(picture);
            user.setCreatedAt(LocalDateTime.now().toString());
        }

        try {
            userRepository.save(user);
        } catch (Exception e) {
            logger.error("Error saving user to database: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save user", e);
        }

        return oAuth2User;
    }
}