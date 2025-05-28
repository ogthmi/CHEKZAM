import {Container, Row, Col, Button, Card, Form} from "react-bootstrap";
import {usePaginatedTable} from "../../../ui/hooks/pagination/usePaginatedTable";
import {useState, useContext, useEffect} from "react";
import {EntityTypes} from "../../../constants/data/EntityTypes";
import {AssignmentInfoContext} from "../components/context/AssignmentInfoContext";
import {toast} from "react-toastify";
import {CustomerFormTextArea} from "../../../ui/components/form/CommonFormTextArea";
import {AssignmentQuestionDisplay} from "../components/common/AssignmentQuestionDisplay";
import {CommonSearchInput} from "../../../ui/components/list-page/CommonSearchInput";
import {QuestionForm} from "./QuestionForm";
import {updateData} from "../../../services/CRUDService";
import {CommonLoadingSpinner} from "../../../ui/components/spinner/CommonLoadingSpinner";
import {useNavigate, useParams} from "react-router-dom";
import {ClassroomInfoContext} from "../../classroom/components/common/ClassroomInfoContext";

export const AssignmentDetailsPage = () => {
    const [currentAssignment] = useContext(AssignmentInfoContext);
    const assignmentId = currentAssignment?.assignmentId;
    const {
        queryParams,
        updateQueryParams,
        objectData,
        observerRef,
        totalPages,
    } = usePaginatedTable({
        entityType: EntityTypes.assignment.QUESTIONS,
        containerId: assignmentId,
        itemId: null,
        defaultSortBy: "questionOrder",
        sortFieldKeys: {id: "questionId"},
        infiniteScroll: true,
    });

    const [isEditing, setIsEditing] = useState(false);

    // Track changes
    const [newQuestions, setNewQuestions] = useState([]);
    const [deletedQuestions, setDeletedQuestions] = useState([]);
    const [editedQuestions, setEditedQuestions] = useState([]);


    const handleAddQuestion = () => {
        const newQuestion = {
            questionId: `new-${Date.now()}`,
            questionContent: "",
            answerList: [],
        };
        setNewQuestions(prev => [...prev, newQuestion]);
    };

    const handleDeleteQuestion = (questionId) => {
        if (questionId.toString().startsWith("new-")) {
            setNewQuestions(prev => prev.filter(q => q.questionId !== questionId));
        } else {
            setDeletedQuestions(prev => [...prev, questionId]);
            setEditedQuestions(prev => prev.filter(q => q.questionId !== questionId));
        }
    };

    const handleQuestionEdit = (questionId, field, value) => {
        setEditedQuestions(prev => {
            const existing = prev.find(q => q.questionId === questionId);
            if (existing) {
                return prev.map(q => q.questionId === questionId ? {...q, [field]: value} : q);
            }

            // Nếu chưa có trong editedQuestions, tìm từ objectData để copy đầy đủ
            const original = objectData.find(q => q.questionId === questionId);
            if (!original) return prev;

            return [...prev, {...original, [field]: value}];
        });

        setNewQuestions(prev => prev.map(q =>
            q.questionId === questionId ? {...q, [field]: value} : q
        ));
    };


    const handleAnswerEdit = (questionId, answerIndex, field, value) => {
        const isNew = questionId.toString().startsWith("new-");

        const updateFn = (questions) => questions.map(q => {
            if (q.questionId === questionId) {
                let updatedAnswers = [...q.answerList];

                if (field === "correct" && currentAssignment.assignmentType === "SINGLE_CHOICE") {
                    // Đảm bảo chỉ có 1 đáp án đúng
                    updatedAnswers = updatedAnswers.map((ans, idx) => ({
                        ...ans,
                        correct: idx === answerIndex
                    }));
                } else {
                    // Cập nhật thông thường
                    updatedAnswers[answerIndex] = {
                        ...updatedAnswers[answerIndex],
                        [field]: value
                    };
                }

                return {...q, answerList: updatedAnswers};
            }
            return q;
        });

        if (isNew) {
            setNewQuestions(updateFn);
        } else {
            // Đảm bảo editedQuestions có đầy đủ dữ liệu trước khi chỉnh
            setEditedQuestions(prev => {
                const exists = prev.find(q => q.questionId === questionId);

                if (exists) {
                    return updateFn(prev);
                }

                // Lấy dữ liệu gốc từ objectData
                const original = objectData.find(q => q.questionId === questionId);
                if (!original) return prev;

                const updated = updateFn([original]);
                return [...prev, ...updated];
            });
        }
    };


    const handleAddAnswer = (questionId) => {
        const newAnswer = {
            answerContent: "",
            correct: false,
        };

        const updateFn = (q) => ({
            ...q,
            answerList: [...q.answerList, newAnswer],
        });

        if (questionId.toString().startsWith("new-")) {
            setNewQuestions((prev) =>
                prev.map((q) => q.questionId === questionId ? updateFn(q) : q)
            );
        } else {
            const original = objectData.find((q) => q.questionId === questionId);
            if (!original) return;

            setEditedQuestions((prev) => {
                const exists = prev.find((q) => q.questionId === questionId);
                if (exists) {
                    return prev.map((q) =>
                        q.questionId === questionId ? updateFn(q) : q
                    );
                } else {
                    return [...prev, updateFn(original)];
                }
            });
        }
    };


    const handleDeleteAnswer = (questionId, answerIndex) => {
        const updateFn = (q) => ({
            ...q,
            answerList: q.answerList.filter((_, i) => i !== answerIndex),
        });

        if (questionId.toString().startsWith("new-")) {
            setNewQuestions((prev) =>
                prev.map((q) => q.questionId === questionId ? updateFn(q) : q)
            );
        } else {
            const original = objectData.find((q) => q.questionId === questionId);
            if (!original) return;

            setEditedQuestions((prev) => {
                const exists = prev.find((q) => q.questionId === questionId);
                if (exists) {
                    return prev.map((q) =>
                        q.questionId === questionId ? updateFn(q) : q
                    );
                } else {
                    return [...prev, updateFn(original)];
                }
            });
        }
    };


    const startEditing = () => {
        setIsEditing(true);
    };

    const handleSaveChanges = async () => {
        const payload = {
            newQuestions,
            deletedQuestions,
            editedQuestions,
        };
        console.log(payload)
        const {success} = await updateData(EntityTypes.assignment.QUESTIONS, null, assignmentId, payload);
        if (success) {
            toast.success("Cập nhật câu hỏi thành công!");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    };

    const resetChanges = () => {
        setNewQuestions([]);
        setDeletedQuestions([]);
        setEditedQuestions([]);
    };

    const renderAllQuestions = () => {
        const filteredObjectData = objectData.filter(q => !deletedQuestions.includes(q.questionId));
        const combined = [...filteredObjectData, ...newQuestions];

        return combined.map((question, index) => {
            const isEdited = editedQuestions.find(q => q.questionId === question.questionId);
            const data = isEdited ? {...question, ...isEdited} : question;

            return (
                <QuestionForm
                    key={data.questionId}
                    question={data}
                    questionIndex={index}
                    assignmentType={currentAssignment.assignmentType}
                    onQuestionContentChange={(e, qIdx) =>
                        handleQuestionEdit(data.questionId, "questionContent", e.target.value)
                    }
                    onAnswerContentChange={(e, qIdx, aIdx) =>
                        handleAnswerEdit(data.questionId, aIdx, "answerContent", e.target.value)
                    }
                    onAnswerOptionChange={(qIdx, aIdx) =>
                        handleAnswerEdit(data.questionId, aIdx, "correct", !data.answerList[aIdx].correct)
                    }
                    addAnswerOption={(qIdx) => handleAddAnswer(data.questionId)}
                    removeAnswerOption={(qIdx, aIdx) => handleDeleteAnswer(data.questionId, aIdx)}
                    removeQuestion={() => handleDeleteQuestion(data.questionId)}
                />
            );
        });
    };

    if (!assignmentId) return <p>Đang tải...</p>;

    return (
        <Container>
            <Row className="mt-3 mb-4">
                <Col lg={10} className="px-0 mb-2 mb-lg-0">
                    <CommonSearchInput placeholder={"Tìm kiếm câu hỏi theo nội dung"} onSearch={(keyword) => updateQueryParams({keyword})}/>
                </Col>
                <Col lg={2} className="px-0 ps-lg-2 ps-0 mb-lg-0 mb-2">
                    {isEditing ? (
                        <div className={"text-lg-end text-center"}>
                            <Button
                                variant="light"
                                className="me-2"
                                onClick={() => setIsEditing(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                className=""
                                variant="primary"
                                onClick={handleSaveChanges}
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    ) : (
                        <Button className="w-100" onClick={startEditing}>
                            Sửa nội dung
                        </Button>
                    )}
                </Col>
            </Row>

            <Row className="p-0 mb-2">
                {isEditing ? renderAllQuestions() :
                    objectData.map((question, index) => (
                        <AssignmentQuestionDisplay key={index} question={question}/>
                    ))
                }
                <div ref={observerRef}></div>
            </Row>

            <Row>
                {isEditing && (
                    <div className="px-0 mt-2 mb-4 d-flex justify-content-between">
                        <Button variant="outline-secondary" onClick={handleAddQuestion}>
                            + Thêm câu hỏi
                        </Button>
                        <div>
                            <Button
                                variant="light"
                                className="me-2"
                                onClick={() => setIsEditing(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                className=""
                                variant="primary"
                                onClick={handleSaveChanges}
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    </div>
                )}
            </Row>
        </Container>
    );
};
