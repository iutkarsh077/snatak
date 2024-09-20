"use server";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';
import prisma from "../prisma";

export async function checkUser() {
    revalidatePath("/");
    try {
        const cookie = cookies();
        const getToken = cookie.get("Snatak");
        if (!getToken) {
            return { msg: "User not available", status: false };
        }

        const decodeToken = jwt.verify(getToken.value as any, process.env.JWT_SECRET!) as any;

        const findUser = await prisma.user.findUnique({
            where: {
                email: decodeToken.email,
            },
            select: {
                email: true,
                name: true,
                verified: true
            }
        })

        if (!findUser) {
            return { msg: "User not available", status: false };
        }

        return { msg: "User available", userDetails: findUser, status: true };
    } catch (error) {
        return { msg: "User getting failed", status: false };
    }
}