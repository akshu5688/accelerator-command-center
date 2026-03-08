import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-api-version, x-region",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Content-Type": "application/json",
};

type InviteBody = {
  name: string;
  email: string;
  role: "mentor" | "program_manager";
  workspaceId: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "re_7PSUUHXd_KZQuDSyG43kJHvuCSimpF49i";
    const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL");
    const APP_BASE_URL = Deno.env.get("APP_BASE_URL") ?? req.headers.get("origin") ?? "https://accelerator-command-center-gamma.vercel.app";

    if (
      !SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY ||
      !RESEND_API_KEY || !RESEND_FROM_EMAIL
    ) {
      return json(
        {
          error:
            "Missing env vars. Required: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, RESEND_FROM_EMAIL",
        },
        500,
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Missing Authorization header" }, 401);
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const {
      data: { user: currentUser },
      error: currentUserError,
    } = await userClient.auth.getUser();

    if (currentUserError || !currentUser) {
      return json({ error: "Unauthorized", details: currentUserError?.message }, 401);
    }

    let body: InviteBody;
    try {
      body = (await req.json()) as InviteBody;
    } catch {
      return json({ error: "Invalid JSON payload" }, 400);
    }

    const name = body?.name?.trim();
    const email = body?.email?.trim().toLowerCase();
    const role = body?.role;
    const workspaceId = body?.workspaceId?.trim();

    if (!name || !email || !role || !workspaceId) {
      return json(
        { error: "name, email, role, workspaceId are required" },
        400,
      );
    }

    if (!["mentor", "program_manager"].includes(role)) {
      return json({ error: "Invalid role" }, 400);
    }

    const { data: inviterRole, error: inviterRoleError } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser.id)
      .eq("workspace_id", workspaceId)
      .maybeSingle();

    if (inviterRoleError) {
      return json(
        { error: "Failed to verify inviter permissions", details: inviterRoleError.message },
        500,
      );
    }

    const allowedInviterRoles = ["admin", "owner", "program_manager"];
    if (!inviterRole || !allowedInviterRoles.includes(inviterRole.role)) {
      return json({ error: "You are not allowed to send invites" }, 403);
    }

    const { data: existingMember } = await adminClient
      .from("team_members")
      .select("status")
      .eq("workspace_id", workspaceId)
      .eq("email", email)
      .maybeSingle();

    if (existingMember?.status === "active") {
      return json({ error: "User is already an active member" }, 409);
    }

    const acceptUrl =
      `${APP_BASE_URL.replace(/\/$/, "")}/invite/accept?workspace_id=${encodeURIComponent(workspaceId)}&email=${encodeURIComponent(email)}`;

    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: acceptUrl },
    });

    if (linkError || !linkData?.properties?.action_link) {
      return json(
        { error: "Failed to generate auth link", details: linkError?.message ?? "No action_link returned" },
        500,
      );
    }

    const inviteLink = linkData.properties.action_link;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>You've been invited to ERRA Accelerator</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>You've been invited as <strong>${role === "program_manager" ? "Program Manager" : "Mentor"}</strong>.</p>
        <p>Click the button below to accept your invite:</p>
        <p style="margin: 24px 0;">
          <a
            href="${inviteLink}"
            style="background:#c8946d;color:#fff;padding:12px 20px;text-decoration:none;border-radius:8px;display:inline-block;"
          >
            Accept Invite
          </a>
        </p>
        <p>This invite is tied to <strong>${escapeHtml(email)}</strong>. Please open it using that same email account.</p>
        <p>If the button does not work, copy this link into your browser:</p>
        <p>${inviteLink}</p>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [email],
        subject: "You've been invited to ERRA Accelerator",
        html,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("invite_failed_resend", resendData);
      return json(
        { error: "Failed to send email", details: resendData?.message ?? resendData },
        500,
      );
    }

    // Mark as invited only after email has been sent successfully.
    const nowIso = new Date().toISOString();
    const { error: teamMemberError } = await adminClient
      .from("team_members")
      .upsert(
        {
          workspace_id: workspaceId,
          name,
          email,
          role,
          status: "invited",
          invited_at: nowIso,
          accepted_at: null,
        },
        { onConflict: "workspace_id,email" },
      );

    if (teamMemberError) {
      return json(
        { error: "Invite email sent, but failed to save invite status", details: teamMemberError.message },
        500,
      );
    }

    console.log("invite_sent", {
      workspaceId,
      email,
      role,
      invitedBy: currentUser.id,
      resendId: resendData?.id,
    });

    return json({
      success: true,
      message: `Invite sent to ${email}`,
      email,
    });
  } catch (error) {
    console.error("send-invite error:", error);
    return json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      500,
    );
  }
});
