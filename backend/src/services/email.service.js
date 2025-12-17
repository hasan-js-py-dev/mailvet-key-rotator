const resend = require('../config/resend');

const EMAIL_FROM = process.env.EMAIL_FROM || 'MailVet <send@mailvet.app>';

const sendVerificationEmail = async (email, token, name = '') => {
  const verificationUrl = `${process.env.FRONTEND_URL}/access?page=verify-email&token=${token}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Verify your MailVet account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background-color: #f4f4f5;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #8B5CF6; margin: 0; font-size: 28px;">MailVet</h1>
            </div>
            
            <h2 style="color: #18181b; margin-bottom: 16px;">Verify your email address</h2>
            
            <p style="color: #52525b; line-height: 1.6;">
              Hi${name ? ` ${name}` : ''},
            </p>
            
            <p style="color: #52525b; line-height: 1.6;">
              Thanks for signing up for MailVet! Please click the button below to verify your email address and activate your account.
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #6366F1); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #71717a; font-size: 14px; line-height: 1.6;">
              If you didn't create an account with MailVet, you can safely ignore this email.
            </p>
            
            <p style="color: #71717a; font-size: 14px; line-height: 1.6;">
              This link will expire in 24 hours.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">
            
            <p style="color: #a1a1aa; font-size: 12px; text-align: center;">
              MailVet - Professional Email Validation<br>
              <a href="https://mailvet.app" style="color: #8B5CF6;">mailvet.app</a>
            </p>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send verification email');
    }

    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (email, token, name = '') => {
  const resetUrl = `${process.env.FRONTEND_URL}/access?page=reset&token=${token}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Reset your MailVet password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background-color: #f4f4f5;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #8B5CF6; margin: 0; font-size: 28px;">MailVet</h1>
            </div>
            
            <h2 style="color: #18181b; margin-bottom: 16px;">Reset your password</h2>
            
            <p style="color: #52525b; line-height: 1.6;">
              Hi${name ? ` ${name}` : ''},
            </p>
            
            <p style="color: #52525b; line-height: 1.6;">
              We received a request to reset your password. Click the button below to choose a new password.
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #6366F1); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #71717a; font-size: 14px; line-height: 1.6;">
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
            
            <p style="color: #71717a; font-size: 14px; line-height: 1.6;">
              This link will expire in 1 hour.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">
            
            <p style="color: #a1a1aa; font-size: 12px; text-align: center;">
              MailVet - Professional Email Validation<br>
              <a href="https://mailvet.app" style="color: #8B5CF6;">mailvet.app</a>
            </p>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send password reset email');
    }

    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};

const sendWelcomeEmail = async (email, name = '') => {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Welcome to MailVet! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background-color: #f4f4f5;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #8B5CF6; margin: 0; font-size: 28px;">MailVet</h1>
            </div>
            
            <h2 style="color: #18181b; margin-bottom: 16px;">Welcome to MailVet! 🎉</h2>
            
            <p style="color: #52525b; line-height: 1.6;">
              Hi${name ? ` ${name}` : ''},
            </p>
            
            <p style="color: #52525b; line-height: 1.6;">
              Your account is now verified and ready to use. You've been credited with <strong>50 free email validations</strong> to get started.
            </p>
            
            <div style="background: #f4f4f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #18181b; margin: 0 0 12px 0; font-size: 16px;">What you can do:</h3>
              <ul style="color: #52525b; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Validate single email addresses instantly</li>
                <li>Check email deliverability and risk levels</li>
                <li>Upgrade to Ultimate for bulk CSV validation</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.DASHBOARD_URL}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #6366F1); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">
                Go to Dashboard
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">
            
            <p style="color: #a1a1aa; font-size: 12px; text-align: center;">
              MailVet - Professional Email Validation<br>
              <a href="https://mailvet.app" style="color: #8B5CF6;">mailvet.app</a>
            </p>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend error:', error);
    }

    return data;
  } catch (error) {
    console.error('Welcome email error:', error);
    // Don't throw - welcome email is not critical
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};
