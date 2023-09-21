import Home from "./component/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserContextProvider from "./contexts/userContexts";
import NodeGraph from "./component/NodeGraphData";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <UserContextProvider>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
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
