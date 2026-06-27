import type { APIRoute } from 'astro';

const BREVO_API = 'https://api.brevo.com/v3/smtp/email';

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

    const apiKey = import.meta.env.BREVO_API_KEY;

    if (!apiKey) {
      console.error('[Contact] BREVO_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Error interno del servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(BREVO_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { email: 'jmmolins87@gmail.com', name: 'Juanma MC' },
        to: [{ email: 'hola@jmmcdevsign.es' }],
        replyTo: { email, name },
        subject: `Nuevo mensaje de ${name}`,
        htmlContent: `
          <h2>Nuevo contacto desde el portfolio</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;font-weight:bold;">Nombre</td><td style="padding:8px;">${name}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${email}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Mensaje</td><td style="padding:8px;">${message}</td></tr>
          </table>
        `,
      }),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Error al enviar el mensaje' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
