import axios from "axios";
import { useMutation, useQuery } from "react-query";

const apiUrl = "https://assignment.devotel.io/api/insurance"; // URL پایه API

const fetchFormStructure = async () => {
  const { data } = await axios.get(`${apiUrl}/forms`);
  return data;
};

export const useFetchFormStructure = () => {
  return useQuery("formStructure", fetchFormStructure);
};

export const useSubmitForm = () => {
  return useMutation(async (formData) => {
    const { data } = await axios.post(`${apiUrl}/forms/submit`, formData);
    return data;
  });
};

export const useFetchApplications = () => {
  return useQuery("applications", async () => {
    const { data } = await axios.get(`${apiUrl}/forms/submissions`);
    return data;
  });
};
