import { useState } from "react";
import { deleteData } from "../../services/crudService";

export const useDeleteButton = (formType, idItemToDelete, onSuccess) => {
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await deleteData(formType, idItemToDelete);
            if (response) {
                setMessage("Xóa thành công");
                
                setTimeout(() => {
                    if (onSuccess) {
                        onSuccess(); 
                    }
                    setTimeout(() => {
                        window.location.reload(); 
                    }, 200);
                }, 500); 
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return { handleDelete, message, error, loading };
};
