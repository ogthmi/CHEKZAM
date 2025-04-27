package com.ogthmi.chekzam.service.user;

import com.ogthmi.chekzam.constant.Role;
import com.ogthmi.chekzam.dto.user.UserInfoRequest;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.exception.ApplicationException;
import com.ogthmi.chekzam.exception.message.ExceptionMessageCode;
import com.ogthmi.chekzam.mapper.UserMapper;
import com.ogthmi.chekzam.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class RegisterUserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private void validatePassword(String password){
        if (password.length() < 8) {
            throw new ApplicationException(ExceptionMessageCode.WEAK_PASSWORD);
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

    public User registerUser(UserInfoRequest userInfoRequest) {
        if (userRepository.existsByUsername(userInfoRequest.getUsername())) {
            throw new ApplicationException(ExceptionMessageCode.USER_ALREADY_EXIST);
        }

        if (userRepository.existsByEmail(userInfoRequest.getEmail())){
            throw new ApplicationException(ExceptionMessageCode.EMAIL_ALREADY_EXIST);
        }

        validatePassword(userInfoRequest.getPassword());

        String encodedPassword = passwordEncoder.encode(userInfoRequest.getPassword());

        List<Role> roles = defineRolesByRequest(userInfoRequest.getRole());

        User newUser = userMapper.toUser(userInfoRequest, encodedPassword, roles);
        userRepository.save(newUser);

        log.info("Register new user successfully: {}", newUser.getUserId());
        return newUser;
    }

}
