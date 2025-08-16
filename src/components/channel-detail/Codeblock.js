'use client';

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

export default function Codeblock({ endpoint, apiKey, walletAddress, channelId }) {
  const code = [
    {
      language: 'javascript',
      filename: 'fetch.js',
      code: `fetch("${endpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    walletAddress: "${walletAddress}",
    channelId: "${channelId}",
    apiKey: "${apiKey}", // ⚠️ WARNING: Hardcoded secret
    payload: { message: "Hello World" }
  })
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("Error:", err));`,
    },
    {
      language: 'typescript',
      filename: 'axios.ts',
      code: `import axios from "axios";

const response = await axios.post("${endpoint}", {
  walletAddress: "${walletAddress}",
  channelId: "${channelId}",
  apiKey: "${apiKey}", // ⚠️ WARNING: Hardcoded secret
  payload: { message: "Hello World" }
});

console.log(response.data);`,
    },
  ];

  return (
    <CodeBlock data={code} defaultValue={code[0].language} className="mb-10">
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
          onCopy={() => console.log('Copied code to clipboard')}
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
  );
}
