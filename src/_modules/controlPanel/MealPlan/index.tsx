'use client';

import React, { useState, useEffect } from 'react';
import {
    ChakraProvider,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useToast,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    HStack,
    VStack,
    Card,
    CardBody,
    Text,
    Stack,
    Select,
    Badge,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Spinner,
} from '@chakra-ui/react';
import { Edit2, Trash2, Calendar } from 'lucide-react';

interface Meal {
    id: string;
    date: string;
    numberOfMeals: number;
    mealType: string;
}

export default function MealPlans() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        date: '',
        numberOfMeals: '',
        mealType: '',
    });
    const [regularMealData, setRegularMealData] = useState({
        month: '',
        year: '',
        numberOfMeals: '',
        mealType: '',
    });
    const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
    const [filterDate, setFilterDate] = useState('');
    const [filterMealType, setFilterMealType] = useState('');
    const [hasRegularPlan, setHasRegularPlan] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Breakfast & Lunch', 'Lunch & Dinner', 'All Meals'];

    // Fetch meals on component mount
    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/meal-plans');
            const result = await response.json();
            if (result.success) {
                setMeals(result.data);
            } else {
                console.error('Failed to fetch meals:', result.message);
            }
        } catch (error) {
            console.error('Error fetching meals:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch meals',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.date || !formData.numberOfMeals || !formData.mealType) {
            toast({
                title: 'Error',
                description: 'Please fill in all fields',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await fetch('/api/meal-plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setFormData({ date: '', numberOfMeals: '', mealType: '' });
                await fetchMeals();
                toast({
                    title: 'Success',
                    description: 'Meal plan added successfully!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to add meal plan',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleRegularMealSubmit = async () => {
        if (!regularMealData.month || !regularMealData.year || !regularMealData.numberOfMeals || !regularMealData.mealType) {
            toast({
                title: 'Error',
                description: 'Please fill in all fields',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const monthIndex = months.indexOf(regularMealData.month);
        const year = parseInt(regularMealData.year);
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        const newMeals: Meal[] = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, monthIndex, day);
            const dateString = date.toISOString().split('T')[0];

            newMeals.push({
                id: `${Date.now()}-${day}`,
                date: dateString,
                numberOfMeals: parseInt(regularMealData.numberOfMeals),
                mealType: regularMealData.mealType,
            });
        }

        try {
            const response = await fetch('/api/meal-plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bulk: true, meals: newMeals }),
            });

            const result = await response.json();

            if (result.success) {
                setHasRegularPlan(true);
                setRegularMealData({ month: '', year: '', numberOfMeals: '', mealType: '' });
                await fetchMeals();
                toast({
                    title: 'Success',
                    description: `Regular meal plan created for ${regularMealData.month} ${regularMealData.year}!`,
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create regular meal plan',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleEdit = (meal: Meal) => {
        setEditingMeal(meal);
        onOpen();
    };

    const handleUpdate = async () => {
        if (!editingMeal) return;

        try {
            const response = await fetch(`/api/meal-plans/${editingMeal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingMeal),
            });

            const result = await response.json();

            if (result.success) {
                await fetchMeals();
                toast({
                    title: 'Success',
                    description: 'Meal plan updated successfully!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                onClose();
                setEditingMeal(null);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update meal plan',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/meal-plans/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                await fetchMeals();
                toast({
                    title: 'Deleted',
                    description: 'Meal plan deleted successfully!',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete meal plan',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleClearRegularPlan = async () => {
        try {
            const response = await fetch('/api/meal-plans', {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                setHasRegularPlan(false);
                await fetchMeals();
                toast({
                    title: 'Cleared',
                    description: 'Regular meal plan cleared!',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to clear meal plan',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const filteredMeals = meals.filter(meal => {
        const dateMatch = !filterDate || meal.date === filterDate;
        const typeMatch = !filterMealType || meal.mealType.toLowerCase().includes(filterMealType.toLowerCase());
        return dateMatch && typeMatch;
    });

    if (loading) {
        return (
            <ChakraProvider>
                <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
                    <Spinner size="xl" color="blue.500" />
                </Box>
            </ChakraProvider>
        );
    }

    return (
        <ChakraProvider>
            <Box minH="100vh" bg="gray.50" py={10} px={{ base: 4, md: 8 }}>
                <Box maxW="6xl" mx="auto">
                    <Heading as="h1" size="xl" mb={8} color="blue.700" textAlign="center">
                        🥗 Meal Planner Dashboard
                    </Heading>

                    {/* Regular Meal Plan Section */}
                    <Card mb={10} shadow="md" borderRadius="xl" bg="white" borderWidth={2} borderColor="purple.200">
                        <CardBody>
                            <VStack spacing={5} align="stretch">
                                <HStack justify="space-between">
                                    <HStack>
                                        <Calendar size={20} color="#805AD5" />
                                        <Heading as="h2" size="md" color="purple.700">
                                            Set Regular Meal Plan
                                        </Heading>
                                    </HStack>
                                    {hasRegularPlan && (
                                        <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                                            Active
                                        </Badge>
                                    )}
                                </HStack>

                                <Stack direction={{ base: 'column', md: 'row' }} spacing={5}>
                                    <FormControl isRequired>
                                        <FormLabel>Select Month</FormLabel>
                                        <Select
                                            placeholder="Choose month"
                                            value={regularMealData.month}
                                            onChange={e => setRegularMealData({ ...regularMealData, month: e.target.value })}
                                            borderColor="purple.300"
                                            focusBorderColor="purple.400"
                                        >
                                            {months.map(month => (
                                                <option key={month} value={month}>
                                                    {month}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Select Year</FormLabel>
                                        <Select
                                            placeholder="Choose year"
                                            value={regularMealData.year}
                                            onChange={e => setRegularMealData({ ...regularMealData, year: e.target.value })}
                                            borderColor="purple.300"
                                            focusBorderColor="purple.400"
                                        >
                                            {years.map(year => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Number of Meals per Day</FormLabel>
                                        <Select
                                            placeholder="Select number"
                                            value={regularMealData.numberOfMeals}
                                            onChange={e => setRegularMealData({ ...regularMealData, numberOfMeals: e.target.value })}
                                            borderColor="purple.300"
                                            focusBorderColor="purple.400"
                                        >
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <option key={num} value={num}>
                                                    {num} {num === 1 ? 'Meal' : 'Meals'}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Meal Type</FormLabel>
                                        <Select
                                            placeholder="Select type"
                                            value={regularMealData.mealType}
                                            onChange={e => setRegularMealData({ ...regularMealData, mealType: e.target.value })}
                                            borderColor="purple.300"
                                            focusBorderColor="purple.400"
                                        >
                                            {mealTypes.map(type => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Stack>

                                <HStack justify="flex-end" spacing={3}>
                                    {hasRegularPlan && (
                                        <Button
                                            onClick={handleClearRegularPlan}
                                            variant="outline"
                                            colorScheme="red"
                                            size="lg"
                                        >
                                            Clear Regular Plan
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleRegularMealSubmit}
                                        colorScheme="purple"
                                        size="lg"
                                        px={10}
                                    >
                                        Generate Monthly Plan
                                    </Button>
                                </HStack>
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Individual Meal Plan Section */}
                    <Card mb={10} shadow="md" borderRadius="xl" bg="white" opacity={hasRegularPlan ? 0.6 : 1}>
                        <CardBody>
                            {hasRegularPlan && (
                                <Alert status="warning" mb={4} borderRadius="md">
                                    <AlertIcon />
                                    <Box>
                                        <AlertTitle>Regular Plan Active</AlertTitle>
                                        <AlertDescription>
                                            Individual meal form is disabled. Clear the regular plan to add individual meals.
                                        </AlertDescription>
                                    </Box>
                                </Alert>
                            )}

                            <VStack spacing={5} align="stretch">
                                <Heading as="h2" size="md" color="gray.700">
                                    Add Individual Meal Plan
                                </Heading>

                                <Stack direction={{ base: 'column', md: 'row' }} spacing={5}>
                                    <FormControl isRequired isDisabled={hasRegularPlan}>
                                        <FormLabel>Input Date</FormLabel>
                                        <Input
                                            type="date"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            borderColor="gray.300"
                                            focusBorderColor="blue.400"
                                        />
                                    </FormControl>

                                    <FormControl isRequired isDisabled={hasRegularPlan}>
                                        <FormLabel>Number of Meals</FormLabel>
                                        <Select
                                            placeholder="Select number"
                                            value={formData.numberOfMeals}
                                            onChange={e => setFormData({ ...formData, numberOfMeals: e.target.value })}
                                            borderColor="gray.300"
                                            focusBorderColor="blue.400"
                                        >
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <option key={num} value={num}>
                                                    {num} {num === 1 ? 'Meal' : 'Meals'}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl isRequired isDisabled={hasRegularPlan}>
                                        <FormLabel>Type of Meals</FormLabel>
                                        <Select
                                            placeholder="Select meal type"
                                            value={formData.mealType}
                                            onChange={e => setFormData({ ...formData, mealType: e.target.value })}
                                            borderColor="gray.300"
                                            focusBorderColor="blue.400"
                                        >
                                            {mealTypes.map(type => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Stack>

                                <Button
                                    onClick={handleSubmit}
                                    colorScheme="blue"
                                    size="lg"
                                    alignSelf="flex-end"
                                    px={10}
                                    isDisabled={hasRegularPlan}
                                >
                                    Add Meal Plan
                                </Button>
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Meal Plans List */}
                    {meals.length > 0 ? (
                        <Card shadow="lg" borderRadius="xl" bg="white">
                            <CardBody>
                                <HStack justify="space-between" mb={4}>
                                    <Heading as="h2" size="md" color="gray.700">
                                        Existing Meal Plans
                                    </Heading>
                                    <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                                        {filteredMeals.length} Plans
                                    </Badge>
                                </HStack>

                                {/* Filters */}
                                <Stack
                                    direction={{ base: 'column', md: 'row' }}
                                    spacing={5}
                                    mb={6}
                                    align="flex-end"
                                >
                                    <FormControl>
                                        <FormLabel>Filter by Date</FormLabel>
                                        <Input
                                            type="date"
                                            value={filterDate}
                                            onChange={e => setFilterDate(e.target.value)}
                                            borderColor="gray.300"
                                            focusBorderColor="blue.400"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Filter by Meal Type</FormLabel>
                                        <Select
                                            placeholder="All types"
                                            value={filterMealType}
                                            onChange={e => setFilterMealType(e.target.value)}
                                            borderColor="gray.300"
                                            focusBorderColor="blue.400"
                                        >
                                            {mealTypes.map(type => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Button variant="outline" colorScheme="gray" onClick={() => {
                                        setFilterDate('');
                                        setFilterMealType('');
                                    }}>
                                        Clear Filters
                                    </Button>
                                </Stack>

                                {/* Table */}
                                <Box overflowX="auto">
                                    <Table variant="striped" colorScheme="blue" size="md">
                                        <Thead bg="blue.50">
                                            <Tr>
                                                <Th>Date</Th>
                                                <Th>Day</Th>
                                                <Th>Number of Meals</Th>
                                                <Th>Meal Type</Th>
                                                <Th textAlign="center">Actions</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {filteredMeals.map(meal => (
                                                <Tr key={meal.id}>
                                                    <Td>{new Date(meal.date).toLocaleDateString()}</Td>
                                                    <Td>
                                                        <Badge colorScheme="green">
                                                            {new Date(meal.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                        </Badge>
                                                    </Td>
                                                    <Td>{meal.numberOfMeals}</Td>
                                                    <Td>
                                                        <Badge colorScheme="purple" variant="subtle">
                                                            {meal.mealType}
                                                        </Badge>
                                                    </Td>
                                                    <Td textAlign="center">
                                                        <HStack justify="center" spacing={2}>
                                                            <IconButton
                                                                aria-label="Edit"
                                                                icon={<Edit2 size={16} />}
                                                                colorScheme="blue"
                                                                variant="ghost"
                                                                onClick={() => handleEdit(meal)}
                                                                _hover={{ bg: 'blue.100' }}
                                                            />
                                                            <IconButton
                                                                aria-label="Delete"
                                                                icon={<Trash2 size={16} />}
                                                                colorScheme="red"
                                                                variant="ghost"
                                                                onClick={() => handleDelete(meal.id)}
                                                                _hover={{ bg: 'red.100' }}
                                                            />
                                                        </HStack>
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </Box>

                                {filteredMeals.length === 0 && (
                                    <Text textAlign="center" py={8} color="gray.500">
                                        No meal plans found matching your filters.
                                    </Text>
                                )}
                            </CardBody>
                        </Card>
                    ) : (
                        <Box textAlign="center" py={20} color="gray.500" fontSize="lg">
                            No meal plans added yet. Start by creating one above!
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Edit Modal */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Meal Plan</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {editingMeal && (
                            <VStack spacing={4}>
                                <FormControl>
                                    <FormLabel>Date</FormLabel>
                                    <Input
                                        type="date"
                                        value={editingMeal.date}
                                        onChange={e => setEditingMeal({ ...editingMeal, date: e.target.value })}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Number of Meals</FormLabel>
                                    <Select
                                        value={editingMeal.numberOfMeals}
                                        onChange={e =>
                                            setEditingMeal({
                                                ...editingMeal,
                                                numberOfMeals: parseInt(e.target.value),
                                            })
                                        }
                                    >
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? 'Meal' : 'Meals'}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Meal Type</FormLabel>
                                    <Select
                                        value={editingMeal.mealType}
                                        onChange={e =>
                                            setEditingMeal({ ...editingMeal, mealType: e.target.value })
                                        }
                                    >
                                        {mealTypes.map(type => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>

                                <HStack spacing={3} width="100%" pt={4}>
                                    <Button colorScheme="blue" onClick={handleUpdate} flex={1}>
                                        Update
                                    </Button>
                                    <Button variant="ghost" onClick={onClose} flex={1}>
                                        Cancel
                                    </Button>
                                </HStack>
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </ChakraProvider>
    );
}