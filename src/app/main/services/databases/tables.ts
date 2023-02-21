import { Account } from '../../model/account.model';

export const tables = {
  account: {
    name: 'ACCOUNT',
    columns: [
      { name: 'ID', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
      { name: 'ACCOUNT_NAME', type: 'VARCHAR(50)' },
      { name: 'BALANCE', type: 'REAL' },
      { name: 'IS_MAIN', type: 'INTEGER(1)' },
      { name: 'TYPE', type: 'VARCHAR(50)' },
      { name: 'PARENT_ID', type: 'INTEGER' },
      { name: 'PATH', type: 'TEXT' },
      { name: 'IS_LEAF', type: 'INTEGER(1)' },
    ],
  },

  transaction: {
    name: 'OPERATION',
    columns: [
      { name: 'ID', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
      { name: 'NUM_TRANS', type: 'VARCHAR(15)' },
      { name: 'TIME', type: 'VARCHAR(21)' },
      { name: 'DESCRIPTION', type: 'REAL' },
      { name: 'STATUT', type: 'VARCHAR(1)' },
      { name: 'CREDIT', type: 'REAL' },
      { name: 'DEBIT', type: 'REAL' },
      { name: 'BALANCE', type: 'REAL' },
      { name: 'ID_ACCOUNT', type: 'INTEGER' },
      { name: 'TRANSFER', type: 'TEXT' },
    ],
  },
};

export const INITIAL_ACCOUNT_DATA: Account[] = [
  {
    id: -1,
    acountName: 'actifs',
    totalAccount: 0,
    isMain: true,
    type: 'actif',
    parentId: 0,
    path: 'actifs',
    isLeaf: true,
  },
  {
    id: -1,
    acountName: 'depense',
    totalAccount: 0,
    isMain: true,
    type: 'depense',
    parentId: 0,
    path: 'depense',
    isLeaf: true,
  },
  {
    id: -1,
    acountName: 'passifs',
    totalAccount: 0,
    isMain: true,
    type: 'passif',
    parentId: 0,
    path: 'passifs',
    isLeaf: true,
  },
  {
    id: -1,
    acountName: 'income',
    totalAccount: 0,
    isMain: true,
    type: 'income',
    parentId: 0,
    path: 'income',
    isLeaf: true,
  },
  {
    id: -1,
    acountName: 'blance',
    totalAccount: 0,
    isMain: false,
    type: 'balance',
    parentId: 0,
    path: 'balance',
    isLeaf: true,
  },
];

export const INSERT_INITIAL_ACCOUNT_DATA = `INSERT INTO ${
  tables.account.name
} (${tables.account.columns
  .filter((el, ind) => ind !== 0)
  .map((el) => el.name)})  VALUES ${INITIAL_ACCOUNT_DATA.map((acc) => {
  return `('${acc.acountName}', ${acc.totalAccount}, ${acc.isMain ? 1 : 0}, '${
    acc.type
  }', ${acc.parentId}, '${acc.path}' , ${acc.isMain ? 1 : 0})`;
})};`;

export const CREATE_ACCOUNT_TABLE = `CREATE TABLE IF NOT EXISTS ${
  tables.account.name
} (${tables.account.columns.map((el) => el.name + ' ' + el.type)});`;

export const CREATE_TRANSACTION_TABLE = ` CREATE TABLE IF NOT EXISTS ${
  tables.transaction.name
} (${tables.transaction.columns.map((el) => el.name + ' ' + el.type)});`;
