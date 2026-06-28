import type { APIRoute } from 'astro';
import { db } from '@/db';
import { contactMessages } from '@/db/schema';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos son obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = import.meta.env.BREVO_API_KEY || process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error('[Contact] BREVO_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Error interno del servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const html = [
      `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">`,
      `<h2 style="color: #6366f1;">Nuevo mensaje de contacto</h2>`,
      `<table style="width: 100%; border-collapse: collapse;">`,
      `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Nombre</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${name}</td></tr>`,
      `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Email</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td></tr>`,
      `</table>`,
      `<div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e5e7eb;">`,
      `<p style="margin: 0; white-space: pre-wrap;">${message}</p>`,
      `</div>`,
      `</div>`,
    ].join('\n');

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { email: 'hola@jmmcdevsign.es', name },
        to: [{ email: 'hola@jmmcdevsign.es' }],
        replyTo: { email, name },
        subject: `Contacto desde portfolio: ${name}`,
        htmlContent: html,
      }),
    });

    if (!brevoResponse.ok) {
      console.error('[Contact] Brevo error:', brevoResponse.status);
      return new Response(
        JSON.stringify({ error: 'Error al enviar el mensaje' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db.insert(contactMessages).values({ name, email, message });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Contact] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
