package com.ogthmi.chekzam.module.user.user_service;

import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.module.user.user_dto.PasswordChangeRequest;
import com.ogthmi.chekzam.module.user.user_dto.UserInfoRequest;
import com.ogthmi.chekzam.module.user.user_dto.FullUserInfoResponse;
import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.user.UserMapper;
import com.ogthmi.chekzam.module.user.UserRepository;
import com.ogthmi.chekzam.common.util.PaginationUtil;
import com.ogthmi.chekzam.module.user.user_enum.Role;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RegisterUserService registerUserService;
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

    public HashMap<String, Long> countUsersByRole(){
        HashMap<String, Long> userCount = new HashMap<>();
        userCount.put("totalUsers", userRepository.count());
        userCount.put(Role.ADMIN.name().toLowerCase(), userRepository.countByRoleAdmin());
        userCount.put(Role.TEACHER.name().toLowerCase().toLowerCase(), userRepository.countByRoleTeacher());
        userCount.put(Role.STUDENT.name().toLowerCase(), userRepository.countByRoleStudent());
        return userCount;
    }

    public FullUserInfoResponse getMyUserProfile() {
        UserEntity currentUserEntity = findCurrentUser();
        return userMapper.toFullUserInfoResponse(currentUserEntity);
    }

    public Page<FullUserInfoResponse> getAllUsers(int pageNumber, int pageSize, String sortBy, String direction, String keyword) {
        List<UserEntity> users;
        Page<UserEntity> userPage;

        if ("roles[0]".equals(sortBy)) {
            // Lấy toàn bộ danh sách để sort thủ công
            if (keyword == null || keyword.isEmpty()) {
                users = userRepository.findAll();
            } else {
                users = userRepository.searchByFullName(keyword);
            }

            // Bản đồ ưu tiên theo vai trò
            Map<String, Integer> rolePriority = Map.of(
                    Role.ADMIN.name().toLowerCase(), 1,
                    Role.TEACHER.name().toLowerCase(), 2,
                    Role.STUDENT.name().toLowerCase(), 3
            );

            // Sort thủ công theo vai trò đầu tiên
            users.sort((u1, u2) -> {
                String roleName1 = (u1.getRoles() != null && !u1.getRoles().isEmpty()) ?
                        u1.getRoles().get(0).name().toLowerCase() : "";
                String roleName2 = (u2.getRoles() != null && !u2.getRoles().isEmpty()) ?
                        u2.getRoles().get(0).name().toLowerCase() : "";

                int rank1 = rolePriority.getOrDefault(roleName1, Integer.MAX_VALUE);
                int rank2 = rolePriority.getOrDefault(roleName2, Integer.MAX_VALUE);

                return Integer.compare(rank1, rank2);
            });

            if ("desc".equalsIgnoreCase(direction)) {
                Collections.reverse(users);
            }

            // Thực hiện paging thủ công
            int start = pageNumber * pageSize;
            int end = Math.min(start + pageSize, users.size());
            List<UserEntity> pagedUsers = users.subList(start, end);

            List<FullUserInfoResponse> mapped = pagedUsers.stream()
                    .map(userMapper::toFullUserInfoResponse)
                    .collect(Collectors.toList());

            return new PageImpl<>(mapped, PageRequest.of(pageNumber, pageSize), users.size());
        } else {
            Sort sort;

            if ("fullName".equalsIgnoreCase(sortBy)) {
                Sort firstnameSort = direction.equalsIgnoreCase("asc")
                        ? Sort.by("firstName").ascending()
                        : Sort.by("firstName").descending();

                Sort lastnameSort = direction.equalsIgnoreCase("asc")
                        ? Sort.by("lastName").ascending()
                        : Sort.by("lastName").descending();

                sort = firstnameSort.and(lastnameSort);
            } else {
                sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
            }

            Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

            if (keyword == null || keyword.isEmpty()) {
                userPage = userRepository.findAll(pageable);
            } else {
                userPage = userRepository.searchByFullName(keyword, pageable);
            }

            return userPage.map(userMapper::toFullUserInfoResponse);
        }
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


    public void changePassword(PasswordChangeRequest passwordChangeRequest) {
        UserEntity userEntity = findCurrentUser();

        if (!passwordEncoder.matches(passwordChangeRequest.getOldPassword(), userEntity.getPassword())) {
            throw new ApplicationException(ExceptionMessageCode.INCORRECT_PASSWORD);
        }
        if (passwordChangeRequest.getNewPassword().equals(passwordChangeRequest.getOldPassword())){
            throw new ApplicationException(ExceptionMessageCode.NEW_PASSWORD_IDENTICAL);
        }
        if (!passwordChangeRequest.getNewPassword().equals(passwordChangeRequest.getConfirmPassword())){
            throw new ApplicationException(ExceptionMessageCode.PASSWORD_MISMATCH);
        }
        registerUserService.validatePassword(passwordChangeRequest.getNewPassword());
        userEntity.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
        userRepository.save(userEntity);
    }

    public void deleteUser(String userId) {
        if (userId == null) throw new ApplicationException(ExceptionMessageCode.USER_NOT_FOUND);
        userRepository.deleteById(userId);
    }
}
