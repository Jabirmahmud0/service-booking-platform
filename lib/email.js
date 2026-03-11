let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;
  
  const nodemailer = await import('nodemailer');
  transporter = nodemailer.default.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  return transporter;
}

export async function sendConfirmationEmail({ to, bookingRef, serviceName, scheduledAt, amount, customerName }) {
  const formattedDate = new Date(scheduledAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = new Date(scheduledAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedAmount = (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  console.log(`Preparing confirmation email via Gmail for: ${to} (Ref: ${bookingRef})`);

  if (process.env.EMAIL_DEV_MODE === 'true') {
    console.log('\n📧 [DEV EMAIL MOCK] Gmail Confirmation Email =================');
    console.log(`To: ${to}`);
    console.log(`Subject: Your BookEase Booking is Confirmed — #${bookingRef}`);
    console.log(`Customer: ${customerName}`);
    console.log(`Service: ${serviceName}`);
    console.log(`Time: ${new Date(scheduledAt).toLocaleString()}`);
    console.log('=======================================================\n');
    return { success: true, id: 'mock-id-' + Date.now() };
  }

  try {
    const t = await getTransporter();
    const info = await t.sendMail({
      from: `"BookEase" <${process.env.GMAIL_USER}>`,
      to,
      subject: `Your BookEase Booking is Confirmed — #${bookingRef}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%); padding: 40px 40px 30px; text-align: center;">
                        <h1 style="color: #FFFFFF; font-size: 28px; font-weight: 700; margin: 0;">BookEase</h1>
                      </td>
                    </tr>
                    
                    <!-- Success Icon -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center;">
                        <div style="width: 80px; height: 80px; background-color: #DCFCE7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                          <span style="color: #16A34A; font-size: 40px;">✓</span>
                        </div>
                        <h2 style="color: #1F2937; font-size: 24px; font-weight: 700; margin: 20px 0 10px;">Booking Confirmed!</h2>
                        <p style="color: #6B7280; font-size: 16px; margin: 0;">Thank you for your booking, ${customerName}</p>
                      </td>
                    </tr>
                    
                    <!-- Booking Reference -->
                    <tr>
                      <td style="padding: 0 40px 30px; text-align: center;">
                        <div style="background-color: #F1F5F9; border-radius: 8px; padding: 15px 25px; display: inline-block;">
                          <span style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Booking Reference</span>
                          <p style="color: #1E3A5F; font-size: 24px; font-weight: 700; font-family: 'JetBrains Mono', monospace; margin: 5px 0 0;">#${bookingRef}</p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Booking Details -->
                    <tr>
                      <td style="padding: 0 40px 30px;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border-radius: 8px; padding: 20px;">
                          <tr>
                            <td style="padding: 10px 20px; border-bottom: 1px solid #E2E8F0;">
                              <span style="color: #6B7280; font-size: 14px;">Service</span>
                              <p style="color: #1F2937; font-size: 16px; font-weight: 600; margin: 5px 0 0;">${serviceName}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 20px; border-bottom: 1px solid #E2E8F0;">
                              <span style="color: #6B7280; font-size: 14px;">Date & Time</span>
                              <p style="color: #1F2937; font-size: 16px; font-weight: 600; margin: 5px 0 0;">${formattedDate} at ${formattedTime}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 20px;">
                              <span style="color: #6B7280; font-size: 14px;">Amount Paid</span>
                              <p style="color: #16A34A; font-size: 18px; font-weight: 700; margin: 5px 0 0;">${formattedAmount}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                      <td style="padding: 0 40px 40px; text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_URL || 'https://bookease.app'}" style="display: inline-block; background-color: #2563EB; color: #FFFFFF; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">View Your Booking</a>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #F8FAFC; padding: 30px 40px; text-align: center; border-top: 1px solid #E2E8F0;">
                        <p style="color: #6B7280; font-size: 14px; margin: 0 0 10px;">Need help? Contact us at support@bookease.app</p>
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">© 2025 BookEase. All rights reserved.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    console.log('✅ Gmail email sent:', info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error('Gmail email send error:', error);
    return { success: false, error };
  }
}

export async function sendCancellationEmail({ to, bookingRef, serviceName, scheduledAt, customerName }) {
  const formattedDate = new Date(scheduledAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  console.log(`Preparing cancellation email via Gmail for: ${to} (Ref: ${bookingRef})`);

  if (process.env.EMAIL_DEV_MODE === 'true') {
    console.log('\n📧 [DEV EMAIL MOCK] Gmail Cancellation Email =================');
    console.log(`To: ${to}`);
    console.log(`Subject: Booking Cancelled — #${bookingRef}`);
    console.log(`Customer: ${customerName}`);
    console.log('=======================================================\n');
    return { success: true, id: 'mock-id-' + Date.now() };
  }

  try {
    const t = await getTransporter();
    const info = await t.sendMail({
      from: `"BookEase" <${process.env.GMAIL_USER}>`,
      to,
      subject: `Booking Cancelled — #${bookingRef}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Inter', sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden;">
                    <tr>
                      <td style="background: #1E3A5F; padding: 40px; text-align: center;">
                        <h1 style="color: #FFFFFF; font-size: 28px; margin: 0;">BookEase</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px; text-align: center;">
                        <h2 style="color: #DC2626; font-size: 24px; margin: 0 0 20px;">Booking Cancelled</h2>
                        <p style="color: #6B7280; margin: 0 0 20px;">Hi ${customerName}, your booking #${bookingRef} for ${serviceName} on ${formattedDate} has been cancelled.</p>
                        <a href="${process.env.NEXT_PUBLIC_URL || 'https://bookease.app'}/services" style="display: inline-block; background-color: #2563EB; color: #FFFFFF; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Book Again</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    console.log('✅ Gmail cancellation email sent:', info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error('Gmail cancellation email send error:', error);
    return { success: false, error };
  }
}
