package com.xwtracker.login;

import com.xwtracker.puzzletrackeruser.PuzzleTrackerUser;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUserDetailsService;
import com.xwtracker.puzzletrackeruser.PuzzleTrackerUserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {
    private final PasswordEncoder passwordEncoder;
    private final PuzzleTrackerUserRepository userRepository;
    private final PuzzleTrackerUserDetailsService userDetailsService;

    public LoginController(PasswordEncoder passwordEncoder, PuzzleTrackerUserRepository userRepository, PuzzleTrackerUserDetailsService userDetailsService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/register")
    public UserDetails registerNewUser(@RequestParam String email, @RequestParam String username, @RequestParam String password) {
        PuzzleTrackerUser user = new PuzzleTrackerUser();
        user.getAuthorities().add(new SimpleGrantedAuthority("USER"));
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return userDetailsService.loadUserByUsername(username);
    }
}
