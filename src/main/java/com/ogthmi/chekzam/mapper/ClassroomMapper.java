package com.ogthmi.chekzam.mapper;

import com.ogthmi.chekzam.dto.request.ClassroomRequest;
import com.ogthmi.chekzam.dto.response.ClassroomResponse;
import com.ogthmi.chekzam.entity.Classroom;
import com.ogthmi.chekzam.util.DateTimeUtil;
import org.springframework.stereotype.Component;

@Component
public class ClassroomMapper {
    public ClassroomResponse toClassroomResponse(Classroom classroom){
        ClassroomResponse.ClassroomTeacher classroomTeacher = ClassroomResponse.ClassroomTeacher.builder()
                .teacherId(classroom.getTeacher().getUserId())
                .teacherName(classroom.getTeacher().getFullName())
                .build();
        ClassroomResponse.ClassroomStatistic classroomStatistic = ClassroomResponse.ClassroomStatistic.builder()
                .totalDocuments(0)
                .totalExercises(0)
                .totalMembers((classroom.getStudents() != null ? classroom.getStudents().size() : 0))
                .build();
        return ClassroomResponse.builder()
                .classroomId(classroom.getClassroomId())
                .classroomName(classroom.getClassroomName())
                .description(classroom.getDescription())
                .createdAt(DateTimeUtil.formatDateTime(classroom.getCreatedAt()))
                .classroomTeacher(classroomTeacher)
                .classroomStatistic(classroomStatistic)
                .build();
    }

    public Classroom toClassroom(ClassroomRequest classroomRequest){
        return Classroom.builder()
                .classroomName(classroomRequest.getClassroomName())
                .description(classroomRequest.getDescription())
                .build();
    }

}
