const BASE_URL = "https://api.the-odds-api.com/v4/sports/";

const getLiveData = async (sport: string) => {
  const url = `${BASE_URL}${sport}/odds/?apiKey=90a3dea2a972443b535cd90230273ea8&regions=au`;
  const response = await fetch(url);

  return await response.json();
};

export default getLiveData;
