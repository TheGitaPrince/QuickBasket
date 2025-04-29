export const adminApprovalTemplate = ({ name }) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Admin Access Granted</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body class="bg-gray-100 m-0 p-0">
        <div class="max-w-lg mx-auto my-10 bg-white p-8 rounded-lg shadow-md">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-green-600">Congratulations, ${name}!</h1>
            <p class="mt-4 text-gray-700 text-base">Your request to become an <strong>Admin</strong> on <strong>QuickBasket</strong> has been <span class="text-green-600 font-semibold">approved</span>.</p>
          </div>
          <div class="mt-6 text-gray-700 text-base leading-relaxed">
            <p>You now have full access to the Admin Dashboard and management tools.</p>
            <p class="mt-4">Please use your new privileges responsibly to help maintain and grow our platform.</p>
          </div>
          <div class="text-center text-gray-400 text-xs mt-8">
            &copy; ${new Date().getFullYear()} QuickBasket. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;
  };
  