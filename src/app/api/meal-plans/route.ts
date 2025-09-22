import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import {
    MealPlan,
    CreateMealPlanRequest,
    readMealPlans,
    writeMealPlans,
    generateMealPlanId,
    validateMealType
} from "@/lib/meal-plans-utils";
import { authOptions } from "../auth/[...nextauth]/route";

// GET - Fetch user's meal plans
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

        return NextResponse.json({
            mealPlans: userMealPlans,
            message: "Meal plans fetched successfully"
        });

    } catch (error) {
        console.error("Error fetching meal plans:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create new meal plan
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body: CreateMealPlanRequest = await request.json();
        const { date, mealType, quantity } = body;

        // Validate required fields
        if (!date || !mealType || !quantity) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate mealType
        if (!validateMealType(mealType)) {
            return NextResponse.json(
                { error: "Invalid meal type" },
                { status: 400 }
            );
        }

        const allMealPlans = await readMealPlans();

        const newMealPlan: MealPlan = {
            id: generateMealPlanId(),
            userId: session.user.id,
            date,
            mealType,
            quantity: parseInt(quantity.toString()),
            status: "planned",
            createdAt: new Date().toISOString(),
        };

        allMealPlans.push(newMealPlan);
        await writeMealPlans(allMealPlans);

        return NextResponse.json({
            mealPlan: newMealPlan,
            message: "Meal plan created successfully"
        });

    } catch (error) {
        console.error("Error creating meal plan:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
