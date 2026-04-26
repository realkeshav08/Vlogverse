import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import useAuth from "../../auth/useAuth";

const Layout = () => {
    const { auth } = useAuth();

    return (
        <div className="flex min-h-screen bg-[#0a0a0c] text-white font-outfit relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]"></div>
            </div>

            {auth?.accessToken && (
                <div className="hidden lg:block lg:w-72 flex-shrink-0 z-50">
                    <NavBar avatar={auth?.avatar} username={auth?.username} notifications={auth?.notifications} />
                </div>
            )}
            <div className="flex-1 w-full relative z-10 flex flex-col">
                {auth?.accessToken && (
                    <div className="lg:hidden z-50">
                        <NavBar avatar={auth?.avatar} username={auth?.username} notifications={auth?.notifications} />
                    </div>
                )}
                <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
