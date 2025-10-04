// app/api/meal-plans/auto-consume/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import {
    MealPlan,
    readMealPlans,
    writeMealPlans
} from "@/lib/meal-plans-utils";
import { authOptions } from "../../auth/[...nextauth]/route";

// Helper function to check if a date is in the past
function isDatePassed(dateString: string): boolean {
    const mealDate = new Date(dateString);
    const today = new Date();

    // Reset time to compare only dates
    mealDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return mealDate < today;
}

// POST - Auto-consume past meals
export async function POST(): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const allMealPlans = await readMealPlans();
        let updatedCount = 0;

        // Find user's planned meals that are past due
        const updatedMealPlans = allMealPlans.map((plan: MealPlan) => {
            if (
                plan.userId === session.user.id &&
                plan.status === 'planned' &&
                isDatePassed(plan.date)
            ) {
                updatedCount++;
                return {
                    ...plan,
                    status: 'consumed' as const,
                    updatedAt: new Date().toISOString(),
                };
            }
            return plan;
        });

        // Save updated meal plans if any changes were made
        if (updatedCount > 0) {
            await writeMealPlans(updatedMealPlans);
        }

        return NextResponse.json({
            updatedCount,
            message: `${updatedCount} meals auto-consumed successfully`
        });

    } catch (error) {
        console.error("Error auto-consuming meals:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// lib/meal-plans-utils.ts - Add this utility function
export function getOverdueMeals(mealPlans: MealPlan[]): MealPlan[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return mealPlans.filter((plan: MealPlan) => {
        if (plan.status !== 'planned') return false;

        const mealDate = new Date(plan.date);
        mealDate.setHours(0, 0, 0, 0);

        return mealDate < today;
    });
}

export function autoConsumeMeals(mealPlans: MealPlan[]): {
    updatedMealPlans: MealPlan[],
    updatedCount: number
} {
    let updatedCount = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedMealPlans = mealPlans.map((plan: MealPlan) => {
        if (plan.status === 'planned') {
            const mealDate = new Date(plan.date);
            mealDate.setHours(0, 0, 0, 0);

            if (mealDate < today) {
                updatedCount++;
                return {
                    ...plan,
                    status: 'consumed' as const,
                    updatedAt: new Date().toISOString(),
                };
            }
        }
        return plan;
    });

    return { updatedMealPlans, updatedCount };
}