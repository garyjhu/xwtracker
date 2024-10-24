package com.xwtracker.security;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUserRepository;
import com.xwtracker.solvegroup.SolveGroup;
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
import java.util.List;

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
            PuzzleTrackerUser user = new PuzzleTrackerUser(uid);
            List<SolveGroup> solveGroups = user.getSolveGroups();
            solveGroups.add(new SolveGroup("NYT Monday", user, "#ffadad"));
            solveGroups.add(new SolveGroup("NYT Tuesday", user, "#ffd6a5"));
            solveGroups.add(new SolveGroup("NYT Wednesday", user, "#fdffb6"));
            solveGroups.add(new SolveGroup("NYT Thursday", user, "#caffbf"));
            solveGroups.add(new SolveGroup("NYT Friday", user, "#9bf6ff"));
            solveGroups.add(new SolveGroup("NYT Saturday", user, "#a0c4ff"));
            solveGroups.add(new SolveGroup("NYT Sunday", user, "#bdb2ff"));
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
