"use client";

import {
    Box,
    Flex,
    Heading,
    Text,
    Input,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    useToast,
    Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleNormalLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast({
                title: "Missing fields",
                description: "Please enter both email and password.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false, // prevent auto redirect so we can handle error toast
            callbackUrl: "/dashboard",
        });

        if (result?.error) {
            toast({
                title: "Login failed",
                description: result.error,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            // ✅ redirect manually (after cookies set)
            window.location.href = "/dashboard";
        }

        setIsLoading(false);
    };

    const handleGoogleLogin = async () => {
        await signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bgGradient="linear(to-r, blue.100, purple.100)" p={4}>
            <Box bg="white" p={8} rounded="xl" shadow="xl" w={{ base: "100%", sm: "400px" }}>
                <Heading size="lg" textAlign="center" mb={2}>
                    Welcome Back
                </Heading>
                <Text textAlign="center" color="gray.600" mb={6}>
                    Login to your account
                </Text>

                {/* Normal Login Form */}
                <form onSubmit={handleNormalLogin}>
                    <FormControl mb={4} isInvalid={!email && isLoading}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FormErrorMessage>Email is required</FormErrorMessage>
                    </FormControl>

                    <FormControl mb={6} isInvalid={!password && isLoading}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FormErrorMessage>Password is required</FormErrorMessage>
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        w="full"
                        isLoading={isLoading}
                        loadingText="Logging in..."
                    >
                        Login
                    </Button>
                </form>

                <Divider my={6} />

                {/* Google Login */}
                <Button colorScheme="red" w="full" onClick={handleGoogleLogin}>
                    Sign in with Google
                </Button>

                <Text mt={4} fontSize="sm" textAlign="center">
                    Don’t have an account?{" "}
                    <Button variant="link" colorScheme="blue" size="sm">
                        Sign up
                    </Button>
                </Text>
            </Box>
        </Flex>
    );
}
