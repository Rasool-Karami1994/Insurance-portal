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
  showToastMessage,
}) => {
  const [formFields, setFormFields] = useState([]);
  const [conditionalVisibility, setConditionalVisibility] = useState({});
  const mutation = useSubmitForm();
  const DRAFT_KEY = `draft_${formId}`;
  useEffect(() => {
    if (formStructure) {
      const form = formStructure.find((form) => form.formId === formId);
      setFormFields(form ? form.fields : []);
    }
  }, [formStructure, formId]);

  const formik = useFormik({
    initialValues: {},
    validationSchema: Yup.object({}),
    onSubmit: async (values) => {
      try {
        console.log(values);
        const response = await mutation.mutateAsync(values);
        console.log(response);
        setShowTable(true);
        formik.resetForm();
        localStorage.removeItem(DRAFT_KEY);
        showToastMessage("Form submited successfully", "success");
      } catch (error) {
        console.error("Error submitting form:", error);
        showToastMessage("Error submitting form", "error");
      }
    },
  });

  useEffect(() => {
    const loadDraft = () => {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        formik.setValues(parsedDraft);
      }
    };

    if (formFields.length > 0) {
      const initialValues = {};
      const validationRules = {};

      formFields.forEach((field) => {
        initialValues[field.id] = "";

        if (field.required) {
          switch (field.type) {
            case "number":
              validationRules[field.id] = Yup.number().required(
                `${field.label} is required`
              );
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

        if (field.visibility) {
          setConditionalVisibility((prev) => ({
            ...prev,
            [field.id]: false,
          }));
        }
      });

      formik.initialValues = initialValues;
      formik.validationSchema = Yup.object(validationRules);

      loadDraft();
    }
  }, [formFields]);

  useEffect(() => {
    const saveDraft = () => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formik.values));
    };

    const timeoutId = setTimeout(saveDraft, 500);
    return () => clearTimeout(timeoutId);
  }, [formik.values]);

  useEffect(() => {
    if (formFields.length > 0) {
      const initialValues = {};
      const validationRules = {};

      formFields.forEach((field) => {
        initialValues[field.id] = "";

        if (field.required) {
          switch (field.type) {
            case "number":
              validationRules[field.id] = Yup.number().required(
                `${field.label} is required`
              );
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
          formik.setFieldValue(field.id, "");
        }
      }
    });
  };

  if (isLoading) return <div>Loading form...</div>;
  if (isError)
    return (
      <div className="loader w-12 h-12 border-4 border-t-4 border-sky-500 rounded-full animate-spin m-5"></div>
    );

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="p-6 space-y-4 bg-gray-100 dark:bg-gray-700 rounded-2xl"
    >
      <h2 className="text-xl font-bold  text-gray-500 dark:text-gray-400 my-4 mb-8 opacity-80">
        {formId.replace("_", " ")}
      </h2>
      {formFields.map((field) => {
        if (field.visibility && !conditionalVisibility[field.id]) return null;

        switch (field.type) {
          case "radio":
            return (
              <div
                key={field.id}
                className="mb-4 textext-gray-400 dark:text-gray-300 "
              >
                <label className="block text-gray-400 dark:text-gray-300 mb-2">
                  {field.label}
                </label>
                <div className="flex justify-items-start gap-4 items-center text-gray-400 dark:text-gray-300">
                  {field.options.map((option, index) => (
                    <div key={index} class="w-20">
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
                </div>
                {formik.errors[field.id] && formik.touched[field.id] && (
                  <div className="text-red-500">{formik.errors[field.id]}</div>
                )}
              </div>
            );

          case "select":
            return (
              <div key={field.id} className="mb-4">
                <label className="block text-gray-400 mb-2 dark:text-gray-300">
                  {field.label}
                </label>
                <select
                  name={field.id}
                  value={formik.values[field.id]}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleConditionalVisibility(field.id, e.target.value);
                  }}
                  className="border border-gray-300 rounded p-2 w-full text-gray-400 dark:text-gray-300"
                >
                  <option value="" className="text-gray-400 dark:text-gray-300">
                    Select an option
                  </option>
                  {field.options.map((option, index) => (
                    <option
                      key={index}
                      value={option}
                      className="text-gray-400 dark:text-gray-300"
                    >
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
                <label className="block text-gray-400 mb-2 dark:text-gray-300">
                  {field.label}
                </label>
                {field.options.map((option, index) => (
                  <div
                    key={index}
                    className="text-gray-400 dark:text-gray-300 py-1.5"
                  >
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
                <legend className="text-lg font-bold text-gray-500 mb-2 dark:text-gray-400 opacity-60">
                  {field.label}
                </legend>
                {field.fields.map((subField) => (
                  <div key={subField.id} className="mb-4">
                    <label className="block text-gray-400 mb-2 dark:text-gray-300">
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
        className="bg-sky-500 text-white py-2 px-4 rounded my-5 w-full cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
