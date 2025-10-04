import fs from 'fs';
import path from 'path';

export interface Meal {
    id: string;
    date: string;
    numberOfMeals: number;
    mealType: string;
}

export const getMeals = (): Meal[] => {
    const filePath = path.join(process.cwd(), 'data', 'meals.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data.meals || [];
};

export const getMealById = (id: string): Meal | undefined => {
    const meals = getMeals();
    return meals.find(meal => meal.id === id);
};

// import fs from 'fs';
// import path from 'path';

// export interface Meal {
//     id: string;
//     date: string;
//     numberOfMeals: number;
//     mealType: string;
// }

// const getFilePath = () => {
//     return path.join(process.cwd(), 'data', 'meals.json');
// };

// const ensureFileExists = () => {
//     const filePath = getFilePath();
//     const dir = path.dirname(filePath);

//     // Create data directory if it doesn't exist
//     if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir, { recursive: true });
//     }

//     // Create meals.json if it doesn't exist
//     if (!fs.existsSync(filePath)) {
//         fs.writeFileSync(filePath, JSON.stringify({ meals: [] }, null, 2), 'utf8');
//     }
// };

// export const getMeals = (): Meal[] => {
//     try {
//         ensureFileExists();
//         const filePath = getFilePath();
//         const fileContents = fs.readFileSync(filePath, 'utf8');
//         const data = JSON.parse(fileContents);
//         return data.meals || [];
//     } catch (error) {
//         console.error('Error reading meals:', error);
//         return [];
//     }
// };

// export const getMealById = (id: string): Meal | undefined => {
//     const meals = getMeals();
//     return meals.find(meal => meal.id === id);
// };
