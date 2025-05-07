import {createContext, useState, useEffect} from "react";
import {useLocation, useParams} from "react-router-dom";
import {getData} from "../../../../services/CRUDService";
import {EntityTypes} from "../../../../constants/data/EntityTypes";

export const AssignmentInfoContext = createContext();

export const AssignmentInfoProvider = ({children}) => {
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const {assignmentId} = useParams();
    useEffect(() => {
        const getAssignmentInfo = async () => {
            try {
                const assignmentInfo = await getData(EntityTypes.assignment.INFO, null, assignmentId);
                setCurrentAssignment(assignmentInfo);
            } catch (error) {
                console.error("Error fetching assignemnt details:", error);
            }
        };

        getAssignmentInfo().then(r =>{} );
    }, [assignmentId]);

    useEffect(() => {
    }, [currentAssignment]);


    return (
        <AssignmentInfoContext.Provider value={[currentAssignment, setCurrentAssignment]}>
            {children}
        </AssignmentInfoContext.Provider>
    )
}