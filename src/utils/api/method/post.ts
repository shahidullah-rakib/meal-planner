import fs from 'fs';
import path from 'path';
import { Meal, getMeals } from './get';

export const createMeal = (newMeal: Meal): Meal => {
    const meals = getMeals();
    meals.push(newMeal);

    const filePath = path.join(process.cwd(), 'data', 'meals.json');
    fs.writeFileSync(filePath, JSON.stringify({ meals }, null, 2), 'utf8');

    return newMeal;
};

export const createBulkMeals = (newMeals: Meal[]): Meal[] => {
    const meals = getMeals();
    const updatedMeals = [...meals, ...newMeals];

    const filePath = path.join(process.cwd(), 'data', 'meals.json');
    fs.writeFileSync(filePath, JSON.stringify({ meals: updatedMeals }, null, 2), 'utf8');

    return newMeals;
};