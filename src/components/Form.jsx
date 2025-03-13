import React, { useState } from "react";
import DynamicForm from "./DynamicForm";
import { useFetchFormStructure } from "../hooks/useApi";
import { useSelector } from "react-redux";
import DynamicTable from "./DynamicTable";

const FormManager = () => {
  const [selectedForm, setSelectedForm] = useState(null);
  const [showTable, setShowTable] = useState(null);

  const submissions = useSelector((state) => state?.insurance);
  console.log(submissions);
  const { data: formStructure, isLoading, isError } = useFetchFormStructure();
  if (isLoading) return <div>Loading form...</div>;
  if (isError)
    return <div>Error loading form structure. Please try again later.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Smart Insurance Portal</h1>

      {/* Form Selector */}
      <div className="mb-6">
        <label htmlFor="formSelector" className="block text-gray-700 mb-2">
          Select a Form to Fill:
        </label>
        <select
          id="formSelector"
          className="border border-gray-300 rounded p-2 w-full"
          onChange={(e) => setSelectedForm(e.target.value)}
        >
          <option value="">-- Select a Form --</option>
          {formStructure.map((form) => (
            <option key={form.formId} value={form.formId}>
              {form.title}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Form */}
      {selectedForm && !showTable ? (
        <DynamicForm
          formId={selectedForm}
          formStructure={formStructure}
          isLoading={isLoading}
          isError={isError}
          setShowTable={setShowTable}
        />
      ) : (
        <div className="text-gray-500">
          Please select a form to get started.
        </div>
      )}
      {showTable ? <DynamicTable /> : null}
    </div>
  );
};

export default FormManager;
