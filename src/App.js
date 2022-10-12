import './App.css';
import 'antd/dist/antd.min.css';

import { useRoutes } from 'react-router-dom';
import {routesConfig} from './routes';

// import { Route, Routes } from "react-router-dom";
// import UserContextProvider from './context/UserContext';

// import Home from './pages/Home';
// import Profile from './pages/Profile';
// import MyRides from './pages/MyRides';
// import Support from './pages/Support';
// import Login from './pages/Login';
// import ProtectedRoute from './ProtectedRoute';
// import AuthContextProvider from './context/AuthContext';



function App() {
  const routes = useRoutes(routesConfig);

  return routes;
  //return (
    // <AuthContextProvider>
    //   <UserContextProvider>
    //     <Routes>
    //       <Route path="/login" element={<Login />} />
    //       <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    //       <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}>
    //         <Route index element={<MyRides />} />
    //         <Route path="myRides" element={<MyRides />} />
    //         <Route path="support" element={<Support />} />
    //       </Route>
    //     </Routes>
    //   </UserContextProvider>
    // </AuthContextProvider>
  //);
}

export default App;
