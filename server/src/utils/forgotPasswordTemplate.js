export const forgotPasswordTemplate = ({ name, otp }) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>You requested to reset your password. Use the OTP below to proceed:</p>
            <div style="text-align: center; font-size: 24px; font-weight: bold; background: #f1f1f1; padding: 10px; border-radius: 5px; display: inline-block;">
                ${otp}
            </div>
            <p style="margin-top: 20px;">If you did not request this, please ignore this email. This OTP is valid for only 10 minutes.</p>
            <p style="margin-top: 20px; color: #555;">Thanks,<br/>Your App Team</p>
        </div>
    `;
};
