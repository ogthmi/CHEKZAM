import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import {createData, updateData} from "../../services/CRUDService";
import {DataActions} from "../../constants/data/ActionMethods";
import {getSuccessMessage} from "../../constants/messages/SuccessMessages";


export const useFormActionButton = (entityType, mode, containerId, itemId) => {
    useEffect(() => {
        console.info('[Use form action button]', {entityType, mode, containerId, itemId});
    }, [entityType, mode, containerId, itemId]);

    const [loading, setLoading] = useState(false);

    const actionMap = {
        [DataActions.CREATE]: createData,
        [DataActions.APPEND]: createData,
        [DataActions.UPDATE]: updateData,
    };

    const handleAction = async (formData) => {
        setLoading(true);
        try {
            const action = actionMap[mode];
            const response = await action(entityType, containerId, itemId, formData);

            if (response) {
                toast.success(getSuccessMessage(entityType, mode));
                setTimeout(() => window.location.reload(), 3000);
            }
        } catch (e) {
            toast.error(e.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return {handleAction, loading};
};
