import {Container} from "react-bootstrap";
import React from "react";
import {useLocation, useParams} from "react-router-dom";

export const AssignmentAttachPage = () => {
    const location = useLocation();
    const currentAssignment = location.state?.currentAssignment;
    console.log(currentAssignment)
    return (
        <Container className={"p-2 mt-3"}>
            <h5 className={"my-3"}>Giao bài tập</h5>
        </Container>
    )
}