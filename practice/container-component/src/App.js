//import CurrentUserLoader from "./components/current-user-loader";
import {UserInfo} from "./components/user-info";
import UserLoader from "./components/user-loader";
import {ResourceLoader} from "./components/resource-loader";
import {BookInfo} from "./components/book-info";
import {DataSource} from "./components/DataSource";
import axios from "axios";
import {DatasourceWithRender} from "./components/datasource-with-render";

function App() {
    // Separate data fetching logic
    const getDataFromServer = async (url) => {
        const response = await axios.get(url);
        return response.data;
    };

    const getDataFromLocalStorage = (key) => {
        console.log(key)

        return localStorage.getItem(key);
    };

    const Message = ({ msg }) => {
        console.log(msg)

        return <h2>{msg}</h2>;
    };



    const getData = async () => await getDataFromServer('/users/2')
  return (

    <>
        {/*/!* User data *!/*/}
        {/*<ResourceLoader resourceUrl="/users/2" resourceName="user">*/}
        {/*    <UserInfo />*/}
        {/*</ResourceLoader>*/}

        {/*/!* Book data *!/*/}
        {/*<ResourceLoader resourceUrl="/books/1" resourceName="book">*/}
        {/*    <BookInfo />*/}
        {/*</ResourceLoader>*/}

        <DataSource
            getData={ () =>  getDataFromLocalStorage('test')}
            resourceName="msg"
        >
            <Message />
        </DataSource>
        <DatasourceWithRender
            getData={getData}
            render={(resource) => (
                <UserInfo user={resource} />
            )}
        />
    </>
  );
}

export default App;
