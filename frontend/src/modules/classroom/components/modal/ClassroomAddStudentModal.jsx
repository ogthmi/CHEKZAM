import {Button, Form, Modal} from "react-bootstrap";
import {useState} from "react";
import {toast} from "react-toastify";
import {CommonSearchInput} from "../../../../ui/components/list-page/CommonSearchInput";
import {CommonTable} from "../../../../ui/components/list-page/CommonTable";
import {createData, getData} from "../../../../services/CRUDService";
import {EntityTypes} from "../../../../constants/data/EntityTypes";
import {ResponseDataFields} from "../../../../constants/data/ResponseDataFields";

const dataFields = ResponseDataFields.UserInfo(false);

export const ClassroomAddStudentModal = ({onClose, containerId}) => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);

    const handleSearch = async (keyword) => {
        const trimmed = keyword.trim();
        if (!trimmed) return;

        setLoading(true);
        const data = await getData(EntityTypes.user.SEARCH, null, trimmed);

        if (data) {
            setStudents(prev => prev.some(sv => sv.userId === data.userId) ? prev : [...prev, data]);
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!students.length) return toast.error("Danh sách sinh viên trống.");
        setLoading(true);

        const studentIdList = students.map(s => s.userId);
        const success = await createData(EntityTypes.classroom.ADD_STUDENT, containerId, null, {studentIdList});

        if (success) {
            toast.success("Thêm sinh viên thành công.");
            setTimeout(() => window.location.reload(), 3000);
        } else {
            toast.error("Đã xảy ra lỗi.");
        }
        setLoading(false);
    };

    return (
        <Modal size="xl" show onHide={onClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Thêm sinh viên vào lớp</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label>Tìm kiếm sinh viên:</Form.Label>
                    <CommonSearchInput
                        placeholder="Nhập username hoặc email"
                        onSearch={handleSearch}
                    />
                </Form>

                <p className="fw-bold mt-3">Danh sách sinh viên muốn thêm vào lớp:</p>
                <CommonTable
                    headers={Object.values(dataFields).map((field) => field.label)}
                    fields={Object.values(dataFields).map((field) => field.value)}
                    data={students}
                    leftAlignedColumns={[0, 1, 2, 3, 4]}
                    renderActions={(row) => (
                        <Button
                            size="sm"
                            variant="danger"
                            disabled={loading}
                            onClick={() => setStudents(students.filter(s => s.userId !== row.userId))}
                        >
                            Xóa
                        </Button>
                    )}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={onClose}>Hủy</Button>
                <Button disabled={loading} onClick={handleSubmit}>
                    {loading ? "Đang xử lý..." : "Tiếp tục"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
