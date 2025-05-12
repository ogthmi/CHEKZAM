package com.ogthmi.chekzam.module.classroom;

import com.ogthmi.chekzam.module.classroom.classroom_dto.ClassroomInfoRequest;
import com.ogthmi.chekzam.module.classroom.classroom_dto.ClassroomInfoResponse;
import org.springframework.stereotype.Component;

@Component
public class ClassroomMapper {
    public ClassroomInfoResponse toClassroomResponse(ClassroomEntity classroomEntity){
        ClassroomInfoResponse.ClassroomTeacher classroomTeacher = ClassroomInfoResponse.ClassroomTeacher.builder()
                .teacherId(classroomEntity.getTeacher().getUserId())
                .firstName(classroomEntity.getTeacher().getFirstName())
                .lastName(classroomEntity.getTeacher().getLastName())
                .build();
        ClassroomInfoResponse.ClassroomStatistic classroomStatistic = ClassroomInfoResponse.ClassroomStatistic.builder()
                .totalDocuments(0)
                .totalAssignments(classroomEntity.getAssignmentList() != null? classroomEntity.getAssignmentList().size(): 0)
                .totalMembers(classroomEntity.getStudentList().size())
                .build();
        return ClassroomInfoResponse.builder()
                .classroomId(classroomEntity.getClassroomId())
                .classroomName(classroomEntity.getClassroomName())
                .description(classroomEntity.getDescription())
                .createdAt(classroomEntity.getCreatedAt())
                .classroomTeacher(classroomTeacher)
                .classroomStatistic(classroomStatistic)
                .build();
    }

    public ClassroomEntity toClassroom(ClassroomInfoRequest classroomInfoRequest){
        return ClassroomEntity.builder()
                .classroomName(classroomInfoRequest.getClassroomName())
                .description(classroomInfoRequest.getDescription())
                .build();
    }

}
