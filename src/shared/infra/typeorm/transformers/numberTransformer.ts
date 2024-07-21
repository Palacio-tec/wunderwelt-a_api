export const numberTransformer = {
  to: (value: number): number => {
    return value;
  },
  from: (value: string): number => {
    return parseFloat(value);
  }
};
