package com.ogthmi.chekzam.service.user;

import com.ogthmi.chekzam.dto.request.UserRequest;
import com.ogthmi.chekzam.dto.response.user.UserProfileResponse;
import com.ogthmi.chekzam.dto.response.user.UserTokenResponse;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.exception.ApplicationException;
import com.ogthmi.chekzam.exception.MessageCode;
import com.ogthmi.chekzam.mapper.UserMapper;
import com.ogthmi.chekzam.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    private User findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(MessageCode.USER_NOT_FOUND));
    }

    public User findCurrentUser() {
        var context = SecurityContextHolder.getContext().getAuthentication();
        String username = context.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ApplicationException(MessageCode.USER_NOT_FOUND));
    }

    public UserTokenResponse getUserTokenResponse(String userId) {
        User user = findUserById(userId);
        return userMapper.toTokenUserResponse(user);
    }

    public UserProfileResponse getUserProfile(String userId) {
        User user = findUserById(userId);
        return userMapper.toUserProfileResponse(user);
    }

    public UserProfileResponse getMyUserProfile() {
        User currentUser = findCurrentUser();
        return userMapper.toUserProfileResponse(currentUser);
    }

    public Page<UserTokenResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("userId").ascending());
        Page<User> userPage = userRepository.findAll(pageable);

        // map mỗi User -> UserTokenResponse và giữ nguyên phân trang
        return userPage.map(userMapper::toTokenUserResponse);
    }


    public UserProfileResponse updateUserInfo(String userId, UserRequest userRequest) {
        User user = findUserById(userId);
        return updateUserProfile(user, userRequest);
    }

    public UserProfileResponse updateMyProfile(UserRequest userRequest) {
        User user = findCurrentUser();
        return updateUserProfile(user, userRequest);
    }

    private UserProfileResponse updateUserProfile(User user, UserRequest userRequest) {
        Optional.ofNullable(userRequest.getFullName()).ifPresent(user::setFullName);
        Optional.ofNullable(userRequest.getEmail()).ifPresent(user::setEmail);
        Optional.ofNullable(userRequest.getGender()).ifPresent(user::setGender);
        Optional.ofNullable(userRequest.getBirthdate()).ifPresent(user::setBirthdate);
        Optional.ofNullable(userRequest.getSchool()).ifPresent(user::setSchool);
        Optional.ofNullable(userRequest.getDepartment()).ifPresent(user::setDepartment);

        userRepository.save(user);
        return userMapper.toUserProfileResponse(user);
    }


    public void changePassword(String userId, String oldPassword, String newPassword) {
        User user = findUserById(userId);

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new ApplicationException(MessageCode.PASSWORD_MISMATCH);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void deleteUser(String userId) {
        User user = findUserById(userId);
        userRepository.delete(user);
    }
}
