// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// // import { authOptions } from "@/lib/auth";
// import {
//     MealPlan,
//     UpdateMealPlanRequest,
//     readMealPlans,
//     writeMealPlans,
//     validateStatus
// } from "@/lib/meal-plans-utils";
// import { authOptions } from "../../auth/[...nextauth]/route";

// export async function PUT(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ): Promise<NextResponse> {
//     try {
//         const session = await getServerSession(authOptions);

//         if (!session?.user?.id) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         const body: UpdateMealPlanRequest = await request.json();
//         const { status } = body;
//         const mealId = params.id;

//         // Validate status
//         if (!validateStatus(status)) {
//             return NextResponse.json(
//                 { error: "Invalid status value" },
//                 { status: 400 }
//             );
//         }

//         const allMealPlans = await readMealPlans();
//         const mealIndex = allMealPlans.findIndex(
//             (plan: MealPlan) => plan.id === mealId && plan.userId === session.user.id
//         );

//         if (mealIndex === -1) {
//             return NextResponse.json(
//                 { error: "Meal plan not found" },
//                 { status: 404 }
//             );
//         }

//         // Update meal plan status
//         allMealPlans[mealIndex] = {
//             ...allMealPlans[mealIndex],
//             status,
//             updatedAt: new Date().toISOString(),
//         };

//         await writeMealPlans(allMealPlans);

//         return NextResponse.json({
//             mealPlan: allMealPlans[mealIndex],
//             message: "Meal plan updated successfully"
//         });

//     } catch (error) {
//         console.error("Error updating meal plan:", error);
//         return NextResponse.json(
//             { error: "Internal server error" },
//             { status: 500 }
//         );
//     }
// }


import { deleteMeal } from '@/utils/api/method/delete';
import { getMealById } from '@/utils/api/method/get';
import { updateMeal } from '@/utils/api/method/put';
import { NextRequest, NextResponse } from 'next/server';
// import { getMealById } from '@/utils/api/methods/get';
// import { updateMeal } from '@/utils/api/methods/put';
// import { deleteMeal } from '@/utils/api/methods/delete';

// GET - Fetch a single meal by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const meal = getMealById(params.id);

        if (!meal) {
            return NextResponse.json(
                { success: false, message: 'Meal not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: meal }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch meal' },
            { status: 500 }
        );
    }
}

// PUT - Update a meal by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const updatedMeal = updateMeal(params.id, body);

        if (!updatedMeal) {
            return NextResponse.json(
                { success: false, message: 'Meal not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: updatedMeal }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to update meal' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a meal by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const deleted = deleteMeal(params.id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: 'Meal not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Meal deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to delete meal' },
            { status: 500 }
        );
    }
}
