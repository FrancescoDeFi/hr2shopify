// Supabase Edge Function to send email notifications for new questionnaire submissions
// This function is triggered by a database webhook when a new row is inserted

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL");

interface QuestionnaireSubmission {
  id: string;
  email: string;
  reason?: string;
  age?: number;
  sex?: string;
  created_at: string;
  full_data: any;
}

serve(async (req) => {
  try {
    // Parse the webhook payload from Supabase
    const payload = await req.json();
    const submission: QuestionnaireSubmission = payload.record;

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    if (!NOTIFICATION_EMAIL) {
      throw new Error("NOTIFICATION_EMAIL environment variable is not set");
    }

    // Format the submission data for email
    const submissionDetails = formatSubmissionDetails(submission);

    // Send email using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Hair Squad Notifications <notifications@yourdomain.com>", // Update this
        to: [NOTIFICATION_EMAIL],
        subject: `New Hair Quiz Submission from ${submission.email}`,
        html: generateEmailHTML(submission, submissionDetails),
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const emailData = await emailResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email notification sent",
        emailId: emailData.id,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

function formatSubmissionDetails(submission: QuestionnaireSubmission): string {
  const details = [];

  if (submission.reason) details.push(`Reason: ${submission.reason}`);
  if (submission.age) details.push(`Age: ${submission.age}`);
  if (submission.sex) details.push(`Sex: ${submission.sex}`);

  return details.join(" | ");
}

function generateEmailHTML(
  submission: QuestionnaireSubmission,
  details: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Hair Quiz Submission</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3c0c1c 0%, #5a1428 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Hair Quiz Submission</h1>
  </div>

  <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-top: 0;">A new user has completed the hair questionnaire:</p>

    <div style="background: #f7f6f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #3c0c1c;">Email:</td>
          <td style="padding: 8px 0;">${submission.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #3c0c1c;">Submission ID:</td>
          <td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${submission.id}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #3c0c1c;">Date:</td>
          <td style="padding: 8px 0;">${new Date(submission.created_at).toLocaleString()}</td>
        </tr>
        ${details ? `
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #3c0c1c;">Quick Info:</td>
          <td style="padding: 8px 0;">${details}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <div style="background: #fef9e7; border-left: 4px solid #3c0c1c; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #666;">
        <strong>Next Steps:</strong> Review the full submission in your Supabase dashboard or CRM.
      </p>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
      <a href="https://app.supabase.com/project/YOUR_PROJECT_ID/editor"
         style="display: inline-block; background: #3c0c1c; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
        View in Supabase Dashboard
      </a>
    </div>
  </div>

  <div style="margin-top: 20px; text-align: center; color: #999; font-size: 12px;">
    <p>This is an automated notification from Hair Squad Quiz System</p>
  </div>
</body>
</html>
  `;
}
