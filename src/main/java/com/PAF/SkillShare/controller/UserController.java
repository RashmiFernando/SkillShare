package com.PAF.SkillShare.controller;

import com.PAF.SkillShare.model.User;
import com.PAF.SkillShare.service.UserService;
import com.PAF.SkillShare.dto.UpdateProfileRequest;
import com.PAF.SkillShare.dto.LoginRequest;
import com.PAF.SkillShare.dto.SignUpRequest;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import org.json.JSONObject;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final String jwtSecret = "40bcc802c0c243feecfcf04d221c3a87ccb4993d09447355d0304b3055479e743c3e07b006176bc1bebb474fc78e9a1b05b7c9218b595ca3402a8dbd1e8c3e6b42bdb405e8ccee3980059935dc8a8fc3bd25ade134970bf5aae3c2c47633637c8ad07fae5ff0e11d81f5c34dba135c1ba795c462cb02ece693245e419f5e9df74515372e93a7af4dca1005b03f33feb7acda500477792e4823a8699b4894ba54c89af29375a1faeebec1dd06c125e33e46c980fb5e289a3a1c72d8f387d941ce3963729db446c8952724a84ef8f36a267b5b07f6a74beb9a135a4671c6c78142406d13b260086428f1025afb4ca17c90ee1bea13cd342083ca28f381b516e6ad";
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = Jwts.parser()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        Optional<User> user = userService.findByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateUserProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = Jwts.parser()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            User updatedUser = userService.updateUser(email, request.getName(), request.getBio(),
                    request.getSkills(), request.getProfileImageUrl());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Your profile has been successfully updated.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "An error occurred while updating your profile. Please try again.");
            return ResponseEntity.status(400).body(response);
        }
    }

    @DeleteMapping("/profile")
    public ResponseEntity<Map<String, String>> deleteUserProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = Jwts.parser()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            userService.deleteUser(email);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Your profile has been successfully deleted.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "An error occurred while deleting your profile. Please try again.");
            return ResponseEntity.status(400).body(response);
        }
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, String>> signIn(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            String token = Jwts.builder()
                    .setSubject(user.getEmail())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                    .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .compact();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid email or password");
            return ResponseEntity.status(401).body(response);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signUp(@RequestBody SignUpRequest signUpRequest) {
        try {
            User user = userService.registerUser(signUpRequest.getEmail(), signUpRequest.getPassword(), signUpRequest.getName(), signUpRequest.getBio(), signUpRequest.getSkills(), signUpRequest.getProfileImageUrl());
            String token = Jwts.builder()
                    .setSubject(user.getEmail())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                    .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .compact();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Registration successful");
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    @GetMapping("/career-roadmap")
    public ResponseEntity<Map<String, String>> getCareerRoadmap(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = Jwts.parser()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            Optional<User> userOptional = userService.findByEmail(email);
            if (userOptional.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "User not found");
                return ResponseEntity.status(404).body(response);
            }
            User user = userOptional.get();
            String skills = user.getSkills() != null ? String.join(", ", user.getSkills()) : "None";
            String bio = user.getBio() != null ? user.getBio() : "No bio provided";

            // Construct prompt for Gemini API
            String prompt = String.format(
                "Based on the following user profile, recommend career tracks and a learning roadmap. " +
                "User skills: %s. User interests (from bio): %s. " +
                "Consider high-demand roles in the tech industry for 2025. " +
                "Provide a concise roadmap with 3 career tracks, each including a job title, " +
                "required skills, and a 3-step learning plan. Format as plain text.",
                skills, bio
            );

            // Call Gemini API
            HttpClient client = HttpClient.newHttpClient();
            JSONObject requestBody = new JSONObject();
            requestBody.put("contents", new JSONObject()
                .put("parts", new JSONObject()
                    .put("text", prompt)
                )
            );
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + geminiApiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            JSONObject jsonResponse = new JSONObject(response.body());
            String roadmap = jsonResponse.getJSONArray("candidates")
                .getJSONObject(0)
                .getJSONObject("content")
                .getJSONArray("parts")
                .getJSONObject(0)
                .getString("text");

            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("roadmap", roadmap);
            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to generate career roadmap: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}