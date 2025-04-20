import {Button} from "react-bootstrap";
import {SearchModal} from "../modal/SearchModal";
import {useModal} from "../../hooks/data/useModal";

export const SearchModalButton = ({
                                      entityType,
                                      content,
                                      variant = "primary",
                                      size = "",
                                      className = "",
                                      mode,
                                      containerId = null,
                                      itemId = null,
                                      initialData = {}
                                  }) => {
    const {isModalOpen, openModal, closeModal} = useModal();
    return (<>
        <Button variant={variant} size={size} className={className} onClick={openModal}>{content}</Button>
        {isModalOpen && (
            <SearchModal
                entityType={entityType}
                content={content}
                onClose={closeModal}
                mode={mode}
                containerId={containerId}
                itemId={itemId}
                initialData={initialData}
            />
        )}
    </>);
};
