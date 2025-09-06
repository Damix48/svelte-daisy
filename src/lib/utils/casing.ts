const toCamelCase = (str: string): string => {
  return str.replace(/[-_ ]+./g, (match) => match.charAt(match.length - 1).toUpperCase()).replace(/^[A-Z]/, (match) => match.toLowerCase());
};

export { toCamelCase };
