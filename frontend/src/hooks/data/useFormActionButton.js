import { useState } from "react";
import { createData, updateData } from "../../services/crudService";
import { DATA_ACTIONS } from "../../constants/data";

export const useFormActionButton = (formType, mode, containerId = null, itemId = null, onSuccess) => {
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAction = async (formData) => {
        setLoading(true);
        try {
            let response;
            if (mode === DATA_ACTIONS.create) {
                response = await createData(formType, containerId, itemId, formData);
            } else if (mode === DATA_ACTIONS.update) {
                response = await updateData(formType, containerId, itemId, formData);
            }

            if (response) {
                setMessage("Thao tác thành công");
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


    return { handleAction, message, error, loading };
};
