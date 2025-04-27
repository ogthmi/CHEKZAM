package com.ogthmi.chekzam.service.user;

import com.ogthmi.chekzam.dto.user.UserInfoRequest;
import com.ogthmi.chekzam.dto.user.FullUserInfoResponse;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.exception.ApplicationException;
import com.ogthmi.chekzam.exception.message.ExceptionMessageCode;
import com.ogthmi.chekzam.mapper.UserMapper;
import com.ogthmi.chekzam.repository.UserRepository;
import com.ogthmi.chekzam.util.PaginationUtil;
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

    public User findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.USER_NOT_FOUND));
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.USER_NOT_FOUND));
    }

    public User findUserByEmail (String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.USER_NOT_FOUND));
    }


    public User findCurrentUser() {
        var context = SecurityContextHolder.getContext().getAuthentication();
        String username = context.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.USER_NOT_FOUND));
    }

    public FullUserInfoResponse getUserProfile(String userId) {
        User user = findUserById(userId);
        return userMapper.toFullUserInfoResponse(user);
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
        User currentUser = findCurrentUser();
        return userMapper.toFullUserInfoResponse(currentUser);
    }

    public Page<FullUserInfoResponse> getAllUsers(int page, int size, String sortBy, String direction, String keyword) {
        Pageable pageable = PaginationUtil.buildPageable(page, size, sortBy, direction);
        Page<User> userPage = userRepository.findAll(pageable);

        // map mỗi User -> BasicUserInfoResponse và giữ nguyên phân trang
        return userPage.map(userMapper::toFullUserInfoResponse);
    }

    public FullUserInfoResponse updateUserInfo(String userId, UserInfoRequest userInfoRequest) {
        User user = findUserById(userId);
        return updateFullUserInfo(user, userInfoRequest);
    }

    public FullUserInfoResponse updateMyProfile(UserInfoRequest userInfoRequest) {
        User user = findCurrentUser();
        return updateFullUserInfo(user, userInfoRequest);
    }

    private FullUserInfoResponse updateFullUserInfo(User user, UserInfoRequest userInfoRequest) {
        Optional.ofNullable(userInfoRequest.getFirstName()).ifPresent(user::setFirstName);
        Optional.ofNullable(userInfoRequest.getLastName()).ifPresent(user::setLastName);
        Optional.ofNullable(userInfoRequest.getEmail()).ifPresent(user::setEmail);
        Optional.ofNullable(userInfoRequest.getGender()).ifPresent(user::setGender);
        Optional.ofNullable(userInfoRequest.getBirthdate()).ifPresent(user::setBirthdate);
        Optional.ofNullable(userInfoRequest.getSchool()).ifPresent(user::setSchool);
        Optional.ofNullable(userInfoRequest.getDepartment()).ifPresent(user::setDepartment);

        userRepository.save(user);
        return userMapper.toFullUserInfoResponse(user);
    }


    public void changePassword(String userId, String oldPassword, String newPassword) {
        User user = findUserById(userId);

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new ApplicationException(ExceptionMessageCode.PASSWORD_MISMATCH);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void deleteUser(String userId) {
        User user = findUserById(userId);
        userRepository.delete(user);
    }
}
