"use client";

import {
    Flex,
    IconButton,
    Text,
    Avatar,
    HStack,
    useDisclosure,
    Drawer,
    DrawerContent,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Button,
    Box,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Sidebar } from "../Sidebar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const Header = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Remove token first
            localStorage.removeItem("token");
            // Then sign out with redirect
            await signOut({
                callbackUrl: "/login",
                redirect: true
            });
        } catch (error) {
            console.error("Logout error:", error);
            // Fallback: redirect manually if signOut fails
            router.push("/login");
        }
    };

    const handleProfileClick = () => {
        router.push("/profile");
    };

    const handleSettingsClick = () => {
        router.push("/settings");
    };

    return (
        <>
            {/* Header */}
            <Flex
                px="4"
                height="14"
                alignItems="center"
                bg="white"
                borderBottomWidth="1px"
                borderBottomColor="gray.200"
                justifyContent="space-between"
                position="sticky"
                top={0}
                zIndex={1000}
            >
                {/* Mobile Menu Button */}
                <IconButton
                    display={{ base: "flex", md: "none" }}
                    onClick={onOpen}
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FiMenu />}
                />

                <Text fontSize="lg" fontWeight="bold">
                    Control Panel
                </Text>

                {/* Profile Menu */}
                <HStack spacing="3">
                    <Menu>
                        <MenuButton
                            as={Button}
                            variant="ghost"
                            size="sm"
                            rightIcon={<ChevronDownIcon />}
                            _hover={{ bg: "gray.100" }}
                            _active={{ bg: "gray.200" }}
                        >
                            <HStack spacing="2">
                                <Avatar size="sm" name="John Doe" />
                                <Box display={{ base: "none", md: "block" }}>
                                    <Text fontSize="sm">John Doe</Text>
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            zIndex={1500}
                            minW="160px"
                            boxShadow="lg"
                            border="1px solid"
                            borderColor="gray.200"
                        >
                            <MenuItem
                                onClick={handleProfileClick}
                                _hover={{ bg: "gray.50" }}
                                _focus={{ bg: "gray.50" }}
                            >
                                My Profile
                            </MenuItem>
                            <MenuItem
                                onClick={handleSettingsClick}
                                _hover={{ bg: "gray.50" }}
                                _focus={{ bg: "gray.50" }}
                            >
                                Settings
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem
                                color="red.500"
                                onClick={handleLogout}
                                _hover={{ bg: "red.50" }}
                                _focus={{ bg: "red.50" }}
                            >
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>

            {/* Mobile Drawer Sidebar */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerContent>
                    <Sidebar />
                </DrawerContent>
            </Drawer>

            <Box p={4} bg="yellow.50" borderLeft="4px" borderColor="yellow.400">
                <Text fontSize="sm" color="yellow.800">
                    🔧 <strong>Debug:</strong> If this dropdown works, your Chakra setup is fine.
                    If not, check the setup guide above.
                </Text>
            </Box>
        </>
    );
};