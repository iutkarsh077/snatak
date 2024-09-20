"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";

interface UserCheck {
    email: string,
    otp: string
}

export async function OtpVerify(data: UserCheck) {
    revalidatePath("/signup");
    try {
        if (!data.otp) {
            return { msg: "Please enter the otp", status: false };
        }

        const findUser = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (!findUser) {
            return { msg: "Email not found", status: false };
        }

        if (findUser.verificationOtp != data.otp) {
            return { msg: "Does not match", status: false };
        }

        const myOtp = Math.round(Math.floor(1000 + Math.random() * 9000)).toString();
        await prisma.user.update({
            where: {
                email: data.email
            },

            data: {
                verified: true,
                verificationOtp: myOtp
            }
        })

        return { msg: "User Verified successfully", status: true };
    } catch (error) {
        console.log(error);
        return { msg: "Something went wrong", status: false };
    }
}