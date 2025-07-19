import { createContext, useEffect, useState, useContext } from "react";

const AuthContext = createContext();

export default function AuthProvider({children}) {
    const [user, setUser] = useState(null);

    const [users, setUsers] = useState(() => {
        const storedUsers = localStorage.getItem('users');
        return storedUsers ? JSON.parse(storedUsers) : [{username: 'admin', password: 'admin'}];
    })


    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users))
    }, [users]) //It always sets the data for us whenever user gets updated during any signUp, in a string form in users key in our local storage
    
    const logIn = (username, password) => {
        console.log(users);
        const found = users.find((u) => (u.username === username && u.password === password))
        console.log(found)
        if(found) {
            setUser({username});
            return true;
        }
        return false;
    }

    const signUp = (username, password) => {
        const exists = users.some((u) => u.username === username); //to check whether any user is present or not
        if(exists) return {success: false, message: 'Username already taken'}
        const newUser = {username, password}
        setUsers((prev) => [...prev, newUser])
        setUser({username})
        return {success: true}
    }

    const logOut = () => setUser(null)

    return (
       <AuthContext.Provider value={{user, logIn, signUp, logOut }}>
          {children}
       </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
