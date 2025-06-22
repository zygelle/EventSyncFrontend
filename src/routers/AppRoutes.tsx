import {isAuthenticated} from "../services/token.tsx";
import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router-dom";
import {
    pathHome,
    pathLogin,
    pathRegister
} from "./Paths.tsx";
import {Login} from "../pages/login/Login.tsx";
import Navbar from "../components/Navbar.tsx";
import ErrorPage from "../pages/error/ErrorPage.tsx";
import { Register } from "../pages/cadastro/Register.tsx";
import Event from "../pages/evento/Event.tsx";

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
        path: pathRegister,
        element: <Register />,
        errorElement: <ErrorPage />
    },
    {
        element: <ProtectedRoute/>,
        errorElement: <Layout />,
        children: [{
            element: <Layout/>,
            children:[
                {
                    path: pathHome,
                    element: <Event />
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