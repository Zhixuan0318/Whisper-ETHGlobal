"use client";

import Image from "next/image";

export default function FormStep2({
  webhookUrl,
  setWebhookUrl,
  webhookMethod,
  setWebhookMethod,
  compressionEnabled,
  setCompressionEnabled,
  customHeaders,
  setCustomHeaders,
}) {
  // Ensure headers are always defined
  customHeaders = customHeaders ?? [];

  const handleAddHeader = () => {
    setCustomHeaders([
      ...customHeaders,
      { key: "", value: "", showValue: false },
    ]);
  };

  const handleRemoveHeader = (index) => {
    setCustomHeaders(customHeaders.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (index, field, value) => {
    const updated = [...customHeaders];
    updated[index][field] = value;
    setCustomHeaders(updated);
  };

  const toggleShowValue = (index, show) => {
    const updated = [...customHeaders];
    updated[index].showValue = show;
    setCustomHeaders(updated);
  };

  return (
    <div className="w-full flex flex-col items-center px-4 py-8 space-y-6">
      {/* Webhook Icon */}
      <Image
        src="/webhook.png"
        alt="Webhook Icon"
        width={110}
        height={110}
        className="mb-6 mt-8"
      />

      {/* URL + Method */}
      <div className="flex flex-col md:flex-row items-center gap-3 w-full max-w-3xl">
        <input
          type="text"
          placeholder="Enter your destination URL"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          className="flex-1 h-16 px-5 border border-gray-300 rounded-2xl w-full text-md"
        />
        <select
          value={webhookMethod}
          onChange={(e) => setWebhookMethod(e.target.value)}
          className="h-16 px-4 pr-10 bg-white border border-gray-300 text-gray-800 text-md font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
        >
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
        </select>
      </div>

      {/* Compression Toggle */}
      <div className="flex items-center space-x-2 max-w-3xl w-full justify-start">
        <label className="flex items-center space-x-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={compressionEnabled}
            onChange={(e) => setCompressionEnabled(e.target.checked)}
            className="h-5 w-5 cursor-pointer"
          />
          <span className="text-[15px]">Enable payload compression</span>
        </label>
        <span className="bg-gray-100 text-gray-700 text-md px-4 py-0.5 rounded-full">
          Gzip
        </span>
      </div>

      {/* Custom Headers */}
      <div className="w-full max-w-3xl space-y-4">
        <h3 className="text-left text-xl font-medium text-gray-800 mt-8">
          Custom Headers
        </h3>

        {customHeaders.map((header, index) => (
          <div key={index} className="flex items-start gap-2 relative">
            {/* Header Key */}
            <div className="flex-1">
              <label className="text-sm text-gray-600">Header Key</label>
              <input
                type="text"
                value={header.key}
                onChange={(e) =>
                  handleHeaderChange(index, "key", e.target.value)
                }
                className="w-full h-12 px-3 mt-1 border border-gray-300 rounded-xl text-sm"
              />
            </div>

            {/* Header Value */}
            <div className="flex-1">
              <label className="text-sm text-gray-600">Header Value</label>
              <input
                type={header.showValue ? "text" : "password"}
                value={header.value}
                onChange={(e) =>
                  handleHeaderChange(index, "value", e.target.value)
                }
                onFocus={() => toggleShowValue(index, true)}
                onBlur={() => toggleShowValue(index, false)}
                className="w-full h-12 px-3 mt-1 border border-gray-300 rounded-xl text-sm"
              />
            </div>

            {/* Delete Icon */}
            {index !== 0 && (
              <button
                onClick={() => handleRemoveHeader(index)}
                className="absolute -right-8 top-8 p-2 hover:scale-105 transition-transform"
              >
                <Image
                  src="/delete.png"
                  alt="Delete"
                  width={18}
                  height={18}
                  className="mt-1 cursor-pointer"
                />
              </button>
            )}
          </div>
        ))}

        {/* Add Header Button */}
        <button
          onClick={handleAddHeader}
          className="mt-6 flex justify-center items-center space-x-2 text-sm font-semibold bg-white shadow-sm border border-gray-200 w-full h-12 rounded-2xl text-gray-600 hover:text-gray-800 cursor-pointer transition-opacity"
        >
          <Image src="/add.png" alt="Add" width={18} height={18} />
          <span>Add a custom header</span>
        </button>
      </div>
    </div>
  );
}
