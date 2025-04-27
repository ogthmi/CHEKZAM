package com.ogthmi.chekzam.mapper;

import com.ogthmi.chekzam.dto.classroom.ClassroomInfoRequest;
import com.ogthmi.chekzam.dto.classroom.ClassroomInfoResponse;
import com.ogthmi.chekzam.entity.Classroom;
import com.ogthmi.chekzam.util.DateTimeUtil;
import org.springframework.stereotype.Component;

@Component
public class ClassroomMapper {
    public ClassroomInfoResponse toClassroomResponse(Classroom classroom){
        ClassroomInfoResponse.ClassroomTeacher classroomTeacher = ClassroomInfoResponse.ClassroomTeacher.builder()
                .teacherId(classroom.getTeacher().getUserId())
                .firstName(classroom.getTeacher().getFirstName())
                .lastName(classroom.getTeacher().getLastName())
                .build();
        ClassroomInfoResponse.ClassroomStatistic classroomStatistic = ClassroomInfoResponse.ClassroomStatistic.builder()
                .totalDocuments(0)
                .totalExercises(0)
                .totalMembers((classroom.getStudents() != null ? classroom.getStudents().size() : 0))
                .build();
        return ClassroomInfoResponse.builder()
                .classroomId(classroom.getClassroomId())
                .classroomName(classroom.getClassroomName())
                .description(classroom.getDescription())
                .createdAt(classroom.getCreatedAt())
                .classroomTeacher(classroomTeacher)
                .classroomStatistic(classroomStatistic)
                .build();
    }

    public Classroom toClassroom(ClassroomInfoRequest classroomInfoRequest){
        return Classroom.builder()
                .classroomName(classroomInfoRequest.getClassroomName())
                .description(classroomInfoRequest.getDescription())
                .build();
    }

}
