export const prettyDate = (date: string): string => {
  const parsedDate = new Date(date);

  return parsedDate.toLocaleDateString() + ', ' + parsedDate.toLocaleTimeString();
};
