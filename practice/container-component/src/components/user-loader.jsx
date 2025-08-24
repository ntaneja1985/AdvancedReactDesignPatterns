import React,{useState,useEffect} from 'react'
import axios from "axios";

function UserLoader({userId, children}) {
    const [user,setUser] = useState(null);

    useEffect(() => {
        (async () => {
            console.log("fetching")

            const response = await axios.get(`/users/${userId}`);
            console.log(response)

            setUser(response.data);
        })();
    }, [userId]);
    return (
        <>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { user });
                }
                return child;
            })}
        </>
    )
}

export default UserLoader
