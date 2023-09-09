import { Fragment } from "react";

const App = () => {
  console.log(process.env.NODE_ENV)
  console.log(process.env.REACT_APP_API_URL)
  
  return (
    <Fragment>
      <div>hi there</div>
    </Fragment>
  );
};

export default App;
