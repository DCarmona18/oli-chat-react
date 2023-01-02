import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";

const AppRoutes = [
  {
    element: <Login />,
    index: true,
    path: '/'
  },
  {
    element: <Login />,
    path: '/login'
  },
  {
    element: <Home />,
    path: '/home'
  }
];

export default AppRoutes;