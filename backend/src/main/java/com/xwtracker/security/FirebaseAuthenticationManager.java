package com.xwtracker.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Component
public class FirebaseAuthenticationManager implements AuthenticationManager {
    private final FirebaseAuth firebaseAuth;

    public FirebaseAuthenticationManager(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (!(authentication instanceof BearerTokenAuthenticationToken token)) {
            throw new OAuth2AuthenticationException("Invalid authentication token.");
        }
        try {
            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(token.getToken());
            OAuth2AccessToken credentials = new OAuth2AccessToken(
                OAuth2AccessToken.TokenType.BEARER,
                decodedToken.getUid(),
                Instant.ofEpochSecond((Long) decodedToken.getClaims().get("iat")),
                Instant.ofEpochSecond((Long) decodedToken.getClaims().get("exp"))
            );
            Collection<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
            DefaultOAuth2User user = new DefaultOAuth2User(authorities, Map.of("uid", decodedToken.getUid()), "uid");
            return new BearerTokenAuthentication(user, credentials, authorities);
        }
        catch (FirebaseAuthException e) {
            throw new BadCredentialsException("An error occurred while validating the Firebase token.", e);
        }
    }
}