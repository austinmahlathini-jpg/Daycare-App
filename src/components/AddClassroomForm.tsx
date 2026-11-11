"use client";

import { useRef } from "react";
import { addClassroomAction } from "@/app/actions";

export default function AddClassroomForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addClassroomAction(formData);
        formRef.current?.reset(); 
      }}
      className="flex flex-col md:flex-row gap-4 items-end mb-8 p-4 bg-white rounded-lg border shadow-sm"
    >
      <div className="flex-1 w-full">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Classroom Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          placeholder="e.g. Toddlers"
          className="w-full border rounded p-2"
        />
      </div>

      <div className="w-full md:w-32">
        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
          Capacity
        </label>
        <input
          type="number"
          name="capacity"
          id="capacity"
          required
          min="1"
          placeholder="e.g. 10"
          className="w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-black text-white rounded p-2 px-6 hover:bg-gray-800 transition-colors w-full md:w-auto"
      >
        Add
      </button>
    </form>
  );
}

