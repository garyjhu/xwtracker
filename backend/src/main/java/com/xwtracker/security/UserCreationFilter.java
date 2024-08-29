package com.xwtracker.security;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class UserCreationFilter extends OncePerRequestFilter {
    private final PuzzleTrackerUserRepository userRepository;

    public UserCreationFilter(PuzzleTrackerUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String uid = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userRepository.findById(uid).isEmpty()) {
            PuzzleTrackerUser user = new PuzzleTrackerUser();
            user.setUid(uid);
            userRepository.save(user);
        }
        filterChain.doFilter(request, response);
    }

    @Bean
    public FilterRegistrationBean<UserCreationFilter> userCreationFilterRegistration(UserCreationFilter filter) {
        FilterRegistrationBean<UserCreationFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }
}
