import {Button, Form, Modal} from "react-bootstrap";
import {useState} from "react";
import {toast} from "react-toastify";
import {CommonSearchInput} from "../../../../ui/components/list-page/CommonSearchInput";
import {createData} from "../../../../services/CRUDService";
import {EntityTypes} from "../../../../constants/data/EntityTypes";
import {CommonPagination, CommonTable} from "../../../../ui/components/CommonComponent";
import {
    formatAssignmentType,
    formatDateTimeToRequest
} from "../../../assignment/util/AssignmentDataFormatter";
import {AssignmentFieldBuilder} from "../../../assignment/util/AssignmentDataFields";
import {usePaginatedTable} from "../../../../ui/hooks/pagination/usePaginatedTable";

export const ClassroomAddAssignmentModal = ({onClose, containerId}) => {
    const [step, setStep] = useState(1);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const dataFields = AssignmentFieldBuilder.getGeneralInfoFields(true);

    const sortFieldKeys = {
        name: dataFields.assignmentName.value,
        id: dataFields.assignmentId.value,
        createdAt: dataFields.createdAt.value,
    };

    const {
        queryParams,
        updateQueryParams,
        objectData,
        totalPages,
        totalElements
    } = usePaginatedTable({
        entityType: EntityTypes.assignment.INFO,
        containerId: null,
        defaultSortBy: dataFields.assignmentName.value,
        sortFieldKeys,
    });

    const formattedData = objectData.map(row => ({
        ...row,
        assignmentType: formatAssignmentType(row.assignmentType),
    }));

    const handleSelectItem = (item) => {
        setSelectedItems(prev => {
            const exists = prev.some(selected => selected.assignmentId === item.assignmentId);
            if (exists) {
                return prev.filter(i => i.assignmentId !== item.assignmentId);
            } else {
                return [
                    ...prev,
                    {
                        ...item,
                        duration: "",
                        maxAttempts: "",
                        openTime: "",
                        dueTime: "",
                        shuffle: false,
                    }
                ];
            }
        });
    };

    const handleChangeField = (assignmentId, field, value) => {
        setSelectedItems(prev =>
            prev.map(item =>
                item.assignmentId === assignmentId
                    ? {...item, [field]: value}
                    : item
            )
        );
    };

    const handleSubmit = async () => {
        if (!selectedItems.length) return toast.error("Chưa chọn bài tập.");
        setLoading(true);

        const payload = selectedItems.map(item => ({
            assignmentId: item.assignmentId,
            classroomId: containerId,
            duration: item.duration !== "" ? Number(item.duration) : null,
            maxAttempts: item.maxAttempts !== "" ? Number(item.maxAttempts) : null,
            shuffleEnabled: item.shuffle,
            openTime: item.openTime ? formatDateTimeToRequest(item.openTime) : null,
            dueTime: item.dueTime ? formatDateTimeToRequest(item.dueTime) : null,
        }));

        const success = await createData(EntityTypes.classroom.ADD_ASSIGNMENT, null, null, {
            assignmentClassroomRequestList: payload
        });

        if (success) {
            toast.success("Giao bài thành công.");
            setTimeout(() => window.location.reload(), 3000);
        } else {
            toast.error("Đã xảy ra lỗi.");
        }

        setLoading(false);
    };

    const selectedIdSet = new Set(selectedItems.map(item => item.assignmentId));

    return (
        <Modal size="xl" show onHide={onClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Giao bài tập</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 && (
                    <>
                        <Form.Label>Tìm kiếm bài tập:</Form.Label>
                        <CommonSearchInput
                            placeholder="Nhập tên bài tập"
                            onSearch={(keyword) => updateQueryParams({keyword})}
                        />

                        <CommonTable
                            headers={Object.values(dataFields).map(field => field.label)}
                            fields={Object.values(dataFields).map(field => field.value)}
                            data={formattedData}
                            renderActions={(row) => (
                                <Form.Check
                                    id={`checkbox-${row.assignmentId}`}
                                    type="checkbox"
                                    checked={selectedIdSet.has(row.assignmentId)}
                                    onChange={() => handleSelectItem(row)}
                                />
                            )}
                        />

                        <CommonPagination
                            pageNumber={queryParams.pageNumber}
                            totalPages={totalPages}
                            totalElements={totalElements}
                            setPageNumber={(pageNumber) => updateQueryParams({pageNumber})}
                        />
                    </>
                )}

                {step === 2 && (
                    <>
                        {selectedItems.length === 0 && <p>Chưa có bài tập nào được chọn.</p>}
                        {selectedItems.map(item => (
                            <Form key={item.assignmentId} className="mb-4 p-3 border rounded">
                                <h6>{item.assignmentName} ({item.assignmentType})</h6>

                                <Form.Group className="mb-2">
                                    <Form.Label>Thời lượng (phút)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={item.duration ?? ""}
                                        onChange={(e) => handleChangeField(item.assignmentId, "duration", e.target.value)}
                                        min={0}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label>Số lần làm tối đa</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={item.maxAttempts ?? ""}
                                        onChange={(e) => handleChangeField(item.assignmentId, "maxAttempts", e.target.value)}
                                        min={0}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label>Thời gian mở</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={item.openTime ?? ""}
                                        onChange={(e) => handleChangeField(item.assignmentId, "openTime", e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label>Thời gian đóng</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={item.dueTime ?? ""}
                                        onChange={(e) => handleChangeField(item.assignmentId, "dueTime", e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Check
                                    type="checkbox"
                                    label="Đảo đề tự động"
                                    checked={item.shuffle}
                                    onChange={(e) => handleChangeField(item.assignmentId, "shuffle", e.target.checked)}
                                />

                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => handleSelectItem(item)}
                                >
                                    Bỏ chọn bài này
                                </Button>
                            </Form>
                        ))}
                    </>
                )}

                {step === 3 && (
                    <>
                        <h5 className="mb-3">Xác nhận giao bài</h5>
                        <p className="mb-4">Tổng số bài tập: <strong>{selectedItems.length}</strong></p>

                        {selectedItems.map(item => (
                            <div
                                key={item.assignmentId}
                                className="mb-3 p-3 border"
                            >
                                <h6 className="fw-bold mb-2">{item.assignmentName} <small className="text-muted">({item.assignmentType})</small></h6>
                                <div className="mb-2"><strong>Thời lượng:</strong> {item.duration ? `${item.duration} phút` : "Không thiết lập"}</div>
                                <div className="mb-2"><strong>Số lần làm:</strong> {item.maxAttempts ? item.maxAttempts : "Không thiết lập"}</div>
                                <div className="mb-2"><strong>Thời gian mở:</strong> {item.openTime ? formatDateTimeToRequest(item.openTime) : "Không thiết lập"}</div>
                                <div className="mb-2"><strong>Hạn chót:</strong> {item.dueTime ? formatDateTimeToRequest(item.dueTime) : "Không thiết lập"}</div>
                                <div className="mb-2"><strong>Đảo đề:</strong> {item.shuffle ? "Có" : "Không"}</div>
                            </div>
                        ))}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={onClose}>Hủy</Button>
                {step > 1 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Quay lại</Button>}
                {step < 3 && (
                    <Button
                        disabled={step === 1 && selectedItems.length === 0}
                        onClick={() => setStep(step + 1)}
                    >
                        Tiếp
                    </Button>
                )}
                {step === 3 && (
                    <Button variant="primary" disabled={loading} onClick={handleSubmit}>
                        {loading ? "Đang xử lý..." : "Giao bài"}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};
