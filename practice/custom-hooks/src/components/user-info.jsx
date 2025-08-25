import {useCurrentUserHook} from "./user-hook";
import {useResource} from "./resource.hook";
import axios from "axios";
import {useDataSource} from "./data-source.hook";

export const UserInfo = ({userId}) => {
  // const user = useResource("/users/3");
    const fetchFromServer = async (resourceUrl) => {
        const response = await axios.get(resourceUrl);
        return response.data;
    };
    const user = useDataSource(() => fetchFromServer(`/users/${userId}`));
  const { name, age, country, books } = user || {};
  return user ? (
    <>
      <h2>{name}</h2>
      <p>Age: {age} years</p>
      <p>Country: {country}</p>
      <h2>Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book}> {book} </li>
        ))}
      </ul>
    </>
  ) : (
    <h1>Loading...</h1>
  );
};
