"use client";

import { useRef } from "react";
import { addChildAction } from "@/app/actions";

export default function AddChildForm() {
  // Create a reference to the actual HTML <form> element in the DOM.
  // We need this so we can manually clear the form after submission.
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      // The action prop is a Next.js 14 feature. Instead of using onSubmit 
      // and manually calling fetch(), we pass the Server Action directly.
      // React handles the network request and loading states.
      action={async (formData) => {
        // 1. Send the data to the server
        await addChildAction(formData);
        // 2. Clear the input field so the user can type the next name
        formRef.current?.reset();
      }}
      className="flex gap-4 items-end mb-8 p-4 bg-white rounded-lg border shadow-sm"
    >
      <div className="flex-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Child's Name
        </label>
        <input
          type="text"
          name="name" // The "name" attribute is crucial; it's how formData.get() finds it
          id="name"
          required
          placeholder="e.g. Bundles of Joy"
          className="w-full border rounded p-2"
        />
      </div>
      <button
        type="submit"
        className="bg-black text-white rounded p-2 px-6 hover:bg-gray-800 transition-colors"
      >
        Add Child
      </button>
    </form>
  );
}