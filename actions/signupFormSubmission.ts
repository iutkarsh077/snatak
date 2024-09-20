"use server";

import Sendit from "@/helpers/email/Sendit";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function SignupUser(formData: any) {
    revalidatePath("/signup");
    const { name, email, password } = formData;
    try {
        const findEmailExist = await prisma.user.findUnique({
            where: {
                email: email
            },
        })

        if (findEmailExist) {
            return { msg: "User already exist", status: false };
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const myOtp = Math.round(Math.floor(1000 + Math.random() * 9000)).toString();
        const saveUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                verificationOtp: myOtp
            }
        });
        await Sendit({ to: email, name: name, subject: "Verify Email", body: myOtp })
        return { msg: "Otp send successfully for verification of email", status: true }
    } catch (error) {
        return { msg: "Otp sending failed for verification of email", status: false }
    }
}