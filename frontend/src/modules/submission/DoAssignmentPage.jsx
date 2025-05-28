import {CommonAppLayout} from "../../ui/components/layout/CommonAppLayout";
import {Col, Container, Row, Button, Navbar} from "react-bootstrap";
import React, {useContext, useEffect, useRef, useState} from "react";
import {AssignmentInfoContext} from "../assignment/components/context/AssignmentInfoContext";
import {ClassroomInfoContext} from "../classroom/components/common/ClassroomInfoContext";
import {usePaginatedTable} from "../../ui/hooks/pagination/usePaginatedTable";
import {EntityTypes} from "../../constants/data/EntityTypes";
import {AssignmentQuestionDisplay} from "../assignment/components/common/AssignmentQuestionDisplay";
import "../../css/Button.css"
import {Logo} from "../../ui/components/navbar/Logo";
import {FullNamePlaceholder} from "../../ui/components/navbar/FullNamePlaceholder";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Endpoints} from "../../constants/links/Endpoints";
import {Cookies} from "../../constants/data/Cookies";
import {createData} from "../../services/CRUDService";
import moment from 'moment';
import {toast} from "react-toastify";

const PAGE_SIZE = 10;


const AssignmentTimer = ({assignment, onTimeout}) => {
    const storageKey = `assignment-timer-${assignment?.assignmentId}`;
    const durationSeconds = assignment?.duration * 60;
    const isUnlimited = !assignment?.duration || assignment.duration === 0;

    const calculateSecondsLeft = () => {
        if (isUnlimited) return null;

        const endTimeStr = localStorage.getItem(storageKey);
        if (endTimeStr) {
            const endTime = new Date(endTimeStr).getTime();
            const now = Date.now();
            const diff = Math.floor((endTime - now) / 1000);
            return diff > 0 ? diff : 0;
        }
        return durationSeconds;
    };

    const [secondsLeft, setSecondsLeft] = useState(calculateSecondsLeft);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isUnlimited) return;

        const endTimeStr = localStorage.getItem(storageKey);
        let endTime;

        if (endTimeStr) {
            endTime = new Date(endTimeStr);
        } else {
            endTime = new Date(Date.now() + durationSeconds * 1000);
            localStorage.setItem(storageKey, endTime.toISOString());
        }

        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const diff = Math.floor((endTime.getTime() - now) / 1000);

            if (diff <= 0) {
                clearInterval(intervalRef.current);
                setSecondsLeft(0);
                localStorage.removeItem(storageKey);
            } else {
                setSecondsLeft(diff);

                if (diff === 3 && typeof onTimeout === "function") {
                    onTimeout();
                }
            }
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [durationSeconds, storageKey, isUnlimited, onTimeout]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const pad = (num) => num.toString().padStart(2, "0");

    return (
        <Navbar expand="md" sticky="top" bg="white" className="p-0 shadow-sm">
            <Container fluid className="mx-3 p-1 align-items-center">
                <div>
                    <Row>
                        <Col><Logo/></Col>
                    </Row>
                </div>

                <div className={"d-flex align-items-center text-primary"}>
                    <h6 className={"my-0 pe-5 d-md-block d-none"}>{`Bài tập: ${assignment?.assignmentName?.toUpperCase()}`}</h6>
                    {!isUnlimited && (
                        <h6
                            className="d-flex justify-content-center my-0"
                            style={{
                                border: "1px solid var(--blue-900)",
                                padding: "0.2rem 1rem",
                                borderRadius: "999px",
                            }}
                        >
                            {`${pad(minutes)}:${pad(seconds)}`}
                        </h6>
                    )}
                </div>
                <FullNamePlaceholder/>
            </Container>
        </Navbar>
    );
};


const QuestionTable = ({onSelectQuestion, currentQuestionOrder, totalQuestions, studentAnswerList}) => {
    const hasAnswer = (questionOrder) => {
        return studentAnswerList.some(ans => {
            const order = questionOrder;
            return ans.selectedAnswerIdSet && ans.selectedAnswerIdSet.length > 0 &&
                ans.questionOrder === order; // nếu bạn lưu cả questionOrder
        });
    };

    return (
        <div>
            <h6 className="mb-3">Bảng câu hỏi</h6>
            <div style={{display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "space-between"}}>
                {Array.from({length: totalQuestions}, (_, i) => {
                    const order = i + 1;
                    const isActive = currentQuestionOrder === order;
                    const answered = studentAnswerList.find(ans => ans.questionOrder === order && ans.selectedAnswerIdSet?.length > 0);
                    const unsure = studentAnswerList.find(ans => ans.questionOrder === order && ans.isUnsure);

                    let variant = "outline-secondary";
                    if (answered) {
                        variant = "question-chosen";
                    }
                    if (unsure) {
                        variant = "question-warning";
                    }
                    if (isActive) {
                        variant = "primary";
                    }

                    return (
                        <Button
                            key={order}
                            variant={variant}
                            onClick={() => onSelectQuestion(order)}
                            style={{width: "40px", padding: "6px 6px", borderRadius: "0px"}}
                        >
                            {order}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};


export const DoAssignmentPage = () => {
    const location = useLocation();
    const submission = location.state?.submission;
    const {userRole, classroomId, assignmentId} = useParams();
    const [currentAssignment] = useContext(AssignmentInfoContext);
    const assignmentType = currentAssignment?.assignmentType;
    const [startedAt, setStartedAt] = useState(submission?.startedAt);
    const [studentAnswerList, setStudentAnswerList] = useState([]);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadedPages, setLoadedPages] = useState({}); // { pageNumber: true }
    const [currentQuestionOrder, setCurrentQuestionOrder] = useState(1);
    const [currentQuestions, setCurrentQuestions] = useState([]); // Câu hỏi của trang đang hiển thị
    const shouldScrollRef = useRef(false);
    const navigate = useNavigate();
    const hasSubmittedRef = useRef(false);

    const {
        queryParams,
        updateQueryParams,
        objectData,
        totalElements,
    } = usePaginatedTable({
        entityType: EntityTypes.assignment.QUESTIONS,
        containerId: assignmentId,
        defaultSortBy: "questionOrder",
        sortFieldKeys: {id: "questionId"},
        pageSize: PAGE_SIZE,
        infiniteScroll: false,
        manual: true,
    });

    const questionRefs = useRef({});

    useEffect(() => {
        loadPage(1);
    }, [assignmentId]);

    // Hàm load dữ liệu 1 trang
    const loadPage = async (pageNumber) => {
        await updateQueryParams({pageNumber});
        setLoadedPages(prev => ({
            ...prev,
            [pageNumber]: true,
        }));
        setCurrentPage(pageNumber);
    };

    // Khi queryParams.objectData (objectData) thay đổi, cập nhật câu hỏi trang hiện tại và tổng số câu hỏi
    useEffect(() => {
        setCurrentQuestions(objectData);
        setTotalQuestions(totalElements);
    }, [objectData, totalElements]);

    // Khi chọn câu hỏi
    const handleSelectQuestion = async (questionOrder) => {
        const targetPage = Math.floor((questionOrder - 1) / PAGE_SIZE) + 1;
        setCurrentQuestionOrder(questionOrder);
        shouldScrollRef.current = true;
        if (!loadedPages[targetPage]) {
            await loadPage(targetPage);
            // Sau khi load trang xong, currentQuestions sẽ cập nhật qua useEffect trên
        } else {
            setCurrentPage(targetPage);
            // Nếu trang đã load, cập nhật lại currentQuestions từ cached data nếu bạn có cache
            // Với hook usePaginatedTable hiện tại thì gọi loadPage lại hoặc chờ objectData thay đổi
            await updateQueryParams({pageNumber: targetPage}); // đảm bảo objectData cập nhật
        }
    };

    // Scroll câu hỏi sau khi currentQuestions hoặc currentQuestionOrder thay đổi
    useEffect(() => {
        if (!currentQuestions || currentQuestions.length === 0) return;
        if (!shouldScrollRef.current) return;

        const question = currentQuestions.find(q => q.questionOrder === currentQuestionOrder);
        if (question) {
            const node = questionRefs.current[question.questionId];
            if (node) {
                node.scrollIntoView({behavior: "smooth", block: "center"});
            }
        }
    }, [currentQuestions, currentQuestionOrder]);


    const updateAnswer = (questionId, selectedAnswerIdSet) => {
        shouldScrollRef.current = false;
        const question = currentQuestions.find(q => q.questionId === questionId);
        if (!question) return;

        setStudentAnswerList(prev => {
            const existing = prev.find(ans => ans.questionId === questionId);
            const newEntry = {
                questionId,
                questionOrder: question.questionOrder,
                selectedAnswerIdSet,
                isUnsure: existing?.isUnsure || false
            };
            if (existing) {
                return prev.map(ans =>
                    ans.questionId === questionId ? newEntry : ans
                );
            } else {
                return [...prev, newEntry];
            }
        });

        setCurrentQuestionOrder(question.questionOrder);
    };

    const toggleUnsure = (questionId) => {
        setStudentAnswerList(prev => {
            const exists = prev.find(ans => ans.questionId === questionId);
            if (exists) {
                return prev.map(ans =>
                    ans.questionId === questionId
                        ? {...ans, isUnsure: !ans.isUnsure}
                        : ans
                );
            } else {
                // Nếu chưa có câu hỏi trong list, thêm mới với isUnsure = true
                return [...prev, {
                    questionId,
                    questionOrder: currentQuestions.find(q => q.questionId === questionId)?.questionOrder || 0,
                    selectedAnswerIdSet: [],
                    isUnsure: true
                }];
            }
        });
    };


    const handleSubmit = async ({showResult = true}) => {
        if (hasSubmittedRef.current) {
            toast.error("Người dùng đã nộp bài")
            return;
        }
        hasSubmittedRef.current = true;
        const submittedAt = moment().format('DD-MM-YYYY HH:mm:ss');

        const cleanedAnswers = studentAnswerList.map(({isUnsure, selectedAnswerIdSet, ...rest}) => ({
            ...rest,
            selectedAnswerIdSet: selectedAnswerIdSet ?? [],
        }));

        const payload = {
            submissionId: submission?.submissionId,
            assignmentId,
            classroomId,
            startedAt,
            submittedAt,
            studentAnswerList: cleanedAnswers,
        };

        const response = await createData(EntityTypes.submission.SUBMIT, null, null, payload);
        if (showResult) {
            const result = response.data.result;
            if (result) {
                toast.success("Nộp bài thành công.");
                setTimeout(() => {
                    const timerKey = `assignment-timer-${assignmentId}`;
                    const answerKey = `student-answers-${assignmentId}`;
                    localStorage.removeItem(timerKey);
                    localStorage.removeItem(answerKey);
                    navigate(`${Endpoints.classroom.root(userRole)}/${classroomId}/assignment/${assignmentId}/result`, {
                        replace: true,
                        state: {result}
                    })
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                }, 3000);
            }
        }
    };


    // Ngăn bấm chuột phải & bôi đen
    useEffect(() => {
        const preventDefault = e => e.preventDefault();
        document.addEventListener("contextmenu", preventDefault);
        document.addEventListener("selectstart", preventDefault);
        return () => {
            document.removeEventListener("contextmenu", preventDefault);
            document.removeEventListener("selectstart", preventDefault);
        };
    }, []);

    useEffect(() => {
        if (studentAnswerList.length > 0) {
            const key = `student-answers-${assignmentId}`;
            localStorage.setItem(key, JSON.stringify(studentAnswerList));
        }
    }, [studentAnswerList, assignmentId]);
    useEffect(() => {
        const savedAnswers = localStorage.getItem(`student-answers-${assignmentId}`);
        if (savedAnswers) {
            try {
                setStudentAnswerList(JSON.parse(savedAnswers));
            } catch (e) {
                console.error("Lỗi khi parse student answers:", e);
            }
        }
    }, [assignmentId]);


    const linkNewPage = () => {
        return (
            <div className="d-flex justify-content-between mt-4">
                {currentPage > 1 && (
                    <Button
                        variant="outline-primary"
                        size={"sm"}
                        onClick={() => handleSelectQuestion((currentPage - 2) * PAGE_SIZE + 1)}
                    >
                        ← Trang trước
                    </Button>
                )}
                {currentPage < Math.ceil(totalQuestions / PAGE_SIZE) && (
                    <Button
                        variant="outline-primary"
                        size={"sm"}
                        className="ms-auto"
                        onClick={() => handleSelectQuestion(currentPage * PAGE_SIZE + 1)}
                    >
                        Trang tiếp theo →
                    </Button>
                )}
            </div>
        );
    }

    return (
        <>
            <AssignmentTimer assignment={currentAssignment} onTimeout={handleSubmit}/>
            <Container className="px-0 mt-5 mb-4">
                <Row className="p-0">
                    <Col md={3} className="mb-lg-0 mb-5 me-md-5 pe-md-5 pe-0">
                        <div className={"px-md-0 px-4"}>
                            <QuestionTable
                                totalQuestions={totalQuestions}
                                currentQuestionOrder={currentQuestionOrder}
                                onSelectQuestion={handleSelectQuestion}
                                studentAnswerList={studentAnswerList}
                            />
                        </div>
                        <div className={"d-flex justify-content-center mt-4"}>
                            <Button
                                variant="light"
                                size={"sm"}
                                className={"me-2"}
                                onClick={async () => {
                                    const timerKey = `assignment-timer-${assignmentId}`;
                                    const answerKey = `student-answers-${assignmentId}`;

                                    // Gọi hàm nộp bài (handleSubmit) trước
                                    await handleSubmit({showResult: false});

                                    // Sau khi nộp bài xong, xoá localStorage và chuyển trang
                                    localStorage.removeItem(timerKey);
                                    localStorage.removeItem(answerKey);

                                    navigate(Endpoints.classroom.root(Cookies.getCookie(Cookies.mainRole).toLowerCase()));
                                }}
                            >
                                Thoát
                            </Button>
                            <Button variant="primary" size={"sm"} onClick={handleSubmit}>
                                Nộp bài
                            </Button>
                        </div>
                    </Col>
                    <Col>
                        {currentQuestions.length === 0 ? (
                            <p>Đang tải câu hỏi...</p>
                        ) : (
                            currentQuestions.map((question) => (
                                <div
                                    key={question.questionId}
                                    ref={node => {
                                        if (node) questionRefs.current[question.questionId] = node;
                                    }}
                                >
                                    <AssignmentQuestionDisplay
                                        question={question}
                                        isDoingAssignment={true}
                                        allowMultipleChoice={assignmentType === "MULTIPLE_CHOICE"}
                                        selectedAnswerIds={
                                            studentAnswerList.find(ans => ans.questionId === question.questionId)?.selectedAnswerIdSet || []
                                        }
                                        isUnsure={
                                            studentAnswerList.find(ans => ans.questionId === question.questionId)?.isUnsure || false
                                        }
                                        onToggleUnsure={toggleUnsure}
                                        onAnswerChange={(selectedAnswerIdSet) =>
                                            updateAnswer(question.questionId, selectedAnswerIdSet)
                                        }
                                    />
                                </div>
                            ))
                        )}
                        {linkNewPage()}

                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col className="text-end">

                    </Col>
                </Row>
            </Container>
        </>
    );
};
