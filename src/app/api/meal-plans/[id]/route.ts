import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import {
    MealPlan,
    UpdateMealPlanRequest,
    readMealPlans,
    writeMealPlans,
    validateStatus
} from "@/lib/meal-plans-utils";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body: UpdateMealPlanRequest = await request.json();
        const { status } = body;
        const mealId = params.id;

        // Validate status
        if (!validateStatus(status)) {
            return NextResponse.json(
                { error: "Invalid status value" },
                { status: 400 }
            );
        }

        const allMealPlans = await readMealPlans();
        const mealIndex = allMealPlans.findIndex(
            (plan: MealPlan) => plan.id === mealId && plan.userId === session.user.id
        );

        if (mealIndex === -1) {
            return NextResponse.json(
                { error: "Meal plan not found" },
                { status: 404 }
            );
        }

        // Update meal plan status
        allMealPlans[mealIndex] = {
            ...allMealPlans[mealIndex],
            status,
            updatedAt: new Date().toISOString(),
        };

        await writeMealPlans(allMealPlans);

        return NextResponse.json({
            mealPlan: allMealPlans[mealIndex],
            message: "Meal plan updated successfully"
        });

    } catch (error) {
        console.error("Error updating meal plan:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
