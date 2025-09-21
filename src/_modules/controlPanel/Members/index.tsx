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
    Avatar,
    Button,
    HStack,
} from "@chakra-ui/react";

const Members = () => {
    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Text fontSize="2xl" fontWeight="bold">
                    Members
                </Text>
                <Button colorScheme="blue">Add Member</Button>
            </HStack>

            {/* Members Table */}
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Member</Th>
                        <Th>Total Contribution</Th>
                        <Th>Last Added</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>
                            <HStack>
                                <Avatar size="sm" name="Rakib" />
                                <Text>Rakib</Text>
                            </HStack>
                        </Td>
                        <Td>৳ 12,000</Td>
                        <Td>2025-09-19</Td>
                        <Td>
                            <Button size="sm" colorScheme="green" mr={2}>
                                Edit
                            </Button>
                            <Button size="sm" colorScheme="red">
                                Delete
                            </Button>
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    );
};

export default Members;