import {useEffect, useState} from "react";
import axios from "axios";

export const includeUpdateableUser = (Component, userId) => {
    return props => {
        const [initialUser, setInitialUser] = useState(null);
        const [user, setUser] = useState(null);

        useEffect(() => {
            (async () => {
                const response = await axios.get(`/users/${userId}`)
                setInitialUser(response.data)
                setUser(response.data)
            })()
        },[])

        const onChangeUser = updates => {
            setUser({...user, ...updates})
        }

        const onPostUser = async () => {
            const response = await axios.post(`/users/${userId}`, {
                user
            })
            setInitialUser(response.data)
            setUser(response.data)
        }

        // Reset to original values
        const onResetUser = () => {
            setUser(initialUser); // Revert to original fetched data
        };

        return <Component {...props}
                          user={user}
                          onChangeUser={onChangeUser}
                          onPostUser = {onPostUser}
                          onResetUser = {onResetUser}
        />
    }
}