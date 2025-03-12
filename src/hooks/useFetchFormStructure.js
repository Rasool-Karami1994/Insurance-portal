import { useQuery } from "react-query";
import axios from "axios";

const BASE_URL = "https://assignment.devotel.io";

const fetchFormStructure = async () => {
  const { data } = await axios.get(`${BASE_URL}/api/insurance/forms`);
  return data;
};

export const useFetchFormStructure = () => {
  return useQuery("formStructure", fetchFormStructure);
};
