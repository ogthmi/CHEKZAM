import { signin } from "../../services/authService";
import { useAuth } from "./useAuth";

export function useSignIn() {
    const { handleAuth, error } = useAuth(signin);

    const handleSignIn = async (username, password) => {
        await handleAuth({ username, password });
    };

    return { error, handleSignIn };
}
