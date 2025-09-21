import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import { promises as fs } from "fs";

const SECRET = process.env.JWT_SECRET || "my-secret"; // keep in .env.local

interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    image: string | null;
    role: string;
    createdAt: string;
    lastLogin: string | null;
    preferences: {
        dietaryRestrictions: string[];
        allergies: string[];
        favoriteCategories: string[];
    };
}

interface SocialUser {
    id: string;
    email: string;
    name: string;
    image: string | null;
    provider: string;
    providerId: string;
    role: string;
    createdAt: string;
    lastLogin: string | null;
    preferences: {
        dietaryRestrictions: string[];
        allergies: string[];
        favoriteCategories: string[];
    };
}

interface UserData {
    users: User[];
    socialUsers: SocialUser[];
}

async function getUsersData(): Promise<UserData> {
    try {
        // Read from src/data/users/users.json
        const usersPath = path.join(process.cwd(), 'src', 'data', 'users', 'users.json');
        const jsonData = await fs.readFile(usersPath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error reading users data:', error);
        console.error('Expected path:', path.join(process.cwd(), 'src', 'data', 'users', 'users.json'));
        throw new Error('Failed to load user data from src/data/users/users.json');
    }
}

async function updateUserLastLogin(email: string): Promise<void> {
    try {
        const usersPath = path.join(process.cwd(), 'src', 'data', 'users', 'users.json');
        const userData = await getUsersData();
        const userIndex = userData.users.findIndex(user => user.email === email);

        if (userIndex !== -1) {
            userData.users[userIndex].lastLogin = new Date().toISOString();
            await fs.writeFile(usersPath, JSON.stringify(userData, null, 2));
        }
    } catch (error) {
        console.error('Error updating last login:', error);
        // Don't throw error here, just log it as login should still succeed
    }
}

async function verifyPassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
    // Check if password is hashed (starts with $2a$ or $2b$)
    if (hashedPassword.startsWith('$2a$') || hashedPassword.startsWith('$2b$')) {
        return await bcrypt.compare(inputPassword, hashedPassword);
    }

    // For plain text passwords (like "123" in your data)
    return inputPassword === hashedPassword;
}

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Get users data from JSON file
        const userData = await getUsersData();

        // Find user by email
        const user = userData.users.find(u => u.email === email);

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Update last login time (async, don't wait for it)
        updateUserLastLogin(email).catch(console.error);

        // Create JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            SECRET,
            { expiresIn: "1h" }
        );

        // Return success response (don't include password)
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            token,
            user: userWithoutPassword,
            message: "Login successful"
        });

    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}