import fs from 'fs';
import path from 'path';
import { getMeals } from './get';

export const deleteMeal = (id: string): boolean => {
    const meals = getMeals();
    const filteredMeals = meals.filter(meal => meal.id !== id);

    if (filteredMeals.length === meals.length) {
        return false; // No meal was deleted
    }

    const filePath = path.join(process.cwd(), 'data', 'meals.json');
    fs.writeFileSync(filePath, JSON.stringify({ meals: filteredMeals }, null, 2), 'utf8');

    return true;
};

export const deleteAllMeals = (): boolean => {
    const filePath = path.join(process.cwd(), 'data', 'meals.json');
    fs.writeFileSync(filePath, JSON.stringify({ meals: [] }, null, 2), 'utf8');
    return true;
};