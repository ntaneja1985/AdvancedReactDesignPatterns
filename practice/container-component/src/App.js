//import CurrentUserLoader from "./components/current-user-loader";
import {UserInfo} from "./components/user-info";
import UserLoader from "./components/user-loader";
import {ResourceLoader} from "./components/resource-loader";
import {BookInfo} from "./components/book-info";
import {DataSource} from "./components/DataSource";
import axios from "axios";

function App() {
    // Separate data fetching logic
    const getDataFromServer = async (url) => {
        const response = await axios.get(url);
        return response.data;
    };

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
            getData={async () => await getDataFromServer('/users/2')}
            resourceName="user"
        >
            <UserInfo />
        </DataSource>
    </>
  );
}

export default App;
