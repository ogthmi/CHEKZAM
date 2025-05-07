import React, {useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import Papa from 'papaparse';
import {toast} from "react-toastify";

export const AssignmentUploadModal = ({modalTitle, show, handleClose, handleData}) => {
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
                const requiredHeaders = ["Nội dung câu hỏi", "Đáp án đúng"];
                const fileHeaders = results.meta.fields.map(h => h.trim());

                const missingHeaders = requiredHeaders.filter(h => !fileHeaders.includes(h));

                if (missingHeaders.length > 0) {
                    toast.error(`File CSV thiếu các cột bắt buộc: ${missingHeaders.join(", ")}`);
                    return;
                }

                const emptyQuestionIndexes = [];

                const formattedData = results.data.map((row, index) => {
                    const answerKeys = Object.keys(row).filter((key) =>
                        /^[A-Z]$/.test(key.trim())
                    );

                    const correctAnswers = row["Đáp án đúng"]
                        ? row["Đáp án đúng"].split(/[,;]\s*/).map(ans => ans.trim().toUpperCase())
                        : [];

                    const answerList = answerKeys
                        .map((key) => ({
                            answerContent: row[key] || "",
                            isCorrect: correctAnswers.includes(key)
                        }))
                        .filter((answer) => answer.answerContent.trim() !== "");

                    if (!row["Nội dung câu hỏi"] || row["Nội dung câu hỏi"].trim() === "") {
                        emptyQuestionIndexes.push(index + 1);
                    }

                    return {
                        questionContent: row["Nội dung câu hỏi"] || "",
                        answerList: answerList
                    };
                });

                if (emptyQuestionIndexes.length > 0) {
                    toast.warn(`Câu hỏi ${emptyQuestionIndexes.join(", ")} chưa có nội dung!`);
                }

                console.log('Formatted data:', formattedData);
                handleData(formattedData);
                handleClose();
            },
            error: (error) => {
                console.error('Parsing error:', error);
                toast.error('Lỗi đọc file CSV.');
            }
        });
    };




    return (
            <Modal size={"lg"} show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <a
                            className={"text-muted text-decoration-none pb-4"}
                            href="/file/CHEKZAM-ASSIGNMENT-TEMPLATE.csv"
                            download
                        >
                            Tải file CSV mẫu
                        </a>
                    </div>
                    <Form.Group controlId="formFile">
                        <Form.Label>Chọn file CSV (UTF-8)</Form.Label>
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
