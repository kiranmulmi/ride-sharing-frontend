import { AppLayout } from "./components/Theme";
import { HistoryPage, ProfilePage, SettingPage } from "./pages/Account";
import { LoginPage, Logout, SignupPage } from "./pages/Auth";
import { City } from "./pages/City";
import ErrorPage from "./pages/ErrorPage";
import NotFound404 from "./pages/NotFound404";
import { RideRequestPage } from "./pages/Rider";
import ProtectedRoute from "./ProtectedRoute";

export const routesConfig = [
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/signup",
        element: <SignupPage />,
    },
    {
        element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
        children: [
            {
                path: "/",
                element: <City />,
            },
            {
                path: "/rideRequest",
                element: <RideRequestPage />,
            },
            {
                path: "/history",
                element: <HistoryPage />,
            },
            {
                path: "/setting",
                element: <SettingPage />,
            },
            {
                path: "/user/profile",
                element: <ProfilePage />,
            },
            {
                path: "/user/logout",
                element: <Logout />,
            },
        ],
    },
    {
        path: "/serverError",
        element: <ErrorPage/>,
    },
    {
        path: "*",
        element: <NotFound404/>,
    },
];