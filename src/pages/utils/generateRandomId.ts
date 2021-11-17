export const randomId = (): string => {
  return `${Math.floor(Math.random() * 100)}${Date.now()}`;
};
