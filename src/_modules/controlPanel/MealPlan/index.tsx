// components/MealPlans.tsx
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
    useToast,
    Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// Types
interface MealPlan {
    id: string;
    userId: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner';
    quantity: number;
    status: 'planned' | 'consumed';
    createdAt: string;
}

interface RegularMealSetting {
    userId: string;
    mealsPerDay: number;
    updatedAt: string;
}

interface WeeklyMenu {
    day: string;
    menu: string;
    isToday?: boolean;
}

interface MonthlySummary {
    totalPlanned: number;
    totalConsumed: number;
    remaining: number;
}

const MealPlans = () => {
    const { data: session, status } = useSession();
    const toast = useToast();

    // State
    const [regularMeals, setRegularMeals] = useState(3);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedMealType, setSelectedMealType] = useState("");
    const [selectedQuantity, setSelectedQuantity] = useState("");
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [monthlySummary, setMonthlySummary] = useState<MonthlySummary>({
        totalPlanned: 0,
        totalConsumed: 0,
        remaining: 0
    });
    const [weeklyMenu] = useState<WeeklyMenu[]>([
        { day: "Sunday", menu: "Rice, Chicken Curry, Vegetables, Dal, Salad", isToday: true },
        { day: "Monday", menu: "Polao, Beef Curry, Mixed Vegetables, Sweet" },
        { day: "Tuesday", menu: "Biriyani, Raita, Borhani" },
        { day: "Wednesday", menu: "Fish Curry, Rice, Vegetables" },
        { day: "Thursday", menu: "Khichuri, Chicken Roast, Pickles" },
        { day: "Friday", menu: "Pasta, Grilled Chicken, Salad" },
        { day: "Saturday", menu: "Traditional Bengali Thali" }
    ]);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // Fetch data on component mount
    useEffect(() => {
        if (session?.user?.id) {
            fetchMealPlans();
            fetchRegularMealSetting();
            fetchMonthlySummary();
        }
    }, [session]);

    // API calls
    const fetchMealPlans = async () => {
        try {
            const response = await fetch('/api/meal-plans');
            if (response.ok) {
                const data = await response.json();
                setMealPlans(data.mealPlans || []);
            }
        } catch (error) {
            console.error('Error fetching meal plans:', error);
        } finally {
            setDataLoading(false);
        }
    };

    const fetchRegularMealSetting = async () => {
        try {
            const response = await fetch('/api/meal-plans/regular');
            if (response.ok) {
                const data = await response.json();
                setRegularMeals(data.mealsPerDay || 3);
            }
        } catch (error) {
            console.error('Error fetching regular meal setting:', error);
        }
    };

    const fetchMonthlySummary = async () => {
        try {
            const response = await fetch('/api/meal-plans/summary');
            if (response.ok) {
                const data = await response.json();
                setMonthlySummary(data);
            }
        } catch (error) {
            console.error('Error fetching monthly summary:', error);
        }
    };

    const saveTodaysMeal = async () => {
        if (!selectedMealType || !selectedQuantity) {
            toast({
                title: "Error",
                description: "Please fill all fields",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/meal-plans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: selectedDate,
                    mealType: selectedMealType,
                    quantity: parseInt(selectedQuantity),
                }),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Meal plan saved successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                // Reset form
                setSelectedMealType("");
                setSelectedQuantity("");

                // Refresh data
                fetchMealPlans();
                fetchMonthlySummary();
            } else {
                throw new Error('Failed to save meal plan');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save meal plan",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const saveRegularMeal = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/meal-plans/regular', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mealsPerDay: regularMeals,
                }),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Regular meal setting saved successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error('Failed to save regular meal setting');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save regular meal setting",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const markAsConsumed = async (mealId: string) => {
        try {
            const response = await fetch(`/api/meal-plans/${mealId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'consumed',
                }),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Meal marked as consumed",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                fetchMealPlans();
                fetchMonthlySummary();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update meal status",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (status === "loading" || dataLoading) {
        return (
            <Box className="flex justify-center items-center h-64">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (!session) {
        return (
            <Box className="text-center p-6">
                <p>Please sign in to access meal plans.</p>
            </Box>
        );
    }

    const plannedMeals = mealPlans.filter(meal => meal.status === 'planned');
    const consumedMeals = mealPlans.filter(meal => meal.status === 'consumed');

    return (
        <Box className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Set Today's Meal */}
            <Card>
                <CardBody>
                    <h2 className="text-xl font-bold mb-4">Set Todays Meal</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <FormControl>
                            <FormLabel>Date</FormLabel>
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Meal Type</FormLabel>
                            <Select
                                placeholder="Select meal"
                                value={selectedMealType}
                                onChange={(e) => setSelectedMealType(e.target.value)}
                            >
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Number of Meals</FormLabel>
                            <Select
                                placeholder="Select number"
                                value={selectedQuantity}
                                onChange={(e) => setSelectedQuantity(e.target.value)}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </Select>
                        </FormControl>
                    </div>
                    <Button
                        colorScheme="blue"
                        className="mt-4"
                        onClick={saveTodaysMeal}
                        isLoading={loading}
                        loadingText="Saving..."
                    >
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
                            <Button
                                colorScheme="green"
                                onClick={saveRegularMeal}
                                isLoading={loading}
                                loadingText="Saving..."
                            >
                                Save Regular Meal
                            </Button>
                        </Box>
                    </Box>
                    <p className="mt-4 text-gray-600">
                        You have set <b>{regularMeals}</b> meals per day as your regular plan.
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
                            <StatNumber>{monthlySummary.totalPlanned}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Total Meals Consumed</StatLabel>
                            <StatNumber>{monthlySummary.totalConsumed}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Remaining Meals</StatLabel>
                            <StatNumber>{monthlySummary.remaining}</StatNumber>
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
                            <Tab>Planned Meals ({plannedMeals.length})</Tab>
                            <Tab>Consumed Meals ({consumedMeals.length})</Tab>
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
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {plannedMeals.length === 0 ? (
                                            <Tr>
                                                <Td colSpan={4} className="text-center">
                                                    No planned meals found
                                                </Td>
                                            </Tr>
                                        ) : (
                                            plannedMeals.map((meal) => (
                                                <Tr key={meal.id}>
                                                    <Td>{new Date(meal.date).toLocaleDateString()}</Td>
                                                    <Td className="capitalize">{meal.mealType}</Td>
                                                    <Td>{meal.quantity}</Td>
                                                    <Td>
                                                        <Button
                                                            size="sm"
                                                            colorScheme="green"
                                                            onClick={() => markAsConsumed(meal.id)}
                                                        >
                                                            Mark as Consumed
                                                        </Button>
                                                    </Td>
                                                </Tr>
                                            ))
                                        )}
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
                                        {consumedMeals.length === 0 ? (
                                            <Tr>
                                                <Td colSpan={3} className="text-center">
                                                    No consumed meals found
                                                </Td>
                                            </Tr>
                                        ) : (
                                            consumedMeals.map((meal) => (
                                                <Tr key={meal.id}>
                                                    <Td>{new Date(meal.date).toLocaleDateString()}</Td>
                                                    <Td className="capitalize">{meal.mealType}</Td>
                                                    <Td>{meal.quantity}</Td>
                                                </Tr>
                                            ))
                                        )}
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
                            {weeklyMenu.map((item) => (
                                <Tr key={item.day}>
                                    <Td>
                                        {item.day}{" "}
                                        {item.isToday && (
                                            <Badge colorScheme="green">Today</Badge>
                                        )}
                                    </Td>
                                    <Td>{item.menu}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </CardBody>
            </Card>
        </Box>
    );
};

export default MealPlans;