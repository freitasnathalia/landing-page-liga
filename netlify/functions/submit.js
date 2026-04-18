/**
 * Netlify Function — proxy para o Google Forms.
 *
 * Recebe o mesmo corpo URLSearchParams que o frontend monta,
 * repassa ao Google Forms e devolve um status HTTP real.
 *
 * Vantagem: sem CORS, sem opaque response — o frontend consegue
 * saber de verdade se o envio foi bem-sucedido ou não.
 */

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScU7L94DZblvDCBwXql4Toz4W7r7QTBqf5JsNMk7QRPMjuVKg/formResponse';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf-8')
      : (event.body || '');

    const response = await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      // Google Forms costuma responder com redirect quando aceita o envio.
      // Seguir o redirect pode gerar um GET subsequente e mascarar sucesso com 4xx.
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body,
    });

    // Em envio aceito, o Google Forms geralmente responde com 302/303.
    if (response.ok || response.status === 302 || response.status === 303) {
      return { statusCode: 200, body: 'ok' };
    }

    return {
      statusCode: response.status,
      body: `Google Forms returned ${response.status}`,
    };
  } catch (error) {
    return {
      statusCode: 502,
      body: `Proxy error: ${error.message}`,
    };
  }
}
