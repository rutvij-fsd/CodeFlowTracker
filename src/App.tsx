import Home from "./component/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserContextProvider from "./contexts/userContexts";
import NodeGraph from "./component/NodeGraphData";

function App() {
  return (
    <>
      <Router>
        <UserContextProvider>
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="/results" element={<NodeGraph />} />
          </Routes>
        </UserContextProvider>
      </Router>
    </>
  );
}

export default App;
