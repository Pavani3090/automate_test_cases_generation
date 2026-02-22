import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const generateTests = async (code, testCount) => {
  const res = await axios.post(`${BASE_URL}/generate`, {
    code,
    testCount
  });
  return res.data;
};

export const getHistory = async () => {
  const res = await axios.get(`${BASE_URL}/history`);
  return res.data;
};