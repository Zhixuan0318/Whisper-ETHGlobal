import { db } from '@/lib/firebaseAdmin';
import signWebhookPayload from '@/utils/signWebhookPayload';
import { gzip } from '@/utils/gzip';

export async function POST(req) {
  try {
    const body = await req.json();
    const { walletAddress, channelId, payload } = body;

    if (!walletAddress || !channelId || !payload) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const ref = db.ref(`${walletAddress.toLowerCase()}/${channelId}/webhook`);
    const snapshot = await ref.once('value');

    if (!snapshot.exists()) {
      return new Response(JSON.stringify({ error: 'Webhook not configured' }), { status: 404 });
    }

    const {
      webhookUrl,
      webhookSecret,
      webhookMethod,
      webhookPayloadCompress,
      webhookCustomHeader = {},
    } = snapshot.val();

    if (!webhookUrl || !webhookSecret) {
      return new Response(JSON.stringify({ error: 'Incomplete webhook settings' }), { status: 400 });
    }

    // Prepare headers
    const headers = {
      ...webhookCustomHeader, // user-provided custom headers
    };

    let bodyToSend;
    if (webhookPayloadCompress) {
      // Compress payload
      const compressedBuffer = await gzip(payload);
      bodyToSend = compressedBuffer;

      // ✅ Sign the compressed buffer
      const signature = signWebhookPayload(compressedBuffer, webhookSecret);
      headers['X-Webhook-Signature'] = signature;

      headers['Content-Encoding'] = 'gzip';
      headers['Content-Type'] = 'application/json';
    } else {
      const jsonString = JSON.stringify(payload);
      bodyToSend = jsonString;

      // ✅ Sign the raw JSON string
      const signature = signWebhookPayload(jsonString, webhookSecret);
      headers['X-Webhook-Signature'] = signature;

      headers['Content-Type'] = 'application/json';
    }

    await fetch(webhookUrl, {
      method: webhookMethod.toUpperCase(),
      headers,
      body: bodyToSend,
    });

    return new Response(JSON.stringify({ message: 'Trigger webhook successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Webhook trigger error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
