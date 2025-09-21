"use client";

import { Box, Text, SimpleGrid, Stat, StatLabel, StatNumber } from "@chakra-ui/react";

import React from 'react';

const Reports = () => {
    return (
        <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={6}>
                Reports
            </Text>

            {/* Stats Section */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
                <Stat p={4} borderWidth="1px" borderRadius="lg">
                    <StatLabel>Highest Spender</StatLabel>
                    <StatNumber>Rakib (৳ 12,000)</StatNumber>
                </Stat>
                <Stat p={4} borderWidth="1px" borderRadius="lg">
                    <StatLabel>Lowest Spender</StatLabel>
                    <StatNumber>Ashik (৳ 3,500)</StatNumber>
                </Stat>
                <Stat p={4} borderWidth="1px" borderRadius="lg">
                    <StatLabel>Avg Daily Cost</StatLabel>
                    <StatNumber>৳ 400</StatNumber>
                </Stat>
            </SimpleGrid>

            {/* Charts Placeholder */}
            <Box>
                <Text fontSize="lg" fontWeight="semibold">
                    Charts (Cost Trends, Pie, etc.)
                </Text>
            </Box>
        </Box>
    );
};

export default Reports;
