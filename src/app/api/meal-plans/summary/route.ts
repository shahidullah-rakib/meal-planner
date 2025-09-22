import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import {
    MealPlan,
    readMealPlans,
    getCurrentMonthMeals,
    calculateMonthlySummary
} from "@/lib/meal-plans-utils";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET - Fetch monthly summary
export async function GET(): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const allMealPlans = await readMealPlans();
        const userMealPlans = allMealPlans.filter(
            (plan: MealPlan) => plan.userId === session.user.id
        );

        const currentMonthMeals = getCurrentMonthMeals(userMealPlans);
        const summary = calculateMonthlySummary(currentMonthMeals);

        return NextResponse.json(summary);

    } catch (error) {
        console.error("Error fetching monthly summary:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}