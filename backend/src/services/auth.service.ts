import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken"

interface RegisterUserData {
    name: string;
    email: string;
    password: string;
}

export const registerUser = async ({
    name,
    email,
    password,
}: RegisterUserData) => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};

interface LoginUserData {
    email: string;
    password: string;
}

export const loginUser = async ({
    email,
    password,
}: LoginUserData) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    const token = jwt.sign({
        id: user.id,
        role: user.role
    },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "7d"
        })
    return {
        user:{id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
        },
        token
    };

};