const baseUrl = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

const getAllDoctors = async () => {
  const request = await fetch(baseUrl);
  const response = await request.json();
  return response;
};

export default getAllDoctors;
