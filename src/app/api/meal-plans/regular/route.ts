import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import {
    RegularMealSetting,
    SaveRegularMealRequest,
    readRegularMeals,
    writeRegularMeals,
    validateMealsPerDay
} from "@/lib/meal-plans-utils";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET - Fetch user's regular meal setting
export async function GET(): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const allSettings = await readRegularMeals();
        const userSetting = allSettings.find(
            (setting: RegularMealSetting) => setting.userId === session.user.id
        );

        return NextResponse.json({
            mealsPerDay: userSetting?.mealsPerDay || 3,
            updatedAt: userSetting?.updatedAt || null
        });

    } catch (error) {
        console.error("Error fetching regular meal setting:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Save regular meal setting
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body: SaveRegularMealRequest = await request.json();
        const { mealsPerDay } = body;

        if (!validateMealsPerDay(mealsPerDay)) {
            return NextResponse.json(
                { error: "Invalid meals per day value" },
                { status: 400 }
            );
        }

        const allSettings = await readRegularMeals();
        const existingIndex = allSettings.findIndex(
            (setting: RegularMealSetting) => setting.userId === session.user.id
        );

        const newSetting: RegularMealSetting = {
            userId: session.user.id,
            mealsPerDay: parseInt(mealsPerDay.toString()),
            updatedAt: new Date().toISOString(),
        };

        if (existingIndex !== -1) {
            allSettings[existingIndex] = newSetting;
        } else {
            allSettings.push(newSetting);
        }

        await writeRegularMeals(allSettings);

        return NextResponse.json({
            setting: newSetting,
            message: "Regular meal setting saved successfully"
        });

    } catch (error) {
        console.error("Error saving regular meal setting:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
