// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// // import { authOptions } from "@/lib/auth";
// import {
//     MealPlan,
//     CreateMealPlanRequest,
//     readMealPlans,
//     writeMealPlans,
//     generateMealPlanId,
//     validateMealType
// } from "@/lib/meal-plans-utils";
// import { authOptions } from "../auth/[...nextauth]/route";

// // GET - Fetch user's meal plans
// export async function GET(): Promise<NextResponse> {
//     try {
//         const session = await getServerSession(authOptions);

//         if (!session?.user?.id) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         const allMealPlans = await readMealPlans();
//         const userMealPlans = allMealPlans.filter(
//             (plan: MealPlan) => plan.userId === session.user.id
//         );

//         return NextResponse.json({
//             mealPlans: userMealPlans,
//             message: "Meal plans fetched successfully"
//         });

//     } catch (error) {
//         console.error("Error fetching meal plans:", error);
//         return NextResponse.json(
//             { error: "Internal server error" },
//             { status: 500 }
//         );
//     }
// }

// // POST - Create new meal plan
// export async function POST(request: NextRequest): Promise<NextResponse> {
//     try {
//         const session = await getServerSession(authOptions);

//         if (!session?.user?.id) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         const body: CreateMealPlanRequest = await request.json();
//         const { date, mealType, quantity } = body;

//         // Validate required fields
//         if (!date || !mealType || !quantity) {
//             return NextResponse.json(
//                 { error: "Missing required fields" },
//                 { status: 400 }
//             );
//         }

//         // Validate mealType
//         if (!validateMealType(mealType)) {
//             return NextResponse.json(
//                 { error: "Invalid meal type" },
//                 { status: 400 }
//             );
//         }

//         const allMealPlans = await readMealPlans();

//         const newMealPlan: MealPlan = {
//             id: generateMealPlanId(),
//             userId: session.user.id,
//             date,
//             mealType,
//             quantity: parseInt(quantity.toString()),
//             status: "planned",
//             createdAt: new Date().toISOString(),
//         };

//         allMealPlans.push(newMealPlan);
//         await writeMealPlans(allMealPlans);

//         return NextResponse.json({
//             mealPlan: newMealPlan,
//             message: "Meal plan created successfully"
//         });

//     } catch (error) {
//         console.error("Error creating meal plan:", error);
//         return NextResponse.json(
//             { error: "Internal server error" },
//             { status: 500 }
//         );
//     }
// }

import { deleteAllMeals } from '@/utils/api/method/delete';
import { getMeals } from '@/utils/api/method/get';
import { createBulkMeals, createMeal } from '@/utils/api/method/post';
import { NextRequest, NextResponse } from 'next/server';
// import { getMeals } from '@/utils/api/methods/get';
// import { createMeal, createBulkMeals } from '@/utils/api/methods/post';
// import { deleteAllMeals } from '@/utils/api/methods/delete';

// GET - Fetch all meals
export async function GET() {
    try {
        const meals = getMeals();
        return NextResponse.json({ success: true, data: meals }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch meals' },
            { status: 500 }
        );
    }
}

// POST - Create a new meal or bulk meals
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Check if it's bulk creation
        if (body.bulk && Array.isArray(body.meals)) {
            const createdMeals = createBulkMeals(body.meals);
            return NextResponse.json(
                { success: true, data: createdMeals },
                { status: 201 }
            );
        }

        // Single meal creation
        const { date, numberOfMeals, mealType } = body;

        if (!date || !numberOfMeals || !mealType) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newMeal = {
            id: Date.now().toString(),
            date,
            numberOfMeals: parseInt(numberOfMeals),
            mealType,
        };

        const createdMeal = createMeal(newMeal);
        return NextResponse.json({ success: true, data: createdMeal }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to create meal' },
            { status: 500 }
        );
    }
}

// DELETE - Delete all meals
export async function DELETE() {
    try {
        deleteAllMeals();
        return NextResponse.json(
            { success: true, message: 'All meals deleted' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to delete meals' },
            { status: 500 }
        );
    }
}