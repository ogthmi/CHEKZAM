import { signup } from "../../services/AuthService";
import { useAuth } from "./useAuth";
import { useState } from "react";

export function useSignUp() {
    const { handleAuth, error, message } = useAuth(signup);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        fullName: "",
        birthdate: "",
        gender: "",
        role: "",
        school: "",
        department: "",
        email: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "gender" || name === "role" ? value.toUpperCase() : value
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        await handleAuth(formData);
    };

    return { formData, handleChange, handleSignUp, error, message };
}
