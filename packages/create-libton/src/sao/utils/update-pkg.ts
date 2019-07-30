export interface Answers {
  name: string;
}
export const updatePkg = (answers: Answers, pkg: object) => {
  const { name } = answers;

  return {
    ...pkg,
    name,
  };
};
