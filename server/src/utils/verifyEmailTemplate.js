const verifyEmailTemplate = ({ name, url }) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center;">
            <div style="max-width: 500px; margin: 40px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Hello, ${name} 👋</h2>
                <p style="color: #555; font-size: 16px;">You're almost there! Click the button below to verify your email and activate your account.</p>
                
                <a href="${url}" 
                   style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #22c55e; text-decoration: none; border-radius: 6px; font-weight: bold;">
                   Verify Email
                </a>

                <p style="color: #777; font-size: 14px;">If you didn’t request this, you can ignore this email.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p style="color: #888; font-size: 12px;">&copy; ${new Date().getFullYear()} QuickBasket. All rights reserved.</p>
            </div>
        </body>
        </html>
    `;
};

export { verifyEmailTemplate };
