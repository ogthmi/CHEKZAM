import {createContext, useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {getData} from "../../../../services/CRUDService";
import {EntityTypes} from "../../../../constants/data/EntityTypes";

export const ClassroomInfoContext = createContext();

export const ClassroomInfoProvider = ({children}) => {
    console.log('[DEBUG] ClassroomInfoProvider rendered');
    const [currentClassroom, setCurrentClassroom] = useState();
    const {classroomId} = useParams();
    useEffect(() => {
        const getClassroomInfo = async () => {
            try {
                const classroomInfo = await getData(EntityTypes.classroom.INFO, null, classroomId);
                setCurrentClassroom(classroomInfo);
            } catch (error) {
                console.error("Error fetching classroom data:", error);
            }
        };

        getClassroomInfo();
    }, [classroomId]);

    useEffect(() => {
    }, [currentClassroom]);
    return (
        <ClassroomInfoContext.Provider value={[currentClassroom, setCurrentClassroom]}>
            {children}
        </ClassroomInfoContext.Provider>
    )
}