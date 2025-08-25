import {includeUpdatableResource} from "./include-updateable-resource";

const UserForm = ({ user, onChangeUser, onPostUser, onResetUser }) => {
    const { name, age } = user || {};

    if (!user) {
        return <h3>Loading...</h3>;
    }

    return (
        <form>
            <label>Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => onChangeUser({ name: e.target.value })}
            />

            <label>Age</label>
            <input
                type="text"
                value={age}
                onChange={(e) => onChangeUser({ age: Number(e.target.value) })}
            />

            <button type="button" onClick={onResetUser}>Reset</button>
            <button type="button" onClick={onPostUser}>Save</button>
        </form>
    );
};

// Updated export with generic HOC
export const UserInfoForm = includeUpdatableResource(
    UserForm,
    '/users/2',  // resourceUrl
    'user'       // resourceName
);