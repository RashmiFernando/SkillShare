package com.PAF.SkillShare.config;

import com.PAF.SkillShare.service.CustomOAuth2UserService;
import com.PAF.SkillShare.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserService userService;
    private final CustomOAuth2UserService oAuth2UserService;
    private final String jwtSecret = "40bcc802c0c243feecfcf04d221c3a87ccb4993d09447355d0304b3055479e743c3e07b006176bc1bebb474fc78e9a1b05b7c9218b595ca3402a8dbd1e8c3e6b42bdb405e8ccee3980059935dc8a8fc3bd25ade134970bf5aae3c2c47633637c8ad07fae5ff0e11d81f5c34dba135c1ba795c462cb02ece693245e419f5e9df74515372e93a7af4dca1005b03f33feb7acda500477792e4823a8699b4894ba54c89af29375a1faeebec1dd06c125e33e46c980fb5e289a3a1c72d8f387d941ce3963729db446c8952724a84ef8f36a267b5b07f6a74beb9a135a4671c6c78142406d13b260086428f1025afb4ca17c90ee1bea13cd342083ca28f381b516e6ad";

    public SecurityConfig(@Lazy UserService userService, CustomOAuth2UserService oAuth2UserService) {
        this.userService = userService;
        this.oAuth2UserService = oAuth2UserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter) throws Exception {
        http
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/login", "/api/auth/**", "/api/user/signin", "/api/user/signup", "/error").permitAll()
                        .requestMatchers("/api/posts/**").permitAll()
                        .requestMatchers("/api/tutorials/**").permitAll()
                        .requestMatchers("/api/quizzes/**").permitAll()
                        .requestMatchers("/api/user/all").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(oAuth2UserService)
                        )
                        .successHandler((request, response, authentication) -> {
                            String email = authentication.getName();
                            String token = Jwts.builder()
                                    .setSubject(email)
                                    .setIssuedAt(new Date())
                                    .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                                    .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                                    .compact();
                            response.sendRedirect("http://localhost:3000/auth?token=" + token);
                        })
                        .failureHandler((request, response, exception) -> {
                            String errorMessage = exception.getMessage() != null ? exception.getMessage() : "OAuth2 authentication failed";
                            response.sendRedirect("http://localhost:3000/auth?error=" + URLEncoder.encode(errorMessage, StandardCharsets.UTF_8));
                        })
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/").permitAll()
                )
                .csrf(csrf -> csrf.disable());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}