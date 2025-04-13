package com.ogthmi.chekzam.service.user;

import com.ogthmi.chekzam.constant.Role;
import com.ogthmi.chekzam.dto.request.UserRequest;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.exception.ApplicationException;
import com.ogthmi.chekzam.exception.MessageCode;
import com.ogthmi.chekzam.mapper.UserMapper;
import com.ogthmi.chekzam.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
@Slf4j
public class RegisterUserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private void validatePassword(String password){
        if (password.length() < 8) {
            log.info("PASSWORD: WEAK");
            throw new ApplicationException(MessageCode.WEAK_PASSWORD);
        }
    }
    private List<Role> defineRolesByRequest (Role request){
        List<Role> roles = new ArrayList<>();
        roles.add(request);
        if (request.equals(Role.TEACHER)){
            roles.add(Role.STUDENT);
        }
        return roles;
    }

    public User registerUser(UserRequest userRequest) {
        if (userRepository.findByUsername(userRequest.getUsername()).isPresent()) {
            throw new ApplicationException(MessageCode.USER_ALREADY_EXIST);
        }

        validatePassword(userRequest.getPassword());
        log.info("Password: OK");

        String encodedPassword = passwordEncoder.encode(userRequest.getPassword());

        List<Role> roles = defineRolesByRequest(userRequest.getRole());
        log.info("ADD ROLE SUCCESSFULLY");

        User newUser = userMapper.toUser(userRequest, encodedPassword, roles);
        userRepository.save(newUser);

        return newUser;
    }

}
