import {Endpoints} from "../../../../constants/links/Endpoints";
import {EntityTypes} from "../../../../constants/data/EntityTypes";
import {DataActions} from "../../../../constants/data/ActionMethods";
import {Cookies} from "../../../../constants/data/Cookies";
import {ClassroomListPage, ClassroomAssignmentPage, ClassroomMemberPage} from "../../ClassroomPagesModule";


export const ClassroomRowActions = ({
                                        page,
                                        isTeacher,
                                        currentClassroom = null,
                                        row,
                                        dataFields,
                                        navigate = null,
                                        showModal
                                    }) => {
    const actions = {
        [ClassroomListPage]: [
            {
                label: "Xem chi tiết",
                onClick: () => navigate(`${row[dataFields.classroomId.value]}${Endpoints.assignment.domain}`),
            },
            ...(isTeacher ? [
                {
                    label: "Chỉnh sửa",
                    onClick: () => {
                        showModal(EntityTypes.classroom.INFO, {mode: DataActions.UPDATE, data: row});
                    },
                },
                {
                    label: "Xóa",
                    onClick: () => {
                        showModal(EntityTypes.classroom.DELETE, {
                            title: "Xác nhận xóa lớp học",
                            message: `Bạn có chắc muốn xóa lớp "${row.classroomName}" không?`,
                            containerId: null,
                            itemId: row.classroomId,
                            entityType: EntityTypes.classroom.INFO,
                        });
                    }
                }

            ] : []),
            ...(!isTeacher ? [
                {
                    label: "Rời khỏi lớp",
                    onClick: () => {
                        showModal(EntityTypes.classroom.LEAVE, {
                            title: "Xác nhận rời lớp học",
                            message: `Bạn có chắc muốn rời khỏi lớp "${row.classroomName}" không?`,
                            containerId: row.classroomId,
                            itemId: Cookies.getCookie(Cookies.userInfo)?.userId,
                        });
                    }
                }
            ] : []),
        ],

        [ClassroomAssignmentPage]: [
            {
                label: "Xem chi tiết",
                onClick: () => {
                    if (isTeacher) return navigate(`${row[dataFields.assignmentId.value]}${Endpoints.assignment.content}`);
                    else return navigate(`${row[dataFields.assignmentId.value]}${Endpoints.assignment.history}`);
                },
            },
            ...(isTeacher ? [
                {
                    label: "Chỉnh sửa",
                    onClick: () => {
                        console.log("sửa bài tập")
                    }
                },
                {
                    label: "Xóa",
                    onClick: () => {
                        showModal(EntityTypes.classroom.REMOVE_ASSIGNMENT, {
                            title: "Xác nhận xóa bài tập khỏi lớp",
                            message: `Bạn có chắc muốn xóa bài tập ${row.assignmentName} khỏi lớp "${currentClassroom.classroomName}" không?`,
                            classroomId: currentClassroom.classroomId,
                            assignmentId: row.assignmentId,
                            entityType: EntityTypes.classroom.REMOVE_ASSIGNMENT,
                        });
                    }
                }
            ] : []),
        ],

        ClassroomDocumentPage: [],

        [ClassroomMemberPage]: [
            ...(isTeacher ? [
                {
                    label: "Xóa thành viên",
                    onClick: () => {
                        showModal(EntityTypes.classroom.REMOVE_STUDENT, {
                            title: "Xóa sinh viên khỏi lớp",
                            message: `Bạn có chắc muốn xóa sinh viên ${row.lastName} ${row.firstName} khỏi lớp "${currentClassroom.classroomName}" không?`,
                            classroomId: currentClassroom.classroomId,
                            studentId: row.userId
                        });
                    },
                }
            ] : [])
        ]
    };
    return actions[page] || [];
};

