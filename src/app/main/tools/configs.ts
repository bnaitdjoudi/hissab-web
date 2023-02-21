export interface DataArray {
  [key: string]: any;
}

export const excludedAccountTypeTransferTo: DataArray = {
  actif: ['actif', 'balance'],
  depense: ['depense'],
  passif: ['passif', 'balance'],
  income: ['income'],
};
