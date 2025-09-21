// components/Layout/Layout.tsx
"use client";

import { ReactNode } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Sidebar } from "../Sidebar";
import { Header } from "../Header";


interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <Flex>
            {/* Sidebar (Desktop) */}
            <Sidebar />

            {/* Main Content */}
            <Box ml={{ base: 0, md: 60 }} w="full">
                <Header />
                <Box p="6">{children}</Box>
            </Box>
        </Flex>
    );
};
