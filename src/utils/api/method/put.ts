import fs from 'fs';
import path from 'path';
import { Meal, getMeals } from './get';

export const updateMeal = (id: string, updatedData: Partial<Meal>): Meal | null => {
    const meals = getMeals();
    const mealIndex = meals.findIndex(meal => meal.id === id);

    if (mealIndex === -1) {
        return null;
    }

    meals[mealIndex] = { ...meals[mealIndex], ...updatedData };

    const filePath = path.join(process.cwd(), 'data', 'meals.json');
    fs.writeFileSync(filePath, JSON.stringify({ meals }, null, 2), 'utf8');

    return meals[mealIndex];
};