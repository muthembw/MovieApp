import { createContext, useState, useEffect } from 'react';

// Create context for auth
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // State variables to manage user data and token
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // On load: Retrieve user and token from localStorage
    useEffect(() => {
        const userInfo = localStorage.getItem("user");
        const userToken = localStorage.getItem("token"); // Get token from localStorage
        
        if (userInfo && userToken) {
            const parsedUser = JSON.parse(userInfo);
            setUser({ name: parsedUser.name, email: parsedUser.email, _id: parsedUser._id }); // Set user data correctly
            setToken(userToken); // Set token
        }
    }, []); 

    // Whenever user changes, update localStorage with the updated user info
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user)); // Save user data
            if (token) localStorage.setItem('token', token); // Save token if it's available
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token'); // Remove token if user logs out
        }
    }, [user, token]); 
    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};
