package com.society.sm.service;

import com.society.sm.model.User;
import com.society.sm.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(String email, String password, String role) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPassword().equals(password) && user.getRole().equalsIgnoreCase(role)) {
                return user;
            }
        }
        return null;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getAllMembers() {
        return userRepository.findByRole("MEMBER");
    }

    public User payMaintenance(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setMaintenancePaid(true);
            return userRepository.save(user);
        }
        return null;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public long countMembers() {
        return userRepository.findByRole("MEMBER").size();
    }
}
