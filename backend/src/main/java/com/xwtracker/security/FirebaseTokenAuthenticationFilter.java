package com.xwtracker.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class FirebaseTokenAuthenticationFilter extends OncePerRequestFilter {
    private final FirebaseAuth firebaseAuth;
    private final SecurityService securityService;

    public FirebaseTokenAuthenticationFilter(FirebaseAuth firebaseAuth, SecurityService securityService) {
        this.firebaseAuth = firebaseAuth;
        this.securityService = securityService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        verifyFirebaseToken(request);
        filterChain.doFilter(request, response);
    }

    private void verifyFirebaseToken(HttpServletRequest request) {
        String bearerToken = securityService.getBearerToken(request);
        try {
            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(bearerToken);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(decodedToken.getUid(), null, null);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        catch (FirebaseAuthException e) {
            System.out.println("Firebase exception: " + e.getLocalizedMessage());
        }
    }
}
