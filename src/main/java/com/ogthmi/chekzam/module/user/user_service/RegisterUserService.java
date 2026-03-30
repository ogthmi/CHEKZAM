package com.ogthmi.chekzam.module.user.user_service;

import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.module.user.user_enum.Role;
import com.ogthmi.chekzam.module.user.user_dto.UserInfoRequest;
import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.user.UserMapper;
import com.ogthmi.chekzam.module.user.UserRepository;
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

    public void validatePassword(String password) {
        // Validate password length
        if (password.length() < 8) {
            throw new ApplicationException(ExceptionMessageCode.WEAK_PASSWORD);
        }

        // Validate uppercase letter existence
        if (!password.matches(".*[A-Z].*")) {
            throw new ApplicationException(ExceptionMessageCode.PASSWORD_MISSING_UPPERCASE);
        }

        // Validate lowercase letter existence
        if (!password.matches(".*[a-z].*")) {
            throw new ApplicationException(ExceptionMessageCode.PASSWORD_MISSING_LOWERCASE);
        }

        // Validate digit existence
        if (!password.matches(".*\\d.*")) {
            throw new ApplicationException(ExceptionMessageCode.PASSWORD_MISSING_NUMBER);
        }

        // Validate special char existence
        if (!password.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            throw new ApplicationException(ExceptionMessageCode.PASSWORD_MISSING_SPECIAL_CHAR);
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

    public UserEntity registerUser(UserInfoRequest userInfoRequest) {
        if (userRepository.existsByUsername(userInfoRequest.getUsername())) {
            throw new ApplicationException(ExceptionMessageCode.USER_ALREADY_EXIST);
        }

        if (userRepository.existsByEmail(userInfoRequest.getEmail())){
            throw new ApplicationException(ExceptionMessageCode.EMAIL_ALREADY_EXIST);
        }

        validatePassword(userInfoRequest.getPassword());
        String encodedPassword = passwordEncoder.encode(userInfoRequest.getPassword());

        List<Role> roles = defineRolesByRequest(userInfoRequest.getRole());

        UserEntity newUserEntity = userMapper.toUser(userInfoRequest, encodedPassword, roles);
        userRepository.save(newUserEntity);

        log.info("Register new user successfully: {}", newUserEntity.getUserId());
        return newUserEntity;
    }

}
