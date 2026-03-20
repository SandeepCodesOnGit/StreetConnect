import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const API_BASE_URL = `/auth`;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await api.get(`${API_BASE_URL}/me`);
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    const signup = async (userData) => {
        setError(null);
        try {
            const response = await api.post( `${API_BASE_URL}/signup`, userData);
            setUser(response.data);
            return {success: true};
        } catch (error) {
            const message = error.response?.data?.message || "Signup failed";
            setError(message);
            return { success: false, message };
        }
    };

    const signin = async (userData) => {
        setError(null);
        try {
            const response = await api.post(`${API_BASE_URL}/signin`, userData);
            setUser(response.data);
            return { success: true, user: response.data };
        } catch (error) {
            const message = error.response?.data?.message || "Invalid credential";
            setError(message);
            return { success: false, message };
        }
    }

    const logout = async () => {
        try {
            await api.post(`${API_BASE_URL}/logout`);
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    }

    return (
        <AuthContext.Provider value={{user, signup, signin, logout, loading, error}}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};