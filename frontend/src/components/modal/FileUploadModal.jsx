import React, {useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import Papa from 'papaparse';
import {toast} from "react-toastify";

export const FileUploadModal = ({modalTitle, show, handleClose, handleData}) => {
        const [file, setFile] = useState(null);

        const handleFileChange = (e) => {
            setFile(e.target.files[0]);
        };

    const handleUpload = () => {
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const emptyQuestionIndexes = []; // Danh sách index câu hỏi bị trống

                const formattedData = results.data.map((row, index) => {
                    // 1. Lấy danh sách key đáp án (A, B, C, D...)
                    const answerKeys = Object.keys(row).filter((key) =>
                        /^[A-Z]$/.test(key.trim())
                    );

                    // 2. Parse đáp án đúng
                    const correctAnswers = row["Đáp án đúng"]
                        .split(/[,;]\s*/)
                        .map(ans => ans.trim().toUpperCase());

                    // 3. Tạo answerList và loại bỏ đáp án trống
                    const answerList = answerKeys
                        .map((key) => ({
                            answerContent: row[key] || "",
                            isCorrect: correctAnswers.includes(key)
                        }))
                        .filter((answer) => answer.answerContent.trim() !== ""); // Loại đáp án trống

                    // 4. Check nội dung câu hỏi
                    if (!row["Nội dung câu hỏi"] || row["Nội dung câu hỏi"].trim() === "") {
                        emptyQuestionIndexes.push(index + 1); // Lưu lại số thứ tự câu hỏi bị trống
                    }

                    return {
                        questionContent: row["Nội dung câu hỏi"] || "",
                        answerList: answerList
                    };
                });

                // 5. Cảnh báo nếu có câu hỏi trống nội dung
                if (emptyQuestionIndexes.length > 0) {
                    toast.warn(`Câu hỏi ${emptyQuestionIndexes.join(', ')} chưa có nội dung!`);
                }

                console.log('Formatted data:', formattedData);
                handleData(formattedData);
                handleClose();
            },
            error: (error) => {
                console.error('Parsing error:', error);
            }
        });
    };



    return (
            <Modal size={"lg"} show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formFile">
                        <Form.Label>Chọn file CSV</Form.Label>
                        <Form.Control type="file" accept=".csv" onChange={handleFileChange}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleUpload} disabled={!file}>
                        Tải lên
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
;
