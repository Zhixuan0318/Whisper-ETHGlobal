"use client";

import { useState } from "react";
import { toast, Bounce } from "react-toastify";
import { useAccount } from "wagmi";

import CreateFormHeader from "@/components/channel-creation/CreateFormHeader";
import CreateFormFooter from "@/components/channel-creation/CreateFormFooter";
import FormStep1 from "@/components/channel-creation/FormStep1";
import FormStep2 from "@/components/channel-creation/FormStep2";
import Loading from "@/components/channel-creation/Loading";

export default function CreateChannel() {
  const [step, setStep] = useState(1);

  // NEW: separate states for source and dest
  const [sourceChain, setSourceChain] = useState(null);
  const [destChain, setDestChain] = useState(null);

  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookMethod, setWebhookMethod] = useState("POST");
  const [compressionEnabled, setCompressionEnabled] = useState(false);
  const [customHeaders, setCustomHeaders] = useState([
    { key: "Content-Type", value: "application/json", showValue: false },
  ]);
  const [pendingPayload, setPendingPayload] = useState(null);

  const { address: walletAddress } = useAccount();

  const transformHeadersToObject = () =>
    customHeaders.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {});

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <FormStep1
            sourceChain={sourceChain}
            setSourceChain={setSourceChain}
            destChain={destChain}
            setDestChain={setDestChain}
          />
        );
      case 2:
        return (
          <FormStep2
            sourceChain={sourceChain}
            destChain={destChain}
            webhookUrl={webhookUrl}
            setWebhookUrl={setWebhookUrl}
            webhookMethod={webhookMethod}
            setWebhookMethod={setWebhookMethod}
            compressionEnabled={compressionEnabled}
            setCompressionEnabled={setCompressionEnabled}
            customHeaders={customHeaders}
            setCustomHeaders={setCustomHeaders}
          />
        );
      case 3:
        return <Loading payload={pendingPayload} />;
      default:
        return null;
    }
  };

  const getFooterProps = () => {
    switch (step) {
      case 1:
        return {
          buttonText: "Next",
          clickAction: () => {
            if (!sourceChain || !destChain) {
              toast.error("Please choose both SOURCE and DESTINATION chains!", {
                position: "top-center",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
              });
              return;
            }
            setStep(2);
          },
          showBack: false,
        };

      case 2:
        return {
          buttonText: "Create",
          clickAction: () => {
            if (!webhookUrl.trim()) {
              toast.error("Empty destination webhook URL!", {
                position: "top-center",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
              });
              return;
            }

            if (!walletAddress) {
              toast.error("Connect your wallet first!", {
                position: "top-center",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
              });
              return;
            }

            const payload = {
              walletAddress,
              sourceChain,
              destinationChain: destChain,
              webhookURL: webhookUrl,
              webhookMethod,
              webhookPayloadCompress: compressionEnabled,
              webhookCustomHeader: transformHeadersToObject(),
            };

            setPendingPayload(payload);
            setStep(3); // Show loading + trigger actual API call in Loading component
          },
          showBack: true,
          backAction: () => setStep(1),
        };

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Select source and destination chains";
      case 2:
        return "Set up your webhook";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {step !== 3 && <CreateFormHeader stepTitle={getStepTitle()} />}
      <main className="flex-1">{renderStepContent()}</main>
      {step !== 3 && (
        <CreateFormFooter
          buttonText={getFooterProps()?.buttonText}
          clickAction={getFooterProps()?.clickAction}
          showBack={getFooterProps()?.showBack}
          backAction={getFooterProps()?.backAction}
        />
      )}
    </div>
  );
}
