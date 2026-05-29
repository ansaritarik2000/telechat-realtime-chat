import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    useEffect(() => {
        document.body.style.zoom = "90%"; // Apply 90% zoom
        return () => {
            document.body.style.zoom = "100%"; // Reset zoom when leaving
        };
    }, []);

    return (
        <>
            <Outlet />
        </>
    );
};

export default MainLayout;
