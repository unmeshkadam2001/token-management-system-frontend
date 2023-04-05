import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './component/HomePage';
import MLogin from './component/MLogin';
import CELogin from './component/CELogin';
import TokenGeneration from './component/TokenGeneration';
import ManagerHomePage from './component/ManagerHomePage';
import AddServices from './component/AddServices';
import AssignCounter from './component/AssignCounter';
import CounterExecutive from './component/CounterExecutive';
import CatchAll from './component/CatchAll';
import { Slide, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/ManagerHomePage', element: <ManagerHomePage /> },
  { path: '/addServices', element: <AddServices /> },
  { path: '/assignCounter', element: <AssignCounter /> },
  { path: '/CELogin', element: <CELogin /> },
  { path: '/MLogin', element: <MLogin /> },
  { path: '/CounterExecutive', element: <CounterExecutive /> },
  { path: '/tokenGeneration', element: <TokenGeneration /> },
  { path: '/CatchAll', element: <CatchAll /> },
  { path: '/CounterExecutive', element: <CounterExecutive /> },
])

function App() {
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        transition={Slide}
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
