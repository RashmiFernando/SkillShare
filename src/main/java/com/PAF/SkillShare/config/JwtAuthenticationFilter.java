package com.PAF.SkillShare.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final String jwtSecret = "40bcc802c0c243feecfcf04d221c3a87ccb4993d09447355d0304b3055479e743c3e07b006176bc1bebb474fc78e9a1b05b7c9218b595ca3402a8dbd1e8c3e6b42bdb405e8ccee3980059935dc8a8fc3bd25ade134970bf5aae3c2c47633637c8ad07fae5ff0e11d81f5c34dba135c1ba795c462cb02ece693245e419f5e9df74515372e93a7af4dca1005b03f33feb7acda500477792e4823a8699b4894ba54c89af29375a1faeebec1dd06c125e33e46c980fb5e289a3a1c72d8f387d941ce3963729db446c8952724a84ef8f36a267b5b07f6a74beb9a135a4671c6c78142406d13b260086428f1025afb4ca17c90ee1bea13cd342083ca28f381b516e6ad";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Skip filter for public endpoints
        if (request.getServletPath().startsWith("/api/auth") ||
                request.getServletPath().startsWith("/api/user/signin") ||
                request.getServletPath().startsWith("/api/user/signup") ||
                request.getServletPath().startsWith("/api/posts") ||
                request.getServletPath().startsWith("/api/user/all") ||
                request.getServletPath().startsWith("/api/tutorials") ||
                request.getServletPath().startsWith("/api/quizzes") ||
                request.getServletPath().startsWith("/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
                username = claims.getSubject();
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid or expired token");
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = new User(username, "", new ArrayList<>());
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}