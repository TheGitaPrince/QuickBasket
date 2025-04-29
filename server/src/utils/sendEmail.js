import { Resend } from "resend";
import { ApiError } from "./ApiError.js";
import dotenv from "dotenv"

dotenv.config()

if (!process.env.RESEND_API) {
  throw new ApiError(500, "Provide RESEND_API inside the .env file");
}

const resend = new Resend(process.env.RESEND_API);

export const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "QuickBasket <onboarding@resend.dev>",
      to: sendTo,
      subject,
      html,
    });

    if (error) {
      throw new ApiError(500, error.message || "Email sending failed");
    }
    
    return data;
  } catch (error) {
    throw new ApiError(500, error.message || "Internal Server Error");
  }
};

