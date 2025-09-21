"use client";

import React, { ReactNode } from "react";
import { Layout } from "@/components/layout/Layout";

type MainLayoutProps = {
    children?: ReactNode;
};

const ControlPanelProvider: React.FC<MainLayoutProps> = ({ children }) => {
    return <Layout>{children}</Layout>;
};

export default ControlPanelProvider;
