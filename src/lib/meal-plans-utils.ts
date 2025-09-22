import fs from "fs/promises";
import path from "path";

// Types
export interface MealPlan {
    id: string;
    userId: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner';
    quantity: number;
    status: 'planned' | 'consumed';
    createdAt: string;
    updatedAt?: string;
}

export interface RegularMealSetting {
    userId: string;
    mealsPerDay: number;
    updatedAt: string;
}

export interface MonthlySummary {
    totalPlanned: number;
    totalConsumed: number;
    remaining: number;
    month: string;
}

export interface CreateMealPlanRequest {
    date: string;
    mealType: string;
    quantity: number;
}

export interface UpdateMealPlanRequest {
    status: 'planned' | 'consumed';
}

export interface SaveRegularMealRequest {
    mealsPerDay: number;
}

// Constants
export const DATA_DIR = path.join(process.cwd(), "data");
export const MEAL_PLANS_FILE = path.join(DATA_DIR, "meal-plans.json");
export const REGULAR_MEALS_FILE = path.join(DATA_DIR, "regular-meals.json");

// Utility functions
export async function ensureDataDir(): Promise<void> {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

export async function readMealPlans(): Promise<MealPlan[]> {
    try {
        await ensureDataDir();
        const data = await fs.readFile(MEAL_PLANS_FILE, "utf-8");
        return JSON.parse(data) as MealPlan[];
    } catch (error) {
        return [];
    }
}

export async function writeMealPlans(mealPlans: MealPlan[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(MEAL_PLANS_FILE, JSON.stringify(mealPlans, null, 2));
}

export async function readRegularMeals(): Promise<RegularMealSetting[]> {
    try {
        await ensureDataDir();
        const data = await fs.readFile(REGULAR_MEALS_FILE, "utf-8");
        return JSON.parse(data) as RegularMealSetting[];
    } catch (error) {
        return [];
    }
}

export async function writeRegularMeals(settings: RegularMealSetting[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(REGULAR_MEALS_FILE, JSON.stringify(settings, null, 2));
}

export function generateMealPlanId(): string {
    return `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateMealType(mealType: string): mealType is 'breakfast' | 'lunch' | 'dinner' {
    return ['breakfast', 'lunch', 'dinner'].includes(mealType);
}

export function validateStatus(status: string): status is 'planned' | 'consumed' {
    return ['planned', 'consumed'].includes(status);
}

export function validateMealsPerDay(mealsPerDay: number): boolean {
    return mealsPerDay >= 1 && mealsPerDay <= 6;
}

export function getCurrentMonthMeals(mealPlans: MealPlan[]): MealPlan[] {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return mealPlans.filter((plan: MealPlan) => {
        const planDate = new Date(plan.date);
        return planDate.getMonth() === currentMonth &&
            planDate.getFullYear() === currentYear;
    });
}

export function calculateMonthlySummary(currentMonthMeals: MealPlan[]): MonthlySummary {
    const totalPlanned = currentMonthMeals.length;
    const totalConsumed = currentMonthMeals.filter(
        (plan: MealPlan) => plan.status === "consumed"
    ).length;
    const remaining = totalPlanned - totalConsumed;

    return {
        totalPlanned,
        totalConsumed,
        remaining,
        month: new Date().toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        })
    };
}