"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import Sendit from "@/helpers/email/Sendit";

export async function VerifyEmailLogin(email: string) {
    revalidatePath("login");

    if (!email) {
        return { msg: "Please fill the email field", status: false }
    }
    try {
        const findEmailExist = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                email: true,
                name: true,
                verificationOtp: true,
                verified: true
            }
        })

        if (!findEmailExist) {
            return { msg: "User does not exist", status: false, verified: false };
        }

        if (findEmailExist.verified === true) {
            return { msg: "User is already Verified", status: false, verified: findEmailExist.verified }
        }
        await Sendit({ to: email, name: findEmailExist.name, subject: "Verify Email", body: findEmailExist.verificationOtp })
        return { msg: "Otp send successfully for verification of email", status: true, verified: findEmailExist.verified }

    } catch (error) {
        return { msg: "Otp sending failed for verification of email", status: false, verified: false }
    }
}