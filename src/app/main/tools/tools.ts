export const parseFloatTool = (val: any): number => {
  return parseFloat(val.toString().replace(/,/g, ''));
};

export const pathToAllParentUniquePath = (path: string): string[] => {
  let uniquePaths: string[] = [];

  let pathArray: string[] = path.split('/');

  for (let i = pathArray.length; i > 0; i--) {
    uniquePaths = [...uniquePaths, pathArray.slice(0, i).join('/')];
  }

  return uniquePaths;
};
