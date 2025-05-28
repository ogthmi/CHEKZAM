import React, {useState} from 'react';
import {Container, Row, Button, Col, Card, Form} from 'react-bootstrap';
import {useModal} from "../../../ui/hooks/data/useModal";
import {AssignmentUploadModal} from "../components/modal/AssignmentUploadModal";
import {QuestionForm} from "./QuestionForm";
import {toast} from "react-toastify";
import {createData} from "../../../services/CRUDService";
import {EntityTypes} from "../../../constants/data/EntityTypes";
import {Endpoints} from "../../../constants/links/Endpoints";
import {UserRoles} from "../../../constants/data/UserRoles";

export const AssignmentCreatePage = () => {
    const {isModalOpen, openModal, closeModal} = useModal();

    const [assignment, setAssignment] = useState({
        assignmentName: '',
        description: '',
        assignmentType: 'SINGLE_CHOICE',
        duration: "",
        maxAttempts: "",
        startTime: null,
        endTime: null,
        questionList: [],
    });

    const addQuestion = () => {
        const newQuestion = {
            questionContent: '',
            answerList: [{answerContent: '', correct: false}]
        };
        setAssignment({
            ...assignment, questionList: [...assignment.questionList, newQuestion]
        });
    };

    const removeQuestion = (questionIndex) => {
        const updatedQuestionList = assignment.questionList.filter((_, index) => index !== questionIndex);
        setAssignment({
            ...assignment, questionList: updatedQuestionList
        });
    };

    const addAnswerOption = (questionIndex) => {
        const updatedQuestionList = [...assignment.questionList];
        updatedQuestionList[questionIndex].answerList.push({answerContent: '', correct: false});
        setAssignment({
            ...assignment, questionList: updatedQuestionList
        });
    };

    const removeAnswerOption = (questionIndex, answerIndex) => {
        const updatedQuestionList = [...assignment.questionList];
        updatedQuestionList[questionIndex].answerList = updatedQuestionList[questionIndex].answerList.filter((_, index) => index !== answerIndex);
        setAssignment({
            ...assignment, questionList: updatedQuestionList
        });
    };

    const handleAnswerOptionChange = (questionIndex, answerIndex) => {
        const updatedQuestionList = [...assignment.questionList];

        if (assignment.assignmentType === 'SINGLE_CHOICE') {
            updatedQuestionList[questionIndex].answerList = updatedQuestionList[questionIndex].answerList.map((answer, index) => ({
                ...answer, correct: index === answerIndex, // Chỉ đáp án được chọn là đúng
            }));
        } else if (assignment.assignmentType === 'MULTIPLE_CHOICE') {
            updatedQuestionList[questionIndex].answerList[answerIndex].correct = !updatedQuestionList[questionIndex].answerList[answerIndex].correct;
        }

        setAssignment({
            ...assignment, questionList: updatedQuestionList
        });
    };

    const handleQuestionContentChange = (e, questionIndex) => {
        const updatedQuestionList = [...assignment.questionList];
        updatedQuestionList[questionIndex].questionContent = e.target.value;
        setAssignment({
            ...assignment, questionList: updatedQuestionList
        });
    };

    const handleAnswerContentChange = (e, questionIndex, answerIndex) => {
        const updatedQuestionList = [...assignment.questionList];
        updatedQuestionList[questionIndex].answerList[answerIndex].answerContent = e.target.value;
        setAssignment({
            ...assignment, questionList: updatedQuestionList
        });
    };

    const handleFileUploadModalData = (parsedData) => {
        // Kiểm tra xem có câu hỏi nào có nhiều đáp án đúng không
        const isMultipleChoice = parsedData.some((question) =>
            question.answerList.filter((answer) => answer.correct).length > 1 // Có nhiều đáp án đúng
        );

        setAssignment({
            ...assignment,
            questionList: parsedData,
            assignmentType: isMultipleChoice ? 'MULTIPLE_CHOICE' : 'SINGLE_CHOICE'
        });

        toast.success("Đã tải câu hỏi từ file thành công!");
    };

    const handleSubmit = async () => {
        // 1. Check đáp án đúng
        const invalidQuestionIndexes = assignment.questionList
            .map((question, index) =>
                !question.answerList.some((answer) => answer.correct) ? index : null
            )
            .filter((index) => index !== null);

        if (invalidQuestionIndexes.length > 0) {
            toast.error(`Câu hỏi ${invalidQuestionIndexes.map(i => i + 1).join(', ')} chưa có đáp án đúng!`);
            return;
        }

        // 2. Check câu hỏi trống nội dung
        const emptyQuestionIndexes = assignment.questionList
            .map((question, index) =>
                !question.questionContent || question.questionContent.trim() === "" ? index : null
            )
            .filter((index) => index !== null);

        if (emptyQuestionIndexes.length > 0) {
            toast.error(`Câu hỏi ${emptyQuestionIndexes.map(i => i + 1).join(', ')} chưa có nội dung!`);
            return;
        }
        console.log('Submitted data:', assignment);
        try {
            const { success, data, message } = await createData(EntityTypes.assignment.CREATE, null, null, assignment);
            if (success) {
                toast.success("Tạo bài tập thành công");
                console.info(data);
                setTimeout(() => {window.location.href = Endpoints.assignment.root(UserRoles.teacher.value.toLowerCase());}, 3000);

            } else {
                toast.error(message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    return (
        <Container className="p-2 mt-3">
            <Row className="my-3">
                <div className="p-md-0 mx-md-0 mx-3 d-md-flex justify-content-between">
                    <h5>Tạo bài tập mới</h5>
                    <Button variant="outline-secondary" size="sm" onClick={openModal}>
                        Đọc bài tập từ file
                    </Button>

                    {isModalOpen && <AssignmentUploadModal modalTitle="Đọc bài tập từ file"
                                                           show={isModalOpen} handleClose={closeModal}
                                                           handleData={handleFileUploadModalData}/>}
                </div>
                <Card className="p-3 mx-md-0 mx-3 mt-3 rounded-0">
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tên bài tập</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên bài tập"
                                        value={assignment.assignmentName}
                                        onChange={(e) => setAssignment({...assignment, assignmentName: e.target.value})}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Loại bài tập</Form.Label>
                                    <Form.Select
                                        value={assignment.assignmentType}
                                        onChange={(e) => setAssignment({...assignment, assignmentType: e.target.value})}
                                    >
                                        <option value="SINGLE_CHOICE">Trắc nghiệm một đáp án</option>
                                        <option value="MULTIPLE_CHOICE">Trắc nghiệm nhiều đáp án</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mô tả</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Mô tả bài tập"
                                        value={assignment.description}
                                        onChange={(e) => setAssignment({...assignment, description: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                <div className={'d-flex justify-content-center'}>
                    <Button variant="primary" className={'mt-4'} onClick={handleSubmit}>
                        Lưu bài tập
                    </Button>
                </div>

                <h5 className="p-md-0 mx-md-0 mx-3 my-3">Danh sách câu hỏi</h5>
                {assignment.questionList.map((question, questionIndex) => (
                    <QuestionForm
                        key={questionIndex}
                        question={question}
                        questionIndex={questionIndex}
                        assignmentType={assignment.assignmentType}
                        onQuestionContentChange={handleQuestionContentChange}
                        onAnswerContentChange={handleAnswerContentChange}
                        onAnswerOptionChange={handleAnswerOptionChange}
                        addAnswerOption={addAnswerOption}
                        removeAnswerOption={removeAnswerOption}
                        removeQuestion={removeQuestion}
                    />
                ))}

                <div className="d-flex justify-content-center">
                    <Button variant="outline-primary" size="sm" onClick={addQuestion}>
                        Thêm câu hỏi
                    </Button>
                </div>
            </Row>
        </Container>
    );
};
