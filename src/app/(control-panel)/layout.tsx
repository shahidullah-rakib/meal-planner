import React from "react";
import ControlPanelProvider from "../provider/controlPanelProvider";

interface LayoutProps {
    children: React.ReactNode;
}

const ControlPanelLayout: React.FC<LayoutProps> = ({ children }) => {
    return <ControlPanelProvider>{children}</ControlPanelProvider>;
};

export default ControlPanelLayout;
