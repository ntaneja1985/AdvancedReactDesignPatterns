import {useLoaderData, defer, Await} from "react-router-dom";
import delay from "../util/delay";
import { MainContainer, MainHeading } from "./styled-elements";
import {Suspense} from "react";

const Main = () => {
    const { data } = useLoaderData();

    return (
      <MainContainer>
          <MainHeading>
              Main -{" "}
              <Suspense fallback="Fetching...">
                  <Await resolve={data}>{(data) => <strong>{data}</strong>}</Await>
              </Suspense>
          </MainHeading>
      </MainContainer>
  );
};

 function loader() {
  return defer({
    data: delay("Fetched Data", 1000)})
}

export const mainRoute = { element: <Main />, loader };
