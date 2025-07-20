import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";

const server_url = import.meta.env.VITE_DOCCURES_SERVER_URL;

export default function useUsers() {

    let [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [error, setError] = useState(null);

    let fetchUsers = async () => {
        setIsLoadingUsers(true);
        const response = await fetch(`${server_url}/user/allUsers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
            if (!data.usersFound) {
                console.error(data.message);

            }
        }
        setUsers(data.users);
        setIsLoadingUsers(false);
        return data.users;
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, isLoadingUsers, error };
}
