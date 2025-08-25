import { checkProps } from "./components/check-props";
import { UserInfo } from "./components/user-info";
import {includeUser} from "./components/include-user";
import {UserInfoForm} from "./components/user-form";

// const UserInfoWrapper = checkProps(UserInfo);

const UserInfoWithLoader = includeUser(UserInfo,"3");

function App() {
  return (
    <>
      {/*<UserInfoWrapper propA="test1" blabla={{ a: 1, age: 23 }} />*/}
      {/*  <UserInfoWithLoader/>*/}
        <UserInfoForm/>
    </>
  );
}

export default App;
