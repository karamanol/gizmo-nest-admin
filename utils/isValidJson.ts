export const isValidJSON = (value: any) => {
  if (value === "") return true;
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};
