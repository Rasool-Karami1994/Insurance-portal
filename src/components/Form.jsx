import React, { useState } from "react";
import DynamicForm from "./DynamicForm";
import { useFetchFormStructure } from "../hooks/useApi";
import DynamicTable from "./DynamicTable";
import { ToastContainer, toast } from "react-toastify";

const FormManager = () => {
  const [selectedForm, setSelectedForm] = useState(null);
  const [showTable, setShowTable] = useState(null);
  const showToastMessage = (text, type) => {
    type === "success"
      ? toast.success(`${text}`, {
          position: "top-left",
          theme: localStorage.theme === "dark" ? "dark" : "light",
        })
      : toast.error(`${text}`, {
          position: "top-left",
          theme: localStorage.theme === "dark" ? "dark" : "light",
        });
  };
  const { data: formStructure, isLoading, isError } = useFetchFormStructure();
  if (isLoading)
    return (
      <div className="loader w-12 h-12 border-4 border-t-4 border-sky-500 rounded-full animate-spin m-5"></div>
    );
  if (isError) {
    showToastMessage(
      "Error loading form structure. Please try again later.",
      "error"
    );
    return <div>Error loading form structure. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto p-6 my-5">
      <ToastContainer />

      <div className="mb-6">
        <label
          htmlFor="formSelector"
          className="block text-gray-500 mb-2 dark:text-gray-400"
        >
          Please select a form to get started.
        </label>
        <select
          id="formSelector"
          className="block text-gray-400 border border-gray-300 rounded w-full py-2 px-3 shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          onChange={(e) => {
            setSelectedForm(e.target.value);
            setShowTable(null);
          }}
        >
          <option value="">Choose your insurance</option>
          {formStructure.map((form) => (
            <option key={form.formId} value={form.formId}>
              {form.title}
            </option>
          ))}
        </select>
      </div>

      {selectedForm && !showTable ? (
        <DynamicForm
          formId={selectedForm}
          formStructure={formStructure}
          isLoading={isLoading}
          isError={isError}
          setShowTable={setShowTable}
          showToastMessage={showToastMessage}
        />
      ) : null}
      {showTable ? <DynamicTable showToastMessage={showToastMessage} /> : null}
    </div>
  );
};

export default FormManager;
