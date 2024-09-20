"use server";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';

export async function LogoutUser(){
    revalidatePath("/");
    const cookie = cookies();
    const getToken = cookie.delete("Snatak");

    return {msg: "Logout Successful", status: true};
}