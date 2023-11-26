import { el } from 'date-fns/locale';
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
      { name: 'PROFILE', type: 'VARCHAR(35)' },
      { name: 'ATTACHMENT', type: 'TEXT' },
    ],
  },
  flags: {
    name: 'FLAGS',
    columns: [
      { name: 'FLAG_NAME', type: 'TEXT PRIMARY KEY' },
      { name: 'IS_FLAG_SETTED', type: 'INTEGER(1)' },
    ],
  },

  profiles: {
    name: 'PROFIL',
    columns: [
      { name: 'mail', type: 'VARCHAR(35) PRIMARY KEY' },
      { name: 'FIRST_NAME', type: 'VARCHAR(25)' },
      { name: 'LAST_NAME', type: 'VARCHAR(25)' },
      { name: 'PHONE', type: 'VARCHAR(25)' },
      { name: 'IS_ADMIN', type: 'INTEGER(1)' },
    ],
  },

  authentication: {
    name: 'AUTH',
    columns: [
      { name: 'mail', type: 'VARCHAR(35)' },
      { name: 'password', type: 'VARCHAR(56)' },
      { name: 'DATE', type: 'VARCHAR(21)' },
    ],
  },

  patchquery: {
    name: 'PATCH_SQL',
    columns: [
      { name: 'CODE', type: 'VARCHAR(35) PRIMARY KEY' },
      { name: 'QUERY', type: 'TEXT' },
    ],
  },

  rappel: {
    name: 'RAPPEL',
    columns: [
      { name: 'ID', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
      { name: 'ACCOUNT_ID ', type: 'INTEGER' }, // ACCOUNT CIBLE
      { name: 'EVENT_DATE', type: 'VARCHAR(21)' }, // ACCOUNT (A), OPERATION (O), EVENT_PLANE(E)
      { name: 'NOTIFY_DATE', type: 'VARCHAR(21)' }, // IF EVENT_PLANE SET DATE
      { name: 'IS_PERIODE', type: 'INTEGER(1)' }, // LESS OR EQUAL TO number
      { name: 'PERIODE', type: 'VARCHAR(2)' }, // ENTITY ID (Operation or Account id)
      { name: 'DESCRIPTION', type: 'TEXT' }, // description
      { name: 'IS_ACTIVE', type: 'INTEGER(1)' }, // description
    ],
  },

  notification: {
    name: 'NOTIFICATION',
    columns: [
      { name: 'ID', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
      { name: 'ACCOUNT_ID ', type: 'INTEGER' }, // ACCOUNT CIBLE
      { name: 'RAPPEL_ID ', type: 'INTEGER' }, // ACCOUNT CIBLE
      { name: 'NOTIFY_DATE_BEGIN', type: 'VARCHAR(21)' }, // ACCOUNT (A), OPERATION (O), EVENT_PLANE(E)
      { name: 'IS_OPEN', type: 'INTEGER(1)' }, // description
      { name: 'EVENT_DATE', type: 'VARCHAR(21)' }, // ACCOUNT (A), OPERATION (O), EVENT_PLANE(E)
    ],
  },
};

export const views = {
  transactionView: {
    name: 'OPERATION_VIEW',
    DLL: 'CREATE VIEW OPERATION_VIEW AS SELECT OP.* , ACC.TYPE , ACC.PATH FROM OPERATION OP LEFT OUTER JOIN ACCOUNT ACC ON OP.ID_ACCOUNT = ACC.ID',
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
    resume: { debit: 0, credit: 0, sons: 0 },
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
    resume: { debit: 0, credit: 0, sons: 0 },
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
    resume: { debit: 0, credit: 0, sons: 0 },
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
    resume: { debit: 0, credit: 0, sons: 0 },
  },
];

const INITIAL_FLAGS_DATA = [
  { flagName: 'DATA_ACCOUNT_SETTED', isFlagSetted: 0 },
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

export const CREATE_FLAGS = ` CREATE TABLE  IF NOT EXISTS ${
  tables.flags.name
} (${tables.flags.columns.map((el) => el.name + ' ' + el.type)});`;

export const CREATE_TRANSACTION_VIEW = `${views.transactionView.DLL}`;

export const INSERT_FLAGS = `INSERT INTO ${
  tables.flags.name
} (${tables.flags.columns
  .map((el) => el.name)
  .join(',')}) VALUES ${INITIAL_FLAGS_DATA.map(
  (el) => `('${el.flagName}', ${el.isFlagSetted})`
).join(',')} `;

export const CREATE_PROFILES_TABLE = `CREATE TABLE  IF NOT EXISTS ${
  tables.profiles.name
} (${tables.profiles.columns.map((el) => el.name + ' ' + el.type)});`;

export const CREATE_AUTH_TABLE = `CREATE TABLE  IF NOT EXISTS ${
  tables.authentication.name
} (${tables.authentication.columns.map((el) => el.name + ' ' + el.type)});`;

export const CREATE_PATCH_TABLE = `CREATE TABLE  IF NOT EXISTS ${
  tables.patchquery.name
} (${tables.patchquery.columns.map((el) => el.name + ' ' + el.type)});`;

// RAPPEL
export const CREATE_RAPPEL_TABLE = `CREATE TABLE  IF NOT EXISTS ${
  tables.rappel.name
} (${tables.rappel.columns.map((el) => el.name + ' ' + el.type)});`;

export const CREATE_NOTIFICATION_TABLE = `CREATE TABLE  IF NOT EXISTS ${
  tables.notification.name
} (${tables.notification.columns.map((el) => el.name + ' ' + el.type)});`;

//ALTER TABLE OPERATION  ADD PROFILE  VARCHAR(35);
//update OPERATION set PROFILE = 'bnaitdjoudi@gmail.com';

//CREATE TABLE  IF NOT EXISTS NOTIFICATION_PLAN (ID INTEGER PRIMARY KEY AUTOINCREMENT, LEVEL VARCHER(1), TYPE VARCHER(1), PLANE_DATE  VARCHAR(21), GOE REAL, LOE REAL, ENTITY_ID INTEGER, DESCRIPTION TEXT, IS_ACTIVE INTEGER(1), PROFILE VARCHAR(35) );
//CREATE TABLE  IF NOT EXISTS NOTIFICATION (ID INTEGER PRIMARY KEY AUTOINCREMENT, LEVEL VARCHAR(1), TYPE VARCHAR(1), ENTITY_ID INTEGER, DESCRIPTION TEXT, ID_PLANE INTEGER, PROFILE VARCHAR(35));
