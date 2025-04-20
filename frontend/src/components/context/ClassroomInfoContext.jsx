import {createContext, useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {getData} from "../../services/CRUDService";
import {EntityTypes} from "../../constants/data/EntityTypes";

export const ClassroomInfoContext = createContext();

export const ClassroomInfoProvider = ({children}) => {
    const [currentClassroom, setCurrentClassroom] = useState();
    const location = useLocation();

    useEffect(() => {
        const classroomIdPosition = 3;
        const classroomId = location.pathname.split("/")[classroomIdPosition];
        const getClassroomInfo = async () => {
            try {
                const classroomInfo = await getData(EntityTypes.classroom.INFO, null, classroomId);
                setCurrentClassroom(classroomInfo);
            } catch (error) {
                console.error("Error fetching classroom data:", error);
            }
        };

        getClassroomInfo();
    }, [location.pathname]);

    useEffect(() => {
    }, [currentClassroom]);


    return (
        <ClassroomInfoContext.Provider value={[currentClassroom, setCurrentClassroom]}>
            {children}
        </ClassroomInfoContext.Provider>
    )
}