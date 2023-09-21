import { Operation } from '../model/operation.model';

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

export const avoidOperationNumberConfusion = (
  operation: Operation
): Operation => {
  return {
    ...operation,
    debit: +operation.debit,
    credit: +operation.credit,
    balance: +operation.balance,
  };
};

// boolean

export const xor = (a: boolean, b: boolean) => {
  return (a && !b) || (!a && b);
};

export const showCreditField = (from: string, to: string): boolean => {
  return (
    ((from === 'actif' || from === 'passif') &&
      (to === 'actif' || to === 'depense' || to === 'passif')) ||
    from === 'depense'
  );
};

export const showDebitField = (from: string, to: string): boolean => {
  return (
    (from === 'actif' &&
      (to === 'actif' || to === 'passif' || to === 'income')) ||
    (from === 'passif' && (to === 'actif' || to === 'income')) ||
    from === 'income'
  );
};
