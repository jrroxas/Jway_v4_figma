import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import nodemailer from 'nodemailer';
import https from 'https';

const escapeHtml = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmailList = (value: unknown) => {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((address) => address.trim())
    .filter((address) => emailPattern.test(address));
};

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
    const body = await req.json();
    const { name, email, company, phone, subject, message, requirements, formName, recaptchaToken } = body;

    // Standard field validation
    if (typeof name !== 'string' || name.trim().length < 2 || typeof email !== 'string' || !emailPattern.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid name and email address.' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    // 1. Fetch Form Settings Global for reCAPTCHA v3 & email routing/authentication parameters
    let formSettings: any = null;
    try {
      formSettings = await payload.findGlobal({
        slug: 'form-settings',
      });
    } catch (err) {
      console.warn('[Form Settings] Could not fetch global settings, using defaults:', err);
    }

    // 2. Verify Google Invisible reCAPTCHA v3 token if Site Key & Secret Key are configured
    const recaptchaSiteKey =
      (typeof formSettings?.recaptchaSiteKey === 'string' && formSettings.recaptchaSiteKey.trim()) ||
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ||
      '';
    const recaptchaSecretKey =
      (typeof formSettings?.recaptchaSecretKey === 'string' && formSettings.recaptchaSecretKey.trim()) ||
      process.env.RECAPTCHA_SECRET_KEY?.trim() ||
      '';

    if (recaptchaSiteKey && recaptchaSecretKey) {
      if (!recaptchaToken || typeof recaptchaToken !== 'string') {
        return NextResponse.json(
          { error: 'reCAPTCHA verification is required. Please refresh and try again.' },
          { status: 400 }
        );
      }

      try {
        const verifyParams = new URLSearchParams({
          secret: recaptchaSecretKey,
          response: recaptchaToken,
        });

        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: verifyParams.toString(),
        });

        const verifyJson = await verifyRes.json();
        const isScoreValid = typeof verifyJson.score === 'number' ? verifyJson.score >= 0.5 : true;

        if (!verifyJson.success || !isScoreValid) {
          console.warn('[reCAPTCHA v3] Verification rejected:', verifyJson);
          return NextResponse.json(
            { error: 'reCAPTCHA verification failed. Please try again.' },
            { status: 400 }
          );
        }
      } catch (verifyErr) {
        console.error('[reCAPTCHA v3] Error communicating with Google siteverify:', verifyErr);
        return NextResponse.json(
          { error: 'Unable to verify reCAPTCHA at this moment. Please try again.' },
          { status: 500 }
        );
      }
    }

    // 3. Save submission directly into Payload CMS 'forms' collection
    const finalFormName = formName || 'Contact Us Form';
    const finalMessage = message || requirements || '';

    const pgPool = (payload.db as { pool?: { query?: (sql: string) => Promise<unknown> } })?.pool;
    if (pgPool && typeof pgPool.query === 'function') {
      try {
        await pgPool.query(`ALTER TYPE "enum_forms_form_name" ADD VALUE IF NOT EXISTS 'Homepage Form';`);
      } catch {
        // Ignore if not using Postgres or enum already exists
      }
    }

    let newSubmission: any = null;
    try {
      newSubmission = await payload.create({
        collection: 'forms',
        data: {
          formName: finalFormName,
          name: name.trim(),
          email: email.trim(),
          company: company ? company.trim() : '',
          phone: phone ? phone.trim() : '',
          subject: subject ? subject.trim() : 'General Inquiry',
          message: finalMessage.trim(),
          status: 'new',
        } as any,
      });
    } catch (dbErr) {
      console.error('[Form Database Error] Could not save submission into forms collection:', dbErr);
    }

    const emailRecipient = formSettings?.emailRecipient || process.env.CONTACT_EMAIL || 'info@jway.com';
    const emailCc = normalizeEmailList(formSettings?.emailCc || process.env.CONTACT_EMAIL_CC);
    const emailSubjectPrefix = formSettings?.emailSubject || process.env.CONTACT_EMAIL_SUBJECT || 'New Contact Form Submission';
    const fromEmail = formSettings?.fromEmail || process.env.SMTP_FROM || 'info@jway.com';
    
    // Auto-detect OAuth2 if Google Cloud credentials are present
    const hasOAuthCredentials = Boolean(formSettings?.oauth2ClientId && formSettings?.oauth2RefreshToken);
    const authType = formSettings?.authType === 'oauth2' || (hasOAuthCredentials && (!formSettings?.authType || formSettings?.authType === 'smtp' && !formSettings?.smtpHost)) ? 'oauth2' : (formSettings?.authType || (hasOAuthCredentials ? 'oauth2' : 'smtp'));

    const emailSubject = `[${String(emailSubjectPrefix).replace(/[\r\n]/g, ' ').trim()}] ${String(subject || finalFormName).replace(/[\r\n]/g, ' ').trim()} - ${name.trim()}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #2e2f31; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #a8c028; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #2e2f31; margin: 0; font-size: 20px;">JWay Group Form Submission</h2>
          <p style="color: #a8c028; font-weight: bold; margin: 4px 0 0 0; font-size: 14px;">Origin: ${escapeHtml(finalFormName)}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #475569;">Full Name:</td>
            <td style="padding: 8px 0; color: #0f172a;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Work Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #a8c028; text-decoration: none; font-weight: bold;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Company:</td>
            <td style="padding: 8px 0; color: #0f172a;">${escapeHtml(company || 'N/A')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Phone Number:</td>
            <td style="padding: 8px 0; color: #0f172a;">${escapeHtml(phone || 'N/A')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Subject / Inquiry:</td>
            <td style="padding: 8px 0; color: #0f172a;">${escapeHtml(subject || 'N/A')}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <p style="font-weight: bold; margin-bottom: 8px; color: #475569;">Message / Requirements:</p>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; font-size: 14px; color: #1e293b; white-space: pre-wrap; line-height: 1.6; border: 1px solid #f1f5f9;">${escapeHtml(finalMessage || 'N/A')}</div>
        </div>
        <div style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
          Submitted on ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })} • Source: ${escapeHtml(req.headers.get('host') || 'jway.com')}
        </div>
      </div>
    `;

    // 3. Dispatch Email Notification, unless explicitly disabled in admin settings.
    if (formSettings?.enableSmtp === false) {
      return NextResponse.json({
        success: true,
        message: 'Submission saved. Live email dispatch is currently disabled.',
        submissionId: newSubmission?.id || null,
      });
    }

    const formatFromHeader = (addr: string) => {
      if (!addr) return 'JWay Group <info@jway.com>';
      const cleaned = addr.trim();
      if (cleaned.includes('<') && cleaned.includes('>')) return cleaned;
      return `JWay Group <${cleaned}>`;
    };

    const formattedFromHeader = formatFromHeader(fromEmail);

    if (authType === 'oauth2') {
      const clientId = formSettings?.oauth2ClientId || process.env.GMAIL_CLIENT_ID;
      const clientSecret = formSettings?.oauth2ClientSecret || process.env.GMAIL_CLIENT_SECRET;
      const refreshToken = formSettings?.oauth2RefreshToken || process.env.GMAIL_REFRESH_TOKEN;

      if (clientId && clientSecret && refreshToken) {
        try {
          const accessToken = await getGoogleAccessToken(clientId, clientSecret, refreshToken);
          const authorizedUser = (await getGoogleAuthorizedEmail(accessToken)) || fromEmail;

          const transporter = nodemailer.createTransport({
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

          await transporter.sendMail({
            from: formattedFromHeader,
            replyTo: fromEmail,
            to: emailRecipient,
            ...(emailCc && emailCc.length > 0 ? { cc: emailCc } : {}),
            subject: emailSubject,
            html: emailHtml,
          });

          console.log(`[Google Cloud OAuth2 Notification] Live email sent to ${emailRecipient} (From: ${formattedFromHeader}, Reply-To: ${fromEmail}, Auth User: ${authorizedUser})`);
        } catch (oauthErr) {
          console.error('[Google Cloud OAuth2 Error] Could not send email via OAuth2 API:', oauthErr);
        }
      }
    } else {
      const smtpHost = formSettings?.smtpHost || process.env.SMTP_HOST;
      const smtpPort = Number(formSettings?.smtpPort || process.env.SMTP_PORT || 587);
      const smtpUser = formSettings?.smtpUser || process.env.SMTP_USER;
      const smtpPass = formSettings?.smtpPass || process.env.SMTP_PASS;
      let smtpSecure = formSettings?.smtpSecure ?? (process.env.SMTP_SECURE === 'true');

      if (smtpHost && smtpUser && smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

          await transporter.sendMail({
            from: formattedFromHeader,
            replyTo: fromEmail,
            to: emailRecipient,
            ...(emailCc && emailCc.length > 0 ? { cc: emailCc } : {}),
            subject: emailSubject,
            html: emailHtml,
          });

          console.log(`[Form Notification] Email sent successfully to ${emailRecipient} (From: ${fromEmail})`);
        } catch (emailErr) {
          console.warn('[Form Notification] Email dispatch notice (console/SMTP mode):', emailErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Submission saved and email notification processed.',
      submissionId: newSubmission?.id || null,
    });
  } catch (error: any) {
    console.error('Error processing form submission:', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred while submitting the form.' },
      { status: 500 }
    );
  }
}
