"use client";

export default function CreateFormFooter({
  buttonText,
  clickAction,
  showBack = false,
  backAction,
}) {
  return (
    <footer className="h-[9vh] w-full flex items-center justify-between px-8 bg-white border-t border-gray-200">
      {/* Back Button (only shows in step 2) */}
      {showBack ? (
        <span
          onClick={backAction}
          className="underline text-gray-600 hover:text-gray-800 cursor-pointer text-md"
        >
          Back
        </span>
      ) : (
        <div /> // maintains spacing
      )}

      {/* Forward/Submit Button */}
      <button
        onClick={clickAction}
        className="cursor-pointer bg-black text-white rounded-2xl px-18 py-2.5 text-lg font-medium hover:scale-102 transition-transform"
      >
        {buttonText}
      </button>
    </footer>
  );
}
