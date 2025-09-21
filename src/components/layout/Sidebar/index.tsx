"use client";

import {
    Box,
    Flex,
    Icon,
    Link,
    Text,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    FiHome,
    FiCalendar,
    FiDollarSign,
    FiPieChart,
    FiUsers,
    FiSettings,
} from "react-icons/fi";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";


interface NavItemProps {
    icon: IconType;
    label: string;
    href: string;
}

const navItems: NavItemProps[] = [
    { icon: FiHome, label: "Dashboard", href: "/dashboard" },
    { icon: FiCalendar, label: "Meal Plans", href: "/meal-plan" },
    { icon: FiDollarSign, label: "Expenses", href: "/expenses" },
    { icon: FiPieChart, label: "Reports", href: "/reports" },
    { icon: FiUsers, label: "Members", href: "/members" },
    { icon: FiSettings, label: "Settings", href: "/settings" },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const bgActive = useColorModeValue("blue.500", "blue.400");
    const colorActive = useColorModeValue("white", "white");

    return (
        <Box
            bg={useColorModeValue("gray.100", "gray.900")}
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
            p="5"
            borderRight="1px"
            borderColor="gray.200"
            display={{ base: "none", md: "block" }}
        >
            {/* Logo / App Name */}
            <Text fontSize="2xl" fontWeight="bold" mb="10" textAlign="center">
                Meal Planner
            </Text>

            {/* Nav Items */}
            <VStack align="stretch" spacing={2}>
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            as={NextLink}
                            key={item.label}
                            href={item.href}
                            _hover={{ textDecoration: "none" }}
                        >
                            <Flex
                                align="center"
                                p="3"
                                mx="3"
                                borderRadius="lg"
                                role="group"
                                cursor="pointer"
                                bg={isActive ? bgActive : "transparent"}
                                color={isActive ? colorActive : "inherit"}
                                _hover={{ bg: "blue.400", color: "white" }}
                            >
                                <Icon mr="3" fontSize="18" as={item.icon} />
                                <Text fontSize="md">{item.label}</Text>
                            </Flex>
                        </Link>
                    );
                })}
            </VStack>
        </Box>
    );
};
