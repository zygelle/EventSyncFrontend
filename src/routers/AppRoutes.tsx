import {isAuthenticated} from "../services/authentication.tsx";
import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router-dom";
import {
    pathCreateEvents,
    pathHome,
    pathLogin,
    pathRegister,
    pathViewEvent,
    pathEditEvents,
    pathCheckIn,
    pathEvents,
} from "./Paths.tsx";
import {Login} from "../pages/login/Login.tsx";
import Navbar from "../components/Navbar.tsx";
import ErrorPage from "../pages/error/ErrorPage.tsx";
import { Register } from "../pages/cadastro/Register.tsx";
import { CreateEvent } from "../pages/evento/CreateEvent.tsx";
import ViewEvent from "../pages/evento/ViewEvent.tsx";
import EventList from "../pages/evento/EventList.tsx";
import EventListNoAuth from "../pages/evento/EventListNoAuth.tsx";
import { EditEvent } from "../pages/evento/EditEvent.tsx";
import CheckIn from "../pages/evento/CheckIn.tsx";

const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to={pathLogin} />;
}

const Layout = () => (
    <>
        <Navbar/>
        <Outlet/>
    </>
)

const router = createBrowserRouter([
    {
        path: pathLogin,
        element: <Login/>,
        errorElement: <ErrorPage />
    },
    {
        element: <Layout />,
        children:[
            {
                path: pathRegister,
                element: <Register />,
                errorElement: <ErrorPage />
            },
            {
                path: pathEvents,
                element: <EventListNoAuth />
            },
            {
                path: pathViewEvent,
                element: <ViewEvent />
            }
        ]
    },
    {
        element: <ProtectedRoute/>,
        errorElement: <Layout />,
        children: [{
            element: <Layout/>,
            children:[
                {
                    path: pathHome,
                    element: <EventList />
                },
                {
                    path: pathCreateEvents,
                    element: <CreateEvent />
                },
                {
                    path: pathCheckIn,
                    element: <CheckIn />
                },
                {
                    path: pathEditEvents,
                    element: <EditEvent />
                },
                {
                    path: "*",
                    element: <ErrorPage />,
                }
            ]
        }]
    }
])

function AppRoutes() {
    return <RouterProvider router={router}/>
}

export default AppRoutes;