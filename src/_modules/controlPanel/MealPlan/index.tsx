"use client";

import {
    Box,
    Button,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    Input,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Stat,
    StatLabel,
    StatNumber,
    SimpleGrid,
    Badge,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from "@chakra-ui/react";
import { useState } from "react";

const MealPlans = () => {
    // state for regular meal
    const [regularMeals, setRegularMeals] = useState(3);

    return (
        <Box className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Set Today’s Meal */}
            <Card>
                <CardBody>
                    <h2 className="text-xl font-bold mb-4">Set Today’s Meal</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <FormControl>
                            <FormLabel>Date</FormLabel>
                            <Input
                                type="date"
                                defaultValue={new Date().toISOString().split("T")[0]}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Meal Type</FormLabel>
                            <Select placeholder="Select meal">
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Number of Meals</FormLabel>
                            <Select placeholder="Select number">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                            </Select>
                        </FormControl>
                    </div>
                    <Button colorScheme="blue" className="mt-4">
                        Save Meal
                    </Button>
                </CardBody>
            </Card>

            {/* Set Regular Meal */}
            <Card>
                <CardBody>
                    <h2 className="text-xl font-bold mb-4">Set Regular Daily Meal</h2>
                    <Box className="grid grid-cols-2 gap-4">
                        <FormControl>
                            <FormLabel>Meals per Day</FormLabel>
                            <NumberInput
                                min={1}
                                max={6}
                                value={regularMeals}
                                onChange={(valueString, valueNumber) =>
                                    setRegularMeals(valueNumber)
                                }
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <Box className="flex items-end">
                            <Button colorScheme="green">Save Regular Meal</Button>
                        </Box>
                    </Box>
                    <p className="mt-4 text-gray-600">
                        You have set <b>{regularMeals}</b> meals per day as your regular
                        plan.
                    </p>
                </CardBody>
            </Card>

            {/* Monthly Summary */}
            <Card>
                <CardBody>
                    <h2 className="text-xl font-bold mb-4">Monthly Summary</h2>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        <Stat>
                            <StatLabel>Total Meals Planned</StatLabel>
                            <StatNumber>42</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Total Meals Consumed</StatLabel>
                            <StatNumber>36</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Remaining Meals</StatLabel>
                            <StatNumber>6</StatNumber>
                        </Stat>
                    </SimpleGrid>
                </CardBody>
            </Card>

            {/* Meal History */}
            <Card>
                <CardBody>
                    <h2 className="text-xl font-bold mb-4">Meal History</h2>
                    <Tabs>
                        <TabList>
                            <Tab>Planned Meals</Tab>
                            <Tab>Consumed Meals</Tab>
                        </TabList>
                        <TabPanels>
                            {/* Planned */}
                            <TabPanel>
                                <Table variant="striped">
                                    <Thead>
                                        <Tr>
                                            <Th>Date</Th>
                                            <Th>Meal</Th>
                                            <Th>Qty</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>20-09-2025</Td>
                                            <Td>Lunch</Td>
                                            <Td>1</Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TabPanel>
                            {/* Consumed */}
                            <TabPanel>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Date</Th>
                                            <Th>Meal</Th>
                                            <Th>Qty</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>19-09-2025</Td>
                                            <Td>Dinner</Td>
                                            <Td>1</Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </CardBody>
            </Card>

            {/* Weekly Menu */}
            <Card>
                <CardBody>
                    <h2 className="text-xl font-bold mb-4">Weekly Menu</h2>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Day</Th>
                                <Th>Menu</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>
                                    Sunday <Badge colorScheme="green">Today</Badge>
                                </Td>
                                <Td>Rice, Chicken Curry, Vegetables, Dal, Salad</Td>
                            </Tr>
                            <Tr>
                                <Td>Monday</Td>
                                <Td>Polao, Beef Curry, Mixed Vegetables, Sweet</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </CardBody>
            </Card>
        </Box>
    );
};

export default MealPlans;
