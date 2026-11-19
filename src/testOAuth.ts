import https from 'https';
import nodemailer from 'nodemailer';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
if (https.globalAgent) {
  https.globalAgent.options.rejectUnauthorized = false;
}

const clientId = '656848679546-vk82n8i9gf5ubqan4gm89npafgme0jp2.apps.googleusercontent.com';
const clientSecret = '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';
const refreshToken = '1//04sl4rwEVhBagCgYIARAAGAQSNwF-L9Ir84L0rMsHwdnsNimJD4ZrmHyg95xVKaArPoiwQwCqb5Oqo_bUUHl-VLiQneMKbZ4Lrdo';

function getGoogleAccessToken(): Promise<string> {
  const postData = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  }).toString();

  return new Promise((resolve, reject) => {
    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
      rejectUnauthorized: false,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.access_token) {
            console.log('✅ Access Token acquired:', json.access_token.substring(0, 15) + '...');
            resolve(json.access_token);
          } else {
            console.error('❌ Token Exchange Error:', json);
            reject(new Error(json.error_description || json.error || data));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testGmailApi() {
  try {
    const token = await getGoogleAccessToken();
    console.log('Testing Gmail API endpoint with access token...');

    // Fetch user profile from Gmail API to see exact authorized email address
    const req = https.request('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      rejectUnauthorized: false,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', async () => {
        console.log('Gmail Profile Response:', data);
        try {
          const profile = JSON.parse(data);
          const emailAddress = profile.emailAddress;
          console.log('📧 Authorized Gmail Account Email:', emailAddress);

          if (emailAddress) {
            console.log(`Sending Nodemailer test email using authenticated user: ${emailAddress}...`);
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                type: 'OAuth2',
                user: emailAddress,
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken: token,
              },
              tls: {
                rejectUnauthorized: false,
              },
            });

            await transporter.sendMail({
              from: emailAddress,
              to: 'joey.concepcion@jway.com',
              subject: 'JWay OAuth2 Test Email Success!',
              text: 'Hello from JWay CMS via Google Cloud OAuth2!',
            });
            console.log('🎉 EMAIL SENT SUCCESSFULLY VIA OAUTH2!');
          }
        } catch (e) {
          console.error('Mail dispatch error:', e);
        }
      });
    });

    req.on('error', console.error);
    req.end();
  } catch (err) {
    console.error('Test Failed:', err);
  }
}

testGmailApi();
