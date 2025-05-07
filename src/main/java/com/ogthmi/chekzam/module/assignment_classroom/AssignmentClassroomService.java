package com.ogthmi.chekzam.module.assignment_classroom;

import com.ogthmi.chekzam.module.assignment.AssignmentEntity;
import com.ogthmi.chekzam.module.assignment.AssignmentService;
import com.ogthmi.chekzam.module.assignment_classroom.dto.AssignmentClassroomRequest;
import com.ogthmi.chekzam.module.assignment_classroom.entity.AssignmentClassroomEntity;
import com.ogthmi.chekzam.module.classroom.ClassroomEntity;
import com.ogthmi.chekzam.module.classroom.ClassroomService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@AllArgsConstructor
public class AssignmentClassroomService {
    private final AssignmentService assignmentService;
    private final ClassroomService classroomService;
    private final AssignmentClassroomRepository assignmentClassroomRepository;

    public void attachAssignmentToClassrooms(AssignmentClassroomRequest assignmentClassroomRequest) {
//        ArrayList<AssignmentEntity> assignmentList = new ArrayList<>();
//        for (String assignmentId: assignmentClassroomRequest.getAssignmentIdList()){
//            AssignmentEntity assignment = assignmentService.findAssignmentById(assignmentId);
//            assignmentList.add(assignment);
//        }
//
//        ArrayList<ClassroomEntity> classroomList = new ArrayList<>();
//        for (String classroomId: assignmentClassroomRequest.getClassroomIdList()){
//            ClassroomEntity classroom = classroomService.findClassroomById(classroomId);
//            classroomList.add(classroom);
//        }
//
//        for (AssignmentEntity assignment: assignmentList){
//            for (ClassroomEntity classroom: classroomList){
//                if (assignmentClassroomRepository.existsByAssignmentEntityAndClassroomEntity(assignment, classroom)) continue;
//                AssignmentClassroomEntity assignmentClassroomEntity = AssignmentClassroomEntity.builder()
//                        .assignmentEntity(assignment)
//                        .classroomEntity(classroom)
//                        .build();
//                assignmentClassroomRepository.save(assignmentClassroomEntity);
//            }
//        }
    }

    public void detachAssignmentFromClassroom(String classroomId, String assignmentId) {
//        ClassroomEntity classroomEntity = classroomService.findClassroomById(classroomId);
//        AssignmentEntity assignmentEntity = findAssignmentById(assignmentId);
//
//        AssignmentClassroomEntity assignmentClassroomEntityToRemove = null;
//
//        for (AssignmentClassroomEntity ac : classroomEntity.getAssignmentList()) {
//            if (ac.getAssignmentEntity().equals(assignmentEntity)) {
//                assignmentClassroomEntityToRemove = ac;
//                break;
//            }
//        }
//
//        if (assignmentClassroomEntityToRemove != null) {
//            classroomEntity.getAssignmentList().remove(assignmentClassroomEntityToRemove);
//            assignmentEntity.getClassroomList().remove(assignmentClassroomEntityToRemove);
//
//            assignmentClassroomRepository.delete(assignmentClassroomEntityToRemove);
//
//            assignmentRepository.save(assignmentEntity);
//        } else {
//            throw new ApplicationException(ExceptionMessageCode.CLASSROOM_NOT_ASSOCIATED_WITH_ASSIGNMENT);
//        }
    }
}
