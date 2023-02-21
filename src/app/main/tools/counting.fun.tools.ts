const actifFunctionBalance = (
  debit: number,
  credit: number,
  balance: number
): number => {
  return debit + (!!balance ? balance : 0) - credit;
};

const mapFunction = new Map<
  string,
  (debit: number, credit: number, balance: number) => number
>([
  ['actif', actifFunctionBalance],
  ['passif', actifFunctionBalance],
  ['income', actifFunctionBalance],
]);

type FunctionMap = {
  [key: string]:
    | ((debit: number, credit: number, balance: number) => number)
    | undefined;
};

export const functionMap: FunctionMap = {
  actif: mapFunction.get('actif'),
  income: mapFunction.get('actif'),
  passif: mapFunction.get('passif'),
  depense: mapFunction.get('passif'),
};

type BalanceFunMap = {
  [key: string]: (debit: number, credit: number) => number;
};

export const localBalanceFunMap: BalanceFunMap = {
  actif: (debit: number, credit: number) => debit - credit,
  passif: (debit: number, credit: number) => debit - credit,
  income: (debit: number, credit: number) => debit - credit,
  depense: (debit: number, credit: number) => debit - credit,
};

export const deleteOpBalanceFunMap: BalanceFunMap = {
  actif: (debit: number, credit: number) => credit - debit,
  passif: (debit: number, credit: number) => credit - debit,
  income: (debit: number, credit: number) => credit - debit,
  depense: (debit: number, credit: number) => credit - debit,
};
