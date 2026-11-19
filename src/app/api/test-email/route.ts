import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import nodemailer from 'nodemailer';
import https from 'https';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getGoogleAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const postData = new URLSearchParams({
    client_id: clientId.trim(),
    client_secret: clientSecret.trim(),
    refresh_token: refreshToken.trim(),
    grant_type: 'refresh_token',
  }).toString();

  return new Promise((resolve, reject) => {
    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.access_token) {
            resolve(json.access_token);
          } else {
            const errDetail = json.error_description || json.error || data;
            if (json.error === 'invalid_client') {
              reject(new Error(`Google Cloud Client Secret or Client ID is invalid ("invalid_client"). Please double-check your Client Secret from Google Cloud Console -> Credentials.`));
            } else if (json.error === 'invalid_grant') {
              reject(new Error(`Google Refresh Token is expired or invalid ("invalid_grant"). Please generate a new Refresh Token in Google OAuth2 Playground.`));
            } else {
              reject(new Error(`Google OAuth2 Error (${json.error}): ${errDetail}`));
            }
          }
        } catch (e) {
          reject(new Error(`Failed to parse Google response: ${data}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

function getGoogleAuthorizedEmail(accessToken: string): Promise<string | null> {
  return new Promise((resolve) => {
    const req = https.request('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const profile = JSON.parse(data);
          resolve(profile.emailAddress || null);
        } catch {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.end();
  });
}

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config });

    // Fetch Form Settings Global
    let formSettings: any = null;
    try {
      formSettings = await payload.findGlobal({
        slug: 'form-settings',
      });
    } catch (err) {
      console.warn('[Test Email] Could not fetch form-settings global:', err);
    }

    const emailRecipient = formSettings?.emailRecipient || process.env.CONTACT_EMAIL || 'info@jway.com';
    const fromEmail = formSettings?.fromEmail || process.env.SMTP_FROM || 'info@jway.com';

    if (formSettings?.enableSmtp === false) {
      return NextResponse.json({
        success: false,
        error: 'Live email dispatch is disabled in Form Settings.',
      }, { status: 400 });
    }

    if (!emailPattern.test(emailRecipient) || !emailPattern.test(fromEmail)) {
      return NextResponse.json({
        success: false,
        error: 'Please configure valid recipient and sender email addresses in Form Settings.',
      }, { status: 400 });
    }
    
    // Auto-detect OAuth2 if Google Cloud credentials are present
    const hasOAuthCredentials = Boolean(formSettings?.oauth2ClientId && formSettings?.oauth2RefreshToken);
    const authType = formSettings?.authType === 'oauth2' || (hasOAuthCredentials && (!formSettings?.authType || formSettings?.authType === 'smtp' && !formSettings?.smtpHost)) ? 'oauth2' : (formSettings?.authType || (hasOAuthCredentials ? 'oauth2' : 'smtp'));

    // Build Transporter based on authType (SMTP or Google Cloud Console OAuth2)
    let transporter: nodemailer.Transporter;

    if (authType === 'oauth2') {
      const clientId = formSettings?.oauth2ClientId || process.env.GMAIL_CLIENT_ID;
      const clientSecret = formSettings?.oauth2ClientSecret || process.env.GMAIL_CLIENT_SECRET;
      const refreshToken = formSettings?.oauth2RefreshToken || process.env.GMAIL_REFRESH_TOKEN;

      if (!clientId || !clientSecret || !refreshToken) {
        return NextResponse.json({
          success: false,
          error: 'Google Cloud OAuth2 credentials missing! Please enter Client ID, Client Secret, and Refresh Token in Form Settings.',
        }, { status: 400 });
      }

      // Fetch fresh Google OAuth2 access token
      const accessToken = await getGoogleAccessToken(clientId, clientSecret, refreshToken);
      
      // Auto-detect exact authorized email address from Google Account
      const authorizedUser = (await getGoogleAuthorizedEmail(accessToken)) || fromEmail;

      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: authorizedUser,
          clientId: clientId.trim(),
          clientSecret: clientSecret.trim(),
          refreshToken: refreshToken.trim(),
          accessToken: accessToken,
        },
      });
    } else {
      const smtpHost = formSettings?.smtpHost || process.env.SMTP_HOST;
      const smtpPort = Number(formSettings?.smtpPort || process.env.SMTP_PORT || 587);
      const smtpUser = formSettings?.smtpUser || process.env.SMTP_USER;
      const smtpPass = formSettings?.smtpPass || process.env.SMTP_PASS;
      let smtpSecure = formSettings?.smtpSecure ?? (process.env.SMTP_SECURE === 'true');

      if (!smtpHost || !smtpUser || !smtpPass) {
        return NextResponse.json({
          success: false,
          error: 'SMTP credentials missing! Please fill in SMTP Host Server, SMTP Username, and SMTP Password in Form Settings.',
        }, { status: 400 });
      }

      if (smtpPort === 587 && smtpSecure === true) {
        smtpSecure = false;
      } else if (smtpPort === 465 && smtpSecure === false) {
        smtpSecure = true;
      }

      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
      });
    }

    const formattedFrom = fromEmail.includes('<') ? fromEmail : `JWay CMS <${fromEmail}>`;

    await transporter.sendMail({
      from: formattedFrom,
      to: emailRecipient,
      subject: `[JWay CMS Test] ${authType === 'oauth2' ? 'Google OAuth2 API' : 'SMTP'} Test - ${new Date().toLocaleTimeString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #2e2f31; max-width: 550px; margin: 0 auto; border: 1px solid #a8c028; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #a8c028; padding-bottom: 12px; margin-bottom: 16px;">
            <h2 style="color: #2e2f31; margin: 0; font-size: 20px;">✅ ${authType === 'oauth2' ? 'Google Cloud OAuth2 API' : 'SMTP'} Test Successful!</h2>
            <p style="color: #a8c028; font-weight: bold; margin: 4px 0 0 0; font-size: 14px;">JWay Group CMS Mailer</p>
          </div>
          <p style="font-size: 14px; line-height: 1.6;">
            Hello! This is a test email sent from your <strong>JWay CMS Admin Form Settings</strong>.
          </p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 13px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Recipient (To):</strong> ${emailRecipient}</p>
            <p style="margin: 0 0 8px 0;"><strong>Sender (From):</strong> ${fromEmail}</p>
            <p style="margin: 0 0 8px 0;"><strong>Auth Method:</strong> ${authType === 'oauth2' ? 'Google Cloud OAuth2 API' : 'SMTP'}</p>
            <p style="margin: 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })}</p>
          </div>
          <p style="font-size: 13px; color: #64748b; margin-top: 16px; text-align: center;">
            Your CMS email pipeline is fully active and ready to deliver website contact inquiries directly to your inbox.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${emailRecipient} via ${authType === 'oauth2' ? 'Google Cloud OAuth2 API' : 'SMTP'}! Check your inbox.`,
    });
  } catch (error: any) {
    console.error('[SMTP/OAuth2 Test Error]', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown email dispatch error occurred.',
    }, { status: 500 });
  }
}
