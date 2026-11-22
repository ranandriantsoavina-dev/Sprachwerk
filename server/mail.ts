export interface MailResult {
  delivered: boolean;
  mode: 'production' | 'sandbox' | 'unconfigured';
  error?: string;
}

export function getEnvSecret(key: string): string {
  try {
    const globalAny = globalThis as any;
    if (globalAny.__CF_ENV__?.[key]) {
      return String(globalAny.__CF_ENV__[key]).trim();
    }
  } catch {}
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return String(process.env[key]).trim();
  }
  return '';
}

function getAppUrl(fallbackOrigin?: string): string {
  const configured = getEnvSecret('APP_URL');
  if (configured && configured !== 'MY_APP_URL' && /^https?:\/\//i.test(configured)) {
    return configured.replace(/\/+$/, '');
  }
  if (fallbackOrigin && /^https?:\/\//i.test(fallbackOrigin)) {
    return fallbackOrigin.replace(/\/+$/, '');
  }
  return 'http://localhost:3000';
}

export function getMailtrapStatus() {
  const token = getEnvSecret('MAILTRAP_API_TOKEN');
  const sender = getEnvSecret('MAILTRAP_SENDER_EMAIL');
  const sandboxInboxId = getEnvSecret('MAILTRAP_SANDBOX_INBOX_ID');
  return {
    configured: Boolean(token),
    mode: token ? (sandboxInboxId ? 'sandbox' : 'production') : 'unconfigured',
    hasSenderEmail: Boolean(sender),
    hasSandboxInbox: Boolean(sandboxInboxId),
  };
}

async function sendMailtrapEmail(params: {
  toEmail: string;
  toName?: string;
  subject: string;
  text: string;
  html: string;
  category: string;
}): Promise<MailResult> {
  const token = getEnvSecret('MAILTRAP_API_TOKEN');
  if (!token) {
    return {
      delivered: false,
      mode: 'unconfigured',
      error: 'MAILTRAP_API_TOKEN is not configured on the server.',
    };
  }

  const sandboxInboxId = getEnvSecret('MAILTRAP_SANDBOX_INBOX_ID');
  const senderEmail = getEnvSecret('MAILTRAP_SENDER_EMAIL') || 'noreply@sprachwerk.academy';
  const endpoint = sandboxInboxId
    ? `https://sandbox.api.mailtrap.io/api/send/${encodeURIComponent(sandboxInboxId)}`
    : 'https://send.api.mailtrap.io/api/send';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: {
          email: senderEmail,
          name: 'SPRACHWERK Academy',
        },
        to: [
          {
            email: params.toEmail,
            name: params.toName || params.toEmail,
          },
        ],
        subject: params.subject,
        text: params.text,
        html: params.html,
        category: params.category,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      return {
        delivered: false,
        mode: sandboxInboxId ? 'sandbox' : 'production',
        error: `Mailtrap API responded with status ${response.status}${errBody ? `: ${errBody.slice(0, 180)}` : ''}`,
      };
    }

    return {
      delivered: true,
      mode: sandboxInboxId ? 'sandbox' : 'production',
    };
  } catch (err) {
    return {
      delivered: false,
      mode: sandboxInboxId ? 'sandbox' : 'production',
      error: err instanceof Error ? err.message : 'Network error sending email',
    };
  }
}

function wrapHtml(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#F8F9FA;font-family:Arial,Helvetica,sans-serif;color:#111318;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="height:4px;background:linear-gradient(90deg,#000000 33.3%,#DD0000 33.3%,#DD0000 66.6%,#FFCE00 66.6%);"></td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.12em;color:#000000;margin-bottom:16px;">SPRACHWERK</div>
          <h1 style="margin:0 0 12px 0;font-size:20px;line-height:1.3;color:#111318;">${title}</h1>
          ${bodyHtml}
          <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0 16px;" />
          <p style="margin:0;font-size:12px;color:#6B7280;">SPRACHWERK · German Grammar Academy · Automated security message</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendVerificationEmail(params: {
  toEmail: string;
  username: string;
  rawToken: string;
  lang: 'en' | 'fr' | 'de';
  origin?: string;
}): Promise<MailResult> {
  const baseUrl = getAppUrl(params.origin);
  const verifyUrl = `${baseUrl}/?verifyToken=${encodeURIComponent(params.rawToken)}`;

  const copy = {
    en: {
      subject: 'Verify your SPRACHWERK email address',
      title: 'Confirm your email address',
      intro: `Hello ${params.username}, please confirm your email address to activate your SPRACHWERK account. This link expires in 24 hours.`,
      cta: 'Verify Email Address',
      ignore: 'If you did not create this account, you can safely ignore this message.',
    },
    fr: {
      subject: 'Vérifiez votre adresse e-mail SPRACHWERK',
      title: 'Confirmez votre adresse e-mail',
      intro: `Bonjour ${params.username}, veuillez confirmer votre adresse e-mail pour activer votre compte SPRACHWERK. Ce lien expire dans 24 heures.`,
      cta: 'Vérifier mon e-mail',
      ignore: "Si vous n'avez pas créé ce compte, vous pouvez ignorer cet e-mail.",
    },
    de: {
      subject: 'Bestätige deine SPRACHWERK-E-Mail-Adresse',
      title: 'E-Mail-Adresse bestätigen',
      intro: `Hallo ${params.username}, bitte bestätige deine E-Mail-Adresse, um dein SPRACHWERK-Konto zu aktivieren. Dieser Link ist 24 Stunden gültig.`,
      cta: 'E-Mail bestätigen',
      ignore: 'Wenn du dieses Konto nicht erstellt hast, kannst du diese Nachricht ignorieren.',
    },
  }[params.lang];

  const html = wrapHtml(
    copy.title,
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#374151;">${copy.intro}</p>
     <p style="margin:0 0 20px;">
       <a href="${verifyUrl}" style="display:inline-block;padding:12px 22px;background:#DD0000;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:14px;border-radius:8px;">${copy.cta}</a>
     </p>
     <p style="margin:0;font-size:13px;color:#6B7280;">${copy.ignore}</p>`
  );

  return sendMailtrapEmail({
    toEmail: params.toEmail,
    toName: params.username,
    subject: copy.subject,
    text: `${copy.intro}\n\n${verifyUrl}\n\n${copy.ignore}`,
    html,
    category: 'email_verification',
  });
}

export async function sendPasswordResetEmail(params: {
  toEmail: string;
  username: string;
  rawToken: string;
  lang: 'en' | 'fr' | 'de';
  origin?: string;
}): Promise<MailResult> {
  const baseUrl = getAppUrl(params.origin);
  const resetUrl = `${baseUrl}/?resetToken=${encodeURIComponent(params.rawToken)}`;

  const copy = {
    en: {
      subject: 'SPRACHWERK password reset request',
      title: 'Reset your password',
      intro: `A single-use password reset was requested for account "${params.username}". This link expires in 30 minutes.`,
      cta: 'Set New Password',
      ignore: 'If you did not request a password reset, please ignore this email; your password remains unchanged.',
    },
    fr: {
      subject: 'Réinitialisation du mot de passe SPRACHWERK',
      title: 'Réinitialisez votre mot de passe',
      intro: `Une réinitialisation à usage unique a été demandée pour le compte « ${params.username} ». Ce lien expire dans 30 minutes.`,
      cta: 'Définir un nouveau mot de passe',
      ignore: "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.",
    },
    de: {
      subject: 'SPRACHWERK-Passwort zurücksetzen',
      title: 'Passwort zurücksetzen',
      intro: `Für das Konto „${params.username}“ wurde ein einmaliger Link zum Zurücksetzen des Passworts angefordert. Gültig für 30 Minuten.`,
      cta: 'Neues Passwort festlegen',
      ignore: 'Falls du dies nicht angefordert hast, ignoriere diese E-Mail einfach.',
    },
  }[params.lang];

  const html = wrapHtml(
    copy.title,
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#374151;">${copy.intro}</p>
     <p style="margin:0 0 20px;">
       <a href="${resetUrl}" style="display:inline-block;padding:12px 22px;background:#000000;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:14px;border-radius:8px;">${copy.cta}</a>
     </p>
     <p style="margin:0;font-size:13px;color:#6B7280;">${copy.ignore}</p>`
  );

  return sendMailtrapEmail({
    toEmail: params.toEmail,
    toName: params.username,
    subject: copy.subject,
    text: `${copy.intro}\n\n${resetUrl}\n\n${copy.ignore}`,
    html,
    category: 'password_reset',
  });
}

export async function sendPasswordChangedEmail(params: {
  toEmail: string;
  username: string;
  lang: 'en' | 'fr' | 'de';
}): Promise<MailResult> {
  const copy = {
    en: {
      subject: 'Your SPRACHWERK password was changed',
      title: 'Password updated',
      body: `This confirms that the password for your SPRACHWERK account (${params.username}) was recently changed. Active sessions have been secured. If you did not make this change, contact an administrator immediately.`,
    },
    fr: {
      subject: 'Votre mot de passe SPRACHWERK a été modifié',
      title: 'Mot de passe mis à jour',
      body: `Nous confirmons que le mot de passe de votre compte SPRACHWERK (${params.username}) vient d'être modifié. Si vous n'êtes pas à l'origine de ce changement, contactez un administrateur.`,
    },
    de: {
      subject: 'Dein SPRACHWERK-Passwort wurde geändert',
      title: 'Passwort aktualisiert',
      body: `Dies ist die Bestätigung, dass das Passwort deines SPRACHWERK-Kontos (${params.username}) geändert wurde. Wenn du dies nicht veranlasst hast, wende dich bitte sofort an einen Administrator.`,
    },
  }[params.lang];

  const html = wrapHtml(
    copy.title,
    `<p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">${copy.body}</p>`
  );

  return sendMailtrapEmail({
    toEmail: params.toEmail,
    toName: params.username,
    subject: copy.subject,
    text: copy.body,
    html,
    category: 'password_changed',
  });
}

export async function sendSecurityNoticeEmail(params: {
  toEmail: string;
  username: string;
  notice: string;
}): Promise<MailResult> {
  const html = wrapHtml(
    'Account Security Notice',
    `<p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">Hello ${params.username}, ${params.notice}</p>`
  );
  return sendMailtrapEmail({
    toEmail: params.toEmail,
    toName: params.username,
    subject: 'SPRACHWERK Security Notice',
    text: `Hello ${params.username}, ${params.notice}`,
    html,
    category: 'security_notice',
  });
}
