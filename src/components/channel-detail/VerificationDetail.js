'use client';

import { useState } from 'react';
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
  CodeBlockSelect,
  CodeBlockSelectContent,
  CodeBlockSelectItem,
  CodeBlockSelectTrigger,
  CodeBlockSelectValue,
} from '@/components/ui/kibo-ui/code-block';

export default function VerificationDetail({ channel }) {
  const [copied, setCopied] = useState('');

  if (!channel?.webhook?.webhookSecret) return null;

  const { webhookSecret } = channel.webhook;

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(''), 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const InfoBox = ({ label, value }) => (
    <div className="mb-5">
      <div className="text-md font-medium text-gray-800 mb-1">{label}</div>
      <div className="relative bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono text-gray-700 overflow-x-auto flex items-center justify-between">
        <span className="break-all">{value}</span>
        <button
          onClick={() => handleCopy(value)}
          className="ml-4 hover:opacity-80"
        >
          <img
            src={copied === value ? '/copied.png' : '/copy.png'}
            alt="Copy"
            className="w-5 h-5 cursor-pointer"
          />
        </button>
      </div>
    </div>
  );

  // Code snippet for verifying webhook
  const code = [
    {
      language: 'javascript',
      filename: 'verifyWebhook.js',
      code: `import crypto from "crypto";

export function signWebhookPayload(payload, secret) {
  const json = JSON.stringify(payload);
  return crypto.createHmac("sha256", secret).update(json).digest("hex");
}

// Example verification of incoming webhook
export function verifyWebhook(payload, secret, signature) {
  const expected = signWebhookPayload(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expected, "hex")
  );
}

// Usage example
/*
const payload = req.body;
const signature = req.headers["x-webhook-signature"];
const secret = process.env.WEBHOOK_SECRET;

if (verifyWebhook(payload, secret, signature)) {
  console.log("Verified ✅");
} else {
  console.error("Verification failed ❌");
}
*/
`,
    },
  ];

  return (
    <div className="mt-12">
      {/* Title */}
      <h3
        className="text-lg font-semibold text-gray-400 mb-4"
        style={{ fontFamily: 'var(--font-geist-mono)' }}
      >
        HMAC VERIFICATION
      </h3>

      {/* Secret */}
      <InfoBox label="Secret" value={webhookSecret} />

      {/* Example Usage Title */}
      <div className="text-md font-medium text-gray-800 mb-2">
        Example Usage
      </div>

      {/* Code Block */}
      <CodeBlock data={code} defaultValue={code[0].language} className="mb-8">
        <CodeBlockHeader>
          <CodeBlockFiles>
            {(item) => (
              <CodeBlockFilename key={item.language} value={item.language}>
                {item.filename}
              </CodeBlockFilename>
            )}
          </CodeBlockFiles>
          <CodeBlockSelect>
            <CodeBlockSelectTrigger>
              <CodeBlockSelectValue />
            </CodeBlockSelectTrigger>
            <CodeBlockSelectContent>
              {(item) => (
                <CodeBlockSelectItem key={item.language} value={item.language}>
                  {item.language}
                </CodeBlockSelectItem>
              )}
            </CodeBlockSelectContent>
          </CodeBlockSelect>
          <CodeBlockCopyButton
            onCopy={() => handleCopy(code[0].code)}
            onError={() => console.error('Failed to copy code')}
          />
        </CodeBlockHeader>
        <CodeBlockBody>
          {(item) => (
            <CodeBlockItem key={item.language} value={item.language}>
              <CodeBlockContent language={item.language}>
                {item.code}
              </CodeBlockContent>
            </CodeBlockItem>
          )}
        </CodeBlockBody>
      </CodeBlock>
    </div>
  );
}
