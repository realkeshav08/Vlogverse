import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import useAuth from "../../auth/useAuth";

const Layout = () => {
    const { auth } = useAuth();

    return (
        <div className="flex min-h-screen">
            {auth?.accessToken && (
                <div className="hidden lg:block lg:w-64 flex-shrink-0">
                    <NavBar avatar={auth?.avatar} username={auth?.username} notifications={auth?.notifications} />
                </div>
            )}
            <div className="flex-1 w-full">
                {auth?.accessToken && (
                    <div className="lg:hidden">
                        <NavBar avatar={auth?.avatar} username={auth?.username} notifications={auth?.notifications} />
                    </div>
                )}
                <div className="max-w-4xl mx-auto p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
