package com.ogthmi.chekzam.module.user.user_service;

import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.module.user.user_dto.UserInfoRequest;
import com.ogthmi.chekzam.module.user.user_dto.FullUserInfoResponse;
import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.user.UserMapper;
import com.ogthmi.chekzam.module.user.UserRepository;
import com.ogthmi.chekzam.common.util.PaginationUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserEntity findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.USER_NOT_FOUND));
    }

    public UserEntity findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.USER_NOT_FOUND));
    }

    public UserEntity findUserByEmail (String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.USER_NOT_FOUND));
    }


    public UserEntity findCurrentUser() {
        var context = SecurityContextHolder.getContext().getAuthentication();
        String username = context.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.USER_NOT_FOUND));
    }

    public FullUserInfoResponse getUserProfile(String userId) {
        UserEntity userEntity = findUserById(userId);
        return userMapper.toFullUserInfoResponse(userEntity);
    }

    public FullUserInfoResponse searchProfile(String keyword) {
        if (keyword == null) {
            throw new ApplicationException(ExceptionMessageCode.USER_NOT_FOUND);
        }
        if (keyword.matches("\\d+")) {
            if (userRepository.existsById(keyword)) {
                return userMapper.toFullUserInfoResponse(findUserById(keyword));
            }
        }
        else if (keyword.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
            if (userRepository.existsByEmail(keyword)) {
                return userMapper.toFullUserInfoResponse(findUserByEmail(keyword));
            }
        }
        else {
            if (userRepository.existsByUsername(keyword)) {
                return userMapper.toFullUserInfoResponse(findUserByUsername(keyword));
            }
        }
        throw new ApplicationException(ExceptionMessageCode.USER_NOT_FOUND);
    }


    public FullUserInfoResponse getMyUserProfile() {
        UserEntity currentUserEntity = findCurrentUser();
        return userMapper.toFullUserInfoResponse(currentUserEntity);
    }

    public Page<FullUserInfoResponse> getAllUsers(int page, int size, String sortBy, String direction, String keyword) {
        Pageable pageable = PaginationUtil.buildPageable(page, size, sortBy, direction);
        Page<UserEntity> userPage = userRepository.findAll(pageable);

        // map mỗi UserEntity -> BasicUserInfoResponse và giữ nguyên phân trang
        return userPage.map(userMapper::toFullUserInfoResponse);
    }

    public FullUserInfoResponse updateUserInfo(String userId, UserInfoRequest userInfoRequest) {
        UserEntity userEntity = findUserById(userId);
        return updateFullUserInfo(userEntity, userInfoRequest);
    }

    public FullUserInfoResponse updateMyProfile(UserInfoRequest userInfoRequest) {
        UserEntity userEntity = findCurrentUser();
        return updateFullUserInfo(userEntity, userInfoRequest);
    }

    private FullUserInfoResponse updateFullUserInfo(UserEntity userEntity, UserInfoRequest userInfoRequest) {
        Optional.ofNullable(userInfoRequest.getFirstName()).ifPresent(userEntity::setFirstName);
        Optional.ofNullable(userInfoRequest.getLastName()).ifPresent(userEntity::setLastName);
        Optional.ofNullable(userInfoRequest.getEmail()).ifPresent(userEntity::setEmail);
        Optional.ofNullable(userInfoRequest.getGender()).ifPresent(userEntity::setGender);
        Optional.ofNullable(userInfoRequest.getBirthdate()).ifPresent(userEntity::setBirthdate);
        Optional.ofNullable(userInfoRequest.getSchool()).ifPresent(userEntity::setSchool);
        Optional.ofNullable(userInfoRequest.getDepartment()).ifPresent(userEntity::setDepartment);

        userRepository.save(userEntity);
        return userMapper.toFullUserInfoResponse(userEntity);
    }


    public void changePassword(String userId, String oldPassword, String newPassword) {
        UserEntity userEntity = findUserById(userId);

        if (!passwordEncoder.matches(oldPassword, userEntity.getPassword())) {
            throw new ApplicationException(ExceptionMessageCode.PASSWORD_MISMATCH);
        }

        userEntity.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(userEntity);
    }

    public void deleteUser(String userId) {
        UserEntity userEntity = findUserById(userId);
        userRepository.delete(userEntity);
    }
}
