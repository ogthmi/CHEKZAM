import {createContext, useState, useEffect} from "react";
import {useLocation, useParams} from "react-router-dom";
import {getData} from "../../../../services/CRUDService";
import {EntityTypes} from "../../../../constants/data/EntityTypes";

export const AssignmentInfoContext = createContext();

export const AssignmentInfoProvider = ({isInClassroom = false, children}) => {
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const {assignmentId, classroomId} = useParams();
    useEffect(() => {
        const getAssignmentInfo = async () => {
            try {
                let assignmentInfo;
                if (isInClassroom) assignmentInfo = await getData(EntityTypes.assignment.ATTACHED_INFO, assignmentId, classroomId)
                else assignmentInfo = await getData(EntityTypes.assignment.INFO, null, assignmentId);
                setCurrentAssignment(assignmentInfo);
            } catch (error) {
                console.error("Error fetching assignemnt details:", error);
            }
        };

        getAssignmentInfo().then(r => {
        });
    }, [assignmentId]);

    useEffect(() => {
    }, [currentAssignment]);


    return (
        <AssignmentInfoContext.Provider value={[currentAssignment, setCurrentAssignment]}>
            {children}
        </AssignmentInfoContext.Provider>
    )
}