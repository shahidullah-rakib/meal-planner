"use client";

import { Box, Text, VStack, Switch, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

import React from 'react';

const Settings = () => {
    return (
        <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={6}>
                Settings
            </Text>

            <VStack spacing={6} align="stretch" maxW="400px">
                {/* Profile */}
                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input placeholder="Enter your name" />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" placeholder="Enter new password" />
                </FormControl>

                {/* Budget */}
                <FormControl>
                    <FormLabel>Monthly Budget (৳)</FormLabel>
                    <Input type="number" placeholder="5000" />
                </FormControl>

                {/* Preferences */}
                <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Dark Mode</FormLabel>
                    <Switch />
                </FormControl>

                <Button colorScheme="blue">Save Changes</Button>
            </VStack>
        </Box>
    );
};

export default Settings;
