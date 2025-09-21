"use client";

import {
    Box,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Input,
    HStack,
} from "@chakra-ui/react";

const Expenses = () => {
    return (
        <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={6}>
                Expenses
            </Text>

            {/* Add Expense Form */}
            <HStack spacing={4} mb={6}>
                <Input placeholder="Description" />
                <Input placeholder="Cost" type="number" />
                <Button colorScheme="blue">Add</Button>
            </HStack>

            {/* Expenses Table */}
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Date</Th>
                        <Th>Meal</Th>
                        <Th>Description</Th>
                        <Th isNumeric>Cost</Th>
                        <Th>Added By</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>2025-09-20</Td>
                        <Td>Lunch</Td>
                        <Td>Rice, Fish Curry</Td>
                        <Td isNumeric>৳ 250</Td>
                        <Td>Rakib</Td>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    );
};

export default Expenses;