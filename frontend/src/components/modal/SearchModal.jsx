import {Button, Form, Modal} from "react-bootstrap";
import {SearchInput} from "../common/SearchInput";
import {ApiLinks} from "../../constants/links/ApiLinks";
import {EntityTypes} from "../../constants/data/EntityTypes";
import {useState} from "react";
import {toast} from "react-toastify";
import {CustomTable} from "../common/CustomTable";
import {createData, getData} from "../../services/CRUDService";

const dataFields = () => ({
    "Họ đêm": "lastName",
    "Tên": "firstName",
    "Trường": "school",
    "Khoa/Lớp": "department",
    "Email": "email"
});

export const SearchModal = ({
                                entityType, content, onClose, mode, containerId
                            }) => {
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const handleSearch = async (keyword) => {
        const trimmedKeyword = keyword.trim();
        if (!trimmedKeyword) return;
        setLoading(true);
        const API = ApiLinks.user.search(trimmedKeyword);
        console.info("[Call API]", API)
        const data = await getData(EntityTypes.user.SEARCH, null, trimmedKeyword);

        if (data) setSearchResults(prev => {
            const exists = prev.some(sv => sv.userId === data.userId);
            if (exists) return prev;
            return [...prev, data];
        });
        else {
            toast.error("Có lỗi xảy ra.");
        }
        setLoading(false);
    }
    const handleSubmit = async () => {
        setLoading(true);
        let studentIdList = [];
        for (const student of searchResults) {
            studentIdList.push(student.userId);
        }
        if (studentIdList.length > 0) {
            const message = await createData(entityType, containerId,  null,{studentIdList});
            if (message) {
                toast.success("Thao tác thành công.");
                setTimeout(() => {
                    setLoading(false);
                    window.location.reload();
                }, 3000);
            }
            else toast.error(message);
            setLoading(false);
        }
        else {
            toast.error("Danh sách sinh viên trống.")
            setLoading(false);
        }
    }
    return (<Modal size={"xl"} show={true} onHide={onClose} centered backdrop="static">
        <div onClick={(event) => event.stopPropagation()}>
            <Modal.Header closeButton>
                <Modal.Title>{content}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label>Tìm kiếm sinh viên:</Form.Label>
                    <SearchInput
                        placeholder={"Nhập username hoặc email"}
                        onSearch={handleSearch}
                    />
                </Form>
                <p className={"fw-bold mt-3"}>Danh sách sinh viên muốn thêm vào lớp:</p>
                <CustomTable
                    headers={Object.keys(dataFields())}
                    fields={Object.values(dataFields())}
                    data={searchResults}
                    renderActions={(row) => <Button
                        disabled={loading}
                        size={"sm"}
                        variant={"danger"}
                        onClick={() => {
                            setSearchResults(prev =>
                                prev.filter(item => item.userId !== row.userId)
                            );
                        }}
                    >
                        Xóa
                    </Button>}
                    leftAlignedColumns={[0, 1, 2, 3, 4]}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={onClose}>Hủy</Button>
                <Button disabled={loading} onClick={handleSubmit}>
                    {loading ? "Đang xử lý..." : "Tiếp tục"}
                </Button>
            </Modal.Footer>
        </div>
    </Modal>);
};
