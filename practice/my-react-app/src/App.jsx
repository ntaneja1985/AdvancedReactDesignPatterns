
import SplitScreen from "./components/split-screen.jsx";
import Regular from "./components/lists/Regular.jsx";
import SmallAuthorListItems from "./components/authors/SmallListItems.jsx";
import LargeAuthorListItems from "./components/authors/LargeListItems.jsx";
import {authors} from "./data/authors.js";
import {books} from "./data/books.js";
import LargeBookListItems from "./components/books/LargeListItems.jsx";
import SmallBookListItems from "./components/books/SmallListItems.jsx";
import Numbered from "./components/lists/Numbered.jsx";
import Modal from "./components/Modal.jsx";

const LeftSideComponent = ({title}) =>{
    return (
        <h2 style={{backgroundColor: 'brown'}}>{title}</h2>
    )
}

const RightSideComponent = ({title}) =>{
    return (
        <h2 style={{backgroundColor: 'crimson'}}>{title}</h2>
    )
}


function App() {
  return (
      <>
    {/*<Regular items={authors} sourceName={"author"} ItemComponent={SmallAuthorListItems} />*/}
    {/*<Numbered items={authors} sourceName={"author"} ItemComponent={LargeAuthorListItems} />*/}
    {/*      <Regular items={books} sourceName={"book"} ItemComponent={SmallBookListItems} />*/}
    {/*      <Numbered items={books} sourceName={"book"} ItemComponent={LargeBookListItems} />*/}
          <Modal>
              <LargeBookListItems book = {books[0]}/>
          </Modal>
      </>
  )
}

export default App


