const getMockData = async (sport: string) => {
  const data = await import(`../mock/${sport}.json`);
  return data.default;
};

export default getMockData;
