"use server";
import nodemailer from "nodemailer";
import { render } from '@react-email/render';
import VerificationEmail from './VerificationEmail';
import { revalidatePath } from "next/cache";

export async function sendMail({
  to,
  name,
  subject,
  body,
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });
  

  const emailHtml = await render(
    <VerificationEmail username={name} otp={body} />
  );


  try {
    revalidatePath("/login");
    revalidatePath("/forgot-Password");
    revalidatePath("/signup");
    await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: emailHtml,
    });
    // console.log(sendResult);
  } catch (error) {
    console.log(error);
  }
}