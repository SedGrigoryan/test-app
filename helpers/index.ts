export const generateRGB = (min: number, max: number) => {
  const result = [];
  for (let i = 0; i < 3; i++) {
    result.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  if (result?.length) {
    return `rgba(${result.join(",")},0.6)`;
  }
  return `rgb(255,255,255)`;
};
