package com.ogthmi.chekzam.dto.assignment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentClassroomRequest {
    private List<String> classroomIdList;
}
