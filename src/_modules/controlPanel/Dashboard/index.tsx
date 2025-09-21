"use client";

import { Box, Text, SimpleGrid, Stat, StatLabel, StatNumber } from "@chakra-ui/react";


const Dashboard = () => {
    return (
        <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={6}>
                Dashboard
            </Text>

            {/* Summary Cards */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
                    <StatLabel>Today’s Meals</StatLabel>
                    <StatNumber>3</StatNumber>
                </Stat>
                <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
                    <StatLabel>Today’s Cost</StatLabel>
                    <StatNumber>৳ 350</StatNumber>
                </Stat>
                <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
                    <StatLabel>Monthly Cost</StatLabel>
                    <StatNumber>৳ 7,500</StatNumber>
                </Stat>
            </SimpleGrid>

            <Box mt={10}>
                <Text fontSize="lg" fontWeight="semibold">
                    Expense Trend (Charts will go here)
                </Text>
            </Box>
        </Box>
    );
};

export default Dashboard;