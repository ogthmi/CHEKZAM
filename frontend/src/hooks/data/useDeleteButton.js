import { useState } from "react";
import { deleteData } from "../../services/CRUDService";
import {toast} from "react-toastify";
import {getSuccessMessage} from "../../constants/messages/SuccessMessages";
import {DataActions} from "../../constants/data/ActionMethods";

export const useDeleteButton = (entityType, containerId, idItemToDelete, onSuccess) => {
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await deleteData(entityType, containerId, idItemToDelete);
            if (response) {
                toast.success(getSuccessMessage(entityType, DataActions.DELETE));
                
                setTimeout(() => {
                    if (onSuccess) {
                        onSuccess(); 
                    }
                    setTimeout(() => {
                        window.location.reload(); 
                    }, 200);
                }, 3000);
            }
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return { handleDelete, message, error, loading };
};
