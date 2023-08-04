import React from "react";
import { AuthStatus } from "./authStatus";
import { Outlet } from "react-router-dom";
import { Footer } from "./footer";

export function Layout(props) {

    return (
        <div className="bodyRow">
            <AuthStatus token={props.token} theme={props.theme} setTheme={props.setTheme} />
            <Outlet />
            <Footer />
        </div>
    );
}