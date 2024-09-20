"use server";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'

interface DataLogin {
    email: string,
    password: string
}

export async function LoginServer(data: DataLogin) {
    revalidatePath("/login");
    if (!data.email || !data.password) {
        return { msg: "Please fill the empty fields", status: false };
    }

    try {
        const IsUserExist = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (!IsUserExist) {
            return { msg: "User does not exist", status: false };
        }

        const comparePassword = bcrypt.compareSync(data.password, IsUserExist.password);

        if(!comparePassword){
            return {msg: "Invalid Credentials", status: false};
        }

        if(IsUserExist.verified === false){
            return {msg: "Please verify your email to login", status: false};
        }

        const cookieStore = cookies();
        const token =  jwt.sign({name: IsUserExist.name, email: IsUserExist.email, verified: IsUserExist.verified, id: IsUserExist.id}, process.env.JWT_SECRET!);

        const myCookie = cookieStore.set("Snatak", token, {
            maxAge: 15 * 24 * 60 * 60,
            priority: "medium",
        });

        return {msg: "Login successful", userDetails: IsUserExist, status: true};
    } catch (error) {
        return { msg: "Something went wrong", status: false };
    }
}