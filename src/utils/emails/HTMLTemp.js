export const signup = (otp) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Activate Your Account</title>
        <style>
            body {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                text-align: center;
                background-color: #f3f4f6;
                margin: 0;
                padding: 0;
            }
            .container {
                background-color: #ffffff;
                width: 90%;
                max-width: 420px;
                margin: 60px auto;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #6c5ce7;
                color: white;
                padding: 20px;
                font-size: 22px;
                font-weight: 600;
                border-radius: 15px 15px 0 0;
            }
            .content {
                padding: 25px;
            }
            .content h2 {
                font-size: 26px;
                color: #333;
                margin-bottom: 10px;
            }
            .content p {
                font-size: 16px;
                color: #666;
                margin-bottom: 20px;
            }
            .otp-box {
                display: inline-block;
                background-color: #f0f4f8;
                padding: 12px 25px;
                font-size: 24px;
                font-weight: bold;
                color: #6c5ce7;
                border-radius: 8px;
                margin-top: 15px;
                letter-spacing: 4px;
                border: 2px solid #6c5ce7;
            }
            .footer {
                font-size: 14px;
                color: #888;
                margin-top: 25px;
                line-height: 1.5;
            }
            .footer a {
                color: #6c5ce7;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                Job Search App
            </div>
            <div class="content">
                <h2>Welcome to Job Search App!</h2>
                <p>To activate your account, please enter the OTP below:</p>
                <div class="otp-box">${otp}</div>
                <p>This OTP will expire in 10 minutes. Please do not share it with anyone.</p>
            </div>
            <div class="footer">
                If you have any questions or need assistance, feel free to <a href="mailto:support@jobsearchapp.com">contact us</a>. We're here to help!
            </div>
        </div>
    </body>
</html>`;
