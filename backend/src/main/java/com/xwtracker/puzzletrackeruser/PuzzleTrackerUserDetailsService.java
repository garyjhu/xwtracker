package com.xwtracker.puzzletrackeruser;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class PuzzleTrackerUserDetailsService implements UserDetailsService {
    private final PuzzleTrackerUserRepository userRepository;

    public PuzzleTrackerUserDetailsService(PuzzleTrackerUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        PuzzleTrackerUser user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return new PuzzleTrackerUserDetails(user);
    }
}
