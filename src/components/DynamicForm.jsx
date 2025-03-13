import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSubmitForm } from "../hooks/useApi";
const DynamicForm = ({
  formId,
  formStructure,
  isError,
  isLoading,
  setShowTable,
}) => {
  const [formFields, setFormFields] = useState([]);
  const [conditionalVisibility, setConditionalVisibility] = useState({});
  const mutation = useSubmitForm();
  const [formState, setFormState] = useState();

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("formData"));
    if (savedData) setFormState(savedData);
  }, []);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formState));
  }, [formState]);

  useEffect(() => {
    if (formStructure) {
      const form = formStructure.find((form) => form.formId === formId);
      setFormFields(form ? form.fields : []);
    }
  }, [formStructure, formId]);

  // Formik setup
  const formik = useFormik({
    initialValues: {}, // Populated dynamically
    validationSchema: Yup.object({}), // Populated dynamically
    onSubmit: async (values) => {
      try {
        console.log(values);
        const response = await mutation.mutateAsync(values);
        console.log(response);
        setShowTable(true);
        formik.resetForm(); // ریست فرم بعد از ارسال
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  // Dynamically populate initialValues and validationSchema
  useEffect(() => {
    if (formFields.length > 0) {
      const initialValues = {};
      const validationRules = {};

      formFields.forEach((field) => {
        // Set default values
        initialValues[field.id] = "";

        // Add validation if required
        if (field.required) {
          switch (field.type) {
            case "number":
              const { min, max } = field.validation || {};
              validationRules[field.id] = Yup.number()
                .required(`${field.label} is required`)
                .min(min || 0, `${field.label} must be at least ${min}`)
                .max(max || Infinity, `${field.label} must be at most ${max}`);
              break;
            case "text":
              validationRules[field.id] = Yup.string().required(
                `${field.label} is required`
              );
              break;
            case "select":
              validationRules[field.id] = Yup.string().required(
                `${field.label} is required`
              );
              break;
            default:
              validationRules[field.id] = Yup.string().required(
                `${field.label} is required`
              );
          }
        }

        // Handle conditional fields
        if (field.visibility) {
          setConditionalVisibility((prev) => ({
            ...prev,
            [field.id]: false,
          }));
        }
      });

      formik.initialValues = initialValues;
      formik.validationSchema = Yup.object(validationRules);
    }
  }, [formFields]);

  // Handle visibility logic for conditional fields
  const handleConditionalVisibility = (fieldId, value) => {
    formFields.forEach((field) => {
      if (field.visibility && field.visibility.dependsOn === fieldId) {
        const isVisible =
          field.visibility.condition === "equals" &&
          field.visibility.value === value;
        setConditionalVisibility((prev) => ({
          ...prev,
          [field.id]: isVisible,
        }));
        if (!isVisible) {
          formik.setFieldValue(field.id, ""); // Clear the field value if it's hidden
        }
      }
    });
  };

  if (isLoading) return <div>Loading form...</div>;
  if (isError)
    return <div>Error loading form structure. Please try again later.</div>;

  return (
    <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">{formId.replace("_", " ")}</h2>
      {formFields.map((field) => {
        if (field.visibility && !conditionalVisibility[field.id]) return null; // Skip hidden fields

        switch (field.type) {
          case "radio":
            return (
              <div key={field.id} className="mb-4">
                <label className="block text-gray-700">{field.label}</label>
                {field.options.map((option, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      name={field.id}
                      value={option}
                      checked={formik.values[field.id] === option}
                      onChange={(e) => {
                        formik.handleChange(e);
                        handleConditionalVisibility(field.id, e.target.value);
                      }}
                    />
                    <label className="ml-2">{option}</label>
                  </div>
                ))}
                {formik.errors[field.id] && formik.touched[field.id] && (
                  <div className="text-red-500">{formik.errors[field.id]}</div>
                )}
              </div>
            );

          case "select":
            return (
              <div key={field.id} className="mb-4">
                <label className="block text-gray-700">{field.label}</label>
                <select
                  name={field.id}
                  value={formik.values[field.id]}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleConditionalVisibility(field.id, e.target.value);
                  }}
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="">Select an option</option>
                  {field.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {formik.errors[field.id] && formik.touched[field.id] && (
                  <div className="text-red-500">{formik.errors[field.id]}</div>
                )}
              </div>
            );

          case "checkbox":
            return (
              <div key={field.id} className="mb-4">
                <label className="block text-gray-700">{field.label}</label>
                {field.options.map((option, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      name={`${field.id}.${option}`}
                      value={option}
                      onChange={formik.handleChange}
                    />
                    <label className="ml-2">{option}</label>
                  </div>
                ))}
              </div>
            );

          case "group":
            return (
              <fieldset
                key={field.id}
                className="border border-gray-300 p-4 rounded"
              >
                <legend className="text-lg font-bold">{field.label}</legend>
                {field.fields.map((subField) => (
                  <div key={subField.id} className="mb-4">
                    <label className="block text-gray-700">
                      {subField.label}
                    </label>
                    <input
                      type={subField.type}
                      name={subField.id}
                      value={formik.values[subField.id] || ""}
                      onChange={formik.handleChange}
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </div>
                ))}
              </fieldset>
            );

          default:
            return null;
        }
      })}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
