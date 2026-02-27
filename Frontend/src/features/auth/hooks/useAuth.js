import { useContext } from "react";
import { AuthContext } from "../auth.store";

export function useAuth() {
    const context=useContext(AuthContext)
    return context
}
