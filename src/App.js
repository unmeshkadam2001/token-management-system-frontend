import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './component/HomePage';
import MLogin from './component/MLogin';
import CELogin from './component/CELogin';
import TokenGeneration from './component/TokenGeneration';
import ManagerHomePage from './component/ManagerHomePage';
import AddServices from './component/AddServices';
import AssignCounter from './component/AssignCounter';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/ManagerHomePage', element: <ManagerHomePage /> },
  { path: '/addServices', element: <AddServices /> },
  { path: '/assignCounter', element: <AssignCounter /> },
  { path: '/CELogin', element: <CELogin /> },
  { path: '/MLogin', element: <MLogin /> },
  { path: '/tokenGeneration', element: <TokenGeneration /> },

])

function App() {
  return (
    <div>
      <RouterProvider router={router} />
      {/* <AssignCounter></AssignCounter>
      <AddServices></AddServices>
      <ManagerHomePage></ManagerHomePage>
      <TokenGeneration></TokenGeneration>
      <CELogin></CELogin>
      <HomePage></HomePage>
      <MLogin></MLogin> */}
    </div>
  );
}

export default App;
