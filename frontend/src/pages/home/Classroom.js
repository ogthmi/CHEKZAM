import React from "react";
import { SharedLayout } from "../../components/layout/SharedLayout"
import { ClassroomDetailsLayout } from "../../components/layout/ClassroomDetailsLayout"
import { ClassroomPage } from "../../components/page/ClassroomPage"
import { ClassroomAssignmentPage } from "../../components/page/ClassroomAssignmentPage";
import { ClassroomMemberPage } from "../../components/page/ClassroomMemberPage";

export function Classroom() {
    return (
        <SharedLayout>
            <ClassroomPage />
        </SharedLayout>
    );
}

export function ClassroomAssignment() {
    return (
        <ClassroomDetailsLayout>
            <ClassroomAssignmentPage />
        </ClassroomDetailsLayout>
    )
}

export function ClassroomMember() {
    return (
        <ClassroomDetailsLayout>
            <ClassroomMemberPage />
        </ClassroomDetailsLayout>
    )
}

