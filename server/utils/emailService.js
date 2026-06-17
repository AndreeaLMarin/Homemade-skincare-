// server/utils/emailService.js
const sgMail = require('@sendgrid/mail')
const { admin } = require('../config/firebase')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendVerificationEmail(userEmail, displayName = '') {
  const actionCodeSettings = {
    url: `${process.env.CLIENT_URL}/login`,
    handleCodeInApp: false,
  }

  const verificationLink = await admin
    .auth()
    .generateEmailVerificationLink(userEmail, actionCodeSettings)

  console.log('Generated verification link:', verificationLink)
  
const msg = {
    to: userEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Verify your email — Homemade Skincare',
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; background-color: #F5EFE6; color: #2C1A0E;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Welcome to Homemade Skincare${displayName ? `, ${displayName}` : ''}!</h1>
        <p style="font-size: 16px; line-height: 1.5;">
          Thanks for joining. Please verify your email address to activate your account.
        </p>
        <p style="margin-top: 24px;">
          <a href="${verificationLink}" target="_blank"
             style="background-color: #2C1A0E; color: #F5EFE6; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block;">
            Verify My Email
          </a>
        </p>
        <p style="font-size: 13px; color: #555; margin-top: 32px;">
          Or copy and paste this link into your browser:<br>
          <a href="${verificationLink}" style="color: #2C1A0E; word-break: break-all;">${verificationLink}</a>
        </p>
        <p style="font-size: 13px; color: #555;">
          If you didn't create this account, you can safely ignore this email.
        </p>
      </div>
    `,
}
    await sgMail.send(msg)
}
module.exports = { sendVerificationEmail }