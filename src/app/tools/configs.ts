export interface DataArray {
  [key: string]: any;
}

export const excludedAccountTypeTransferTo: DataArray = {
  actif: ['actif', 'balance'],
  depense: ['depense'],
  passif: ['passif', 'balance'],
  income: ['income'],
};

export const dump = `BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "FLAGS" (
	"FLAG_NAME"	TEXT,
	"IS_FLAG_SETTED"	INTEGER(1),
	PRIMARY KEY("FLAG_NAME")
);
CREATE TABLE IF NOT EXISTS "ACCOUNT" (
	"ID"	INTEGER,
	"ACCOUNT_NAME"	VARCHAR(50),
	"BALANCE"	REAL,
	"IS_MAIN"	INTEGER(1),
	"TYPE"	VARCHAR(50),
	"PARENT_ID"	INTEGER,
	"PATH"	TEXT,
	"IS_LEAF"	INTEGER(1),
	PRIMARY KEY("ID" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "OPERATION" (
	"ID"	INTEGER,
	"NUM_TRANS"	VARCHAR(15),
	"TIME"	VARCHAR(21),
	"DESCRIPTION"	REAL,
	"STATUT"	VARCHAR(1),
	"CREDIT"	REAL,
	"DEBIT"	REAL,
	"BALANCE"	REAL,
	"ID_ACCOUNT"	INTEGER,
	"TRANSFER"	TEXT,
	"PROFILE"	VARCHAR(35),
	"ATTACHMENT"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "PROFIL" (
	"mail"	VARCHAR(35),
	"FIRST_NAME"	VARCHAR(25),
	"LAST_NAME"	VARCHAR(25),
	"PHONE"	VARCHAR(25),
	"IS_ADMIN"	INTEGER(1),
	PRIMARY KEY("mail")
);
CREATE TABLE IF NOT EXISTS "AUTH" (
	"mail"	VARCHAR(35),
	"password"	VARCHAR(56),
	"DATE"	VARCHAR(21)
);
CREATE TABLE IF NOT EXISTS "PATCH_SQL" (
	"CODE"	VARCHAR(35),
	"QUERY"	TEXT,
	PRIMARY KEY("CODE")
);
CREATE TABLE IF NOT EXISTS "RAPPEL" (
	"ID"	INTEGER,
	"ACCOUNT_ID"	INTEGER,
	"EVENT_DATE"	VARCHAR(21),
	"NOTIFY_DATE"	VARCHAR(21),
	"IS_PERIODE"	INTEGER(1),
	"PERIODE"	VARCHAR(2),
	"DESCRIPTION"	TEXT,
	"IS_ACTIVE"	INTEGER(1),
	PRIMARY KEY("ID" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "NOTIFICATION" (
	"ID"	INTEGER,
	"ACCOUNT_ID"	INTEGER,
	"RAPPEL_ID"	INTEGER,
	"NOTIFY_DATE_BEGIN"	VARCHAR(21),
	"IS_OPEN"	INTEGER(1),
	"EVENT_DATE"	VARCHAR(21),
	PRIMARY KEY("ID" AUTOINCREMENT)
);
INSERT INTO "FLAGS" ("FLAG_NAME","IS_FLAG_SETTED") VALUES ('DATA_ACCOUNT_SETTED',1);
INSERT INTO "FLAGS" ("FLAG_NAME","IS_FLAG_SETTED") VALUES ('PROFIL_SIGNED_UP',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (1,'actifs',457610.19,1,'actif',0,'actifs',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (2,'depense',0.0,1,'depense',0,'depense',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (3,'passifs',0.0,1,'passif',0,'passifs',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (4,'income',457610.19,1,'income',0,'income',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (5,'Comptes Bancaires Reguliers',457610.19,0,'actif',1,'actifs/Comptes Bancaires Reguliers',0);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (6,'Comptes Fatima',8200.0,0,'actif',5,'actifs/Comptes Bancaires Reguliers/Comptes Fatima',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (7,'Comptes Brahim Desjardins',455479.6,0,'actif',5,'actifs/Comptes Bancaires Reguliers/Comptes Brahim Desjardins',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (8,'Comptes Brahim RBC',-6069.41,0,'actif',5,'actifs/Comptes Bancaires Reguliers/Comptes Brahim RBC',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (9,'Comptes REER',0.0,0,'actif',1,'actifs/Comptes REER',0);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (10,'Comptes REER Fatima',0.0,0,'actif',9,'actifs/Comptes REER/Comptes REER Fatima',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (11,'Comptes REER Brahim',0.0,0,'actif',9,'actifs/Comptes REER/Comptes REER Brahim',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (12,'Comptes CELI',0.0,0,'actif',1,'actifs/Comptes CELI',0);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (13,'Comptes CELI Fatima',0.0,0,'actif',12,'actifs/Comptes CELI/Comptes CELI Fatima',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (14,'Comptes CELI Brahim',0.0,0,'actif',12,'actifs/Comptes CELI/Comptes CELI Brahim',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (15,'Cash',0.0,0,'actif',1,'actifs/Cash',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (16,'Media',0.0,0,'depense',2,'depense/Media',0);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (17,'Internet',0.0,0,'depense',16,'depense/Media/Internet',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (18,'telephone',0.0,0,'depense',16,'depense/Media/Internet',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (19,'Auto',0.0,0,'depense',2,'depense/Auto',0);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (20,'Gas',0.0,0,'depense',19,'depense/Auto/Gas',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (21,'Soins',0.0,0,'depense',2,'depense/Soins',0);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (22,'Medicament',0.0,0,'depense',21,'depense/Soins/Medicament',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (23,'Consultation',0.0,0,'depense',21,'depense/Soins/Consultation',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (24,'Divertissements et sorties',0.0,0,'depense',2,'depense/Divertissements et sorties',0);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (25,'Sorties',0.0,0,'depense',24,'depense/Divertissements et sorties/Sorties',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (26,'Vacances',0.0,0,'depense',24,'depense/Divertissements et sorties/Vacances',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (27,'Transport',0.0,0,'depense',2,'depense/Transport',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (28,'Reapair',0.0,0,'depense',19,'depense/Auto/Reapair',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (29,'Assurances',0.0,0,'depense',19,'depense/Auto/Assurances',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (30,'Maison',0.0,0,'depense',2,'depense/Maison',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (31,'Taxes',0.0,0,'depense',2,'depense/Taxes',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (32,'Groceries',0.0,0,'depense',2,'depense/Groceries',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (33,'Fournitures',0.0,0,'depense',2,'depense/Fournitures',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (34,'Locations',0.0,0,'depense',2,'depense/Locations',0);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (35,'Maison',0.0,0,'depense',34,'depense/Locations/Maison',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (36,'Education',0.0,0,'depense',2,'depense/Education',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (37,'Vêtements',0.0,0,'depense',2,'depense/Vêtements',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (38,'Mangé',0.0,0,'depense',2,'depense/Mangé',0);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (39,'Restaurants',0.0,0,'depense',38,'depense/Mangé/Restaurants',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (40,'Divers',0.0,0,'depense',38,'depense/Mangé/Divers',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (41,'Outils',0.0,0,'depense',2,'depense/Outils',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (42,'Credit Card',0.0,0,'passif',3,'passif/Credit Card',0);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (43,'Credit Card Brahim',0.0,0,'passif',42,'passif/Credit Card/Credit Card Brahim',0);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (44,'Visa Desjardins',0.0,0,'passif',43,'passif/Credit Card/Credit Card Brahim/Visa Desjardins',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (45,'CIBC Costco',0.0,0,'passif',43,'passif/Credit Card/Credit Card Brahim/CIBC Costco',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (46,'MC Canadian Tire',0.0,0,'passif',43,'passif/Credit Card/Credit Card Brahim/MC Canadian Tire',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (47,'Credit Card Fatima',0.0,0,'passif',42,'passif/Credit Card/Credit Card Fatima',0);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (48,'MC Desjardins',0.0,0,'passif',47,'passif/Credit Card/Credit Card Fatima/MC Desjardins',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (49,'Prêts',0.0,0,'passif',3,'passif/Prêts',0);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (50,'Prêts hypothécaires',0.0,0,'passif',49,'passif/Prêts/Prêts hypothécaires',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (51,'Prêts Auto',0.0,0,'passif',49,'passif/Prêts/Prêts Auto',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (52,'Prêts Etudes',0.0,0,'passif',49,'passif/Prêts/Prêts Etudes',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (53,'Prêts autres',0.0,0,'passif',49,'passif/Prêts/Prêts autres',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (54,'Salaire fatima',0.0,0,'income',4,'income/Salaire fatima',1);
INSERT INTO "ACCOUNT" ("ID","ACCOUNT_NAME","BALANCE","IS_MAIN","TYPE","PARENT_ID","PATH","IS_LEAF") VALUES (55,'Salaire brahim',457610.19,0,'income',4,'income/Salaire brahim',1);
INSERT INTO "OPERATION" ("ID","NUM_TRANS","TIME","DESCRIPTION","STATUT","CREDIT","DEBIT","BALANCE","ID_ACCOUNT","TRANSFER","PROFILE","ATTACHMENT") VALUES (3,'7O3USNBPBZ2GNVHG','2023-12-08 22:31:00','vcvvbxcvb','r',7000.0,0.0,-7000.0,8,'actifs/Comptes Bancaires Reguliers/Comptes Fatima','bnaitdjoudi@gmail.com',NULL);
INSERT INTO "OPERATION" ("ID","NUM_TRANS","TIME","DESCRIPTION","STATUT","CREDIT","DEBIT","BALANCE","ID_ACCOUNT","TRANSFER","PROFILE","ATTACHMENT") VALUES (4,'7O3USNBPBZ2GNVHG','2023-12-08 22:31:00','vcvvbxcvb','r',0.0,7000.0,7000.0,6,'actifs/Comptes Bancaires Reguliers/Comptes Brahim RBC','bnaitdjoudi@gmail.com',NULL);
INSERT INTO "OPERATION" ("ID","NUM_TRANS","TIME","DESCRIPTION","STATUT","CREDIT","DEBIT","BALANCE","ID_ACCOUNT","TRANSFER","PROFILE","ATTACHMENT") VALUES (5,'3ZSBH2Q33XIMXXZQ','2023-12-08 23:45:30','kjhkjhjk','r',1200.0,0.0,-1200.0,7,'actifs/Comptes Bancaires Reguliers/Comptes Fatima','bnaitdjoudi@gmail.com',NULL);
INSERT INTO "OPERATION" ("ID","NUM_TRANS","TIME","DESCRIPTION","STATUT","CREDIT","DEBIT","BALANCE","ID_ACCOUNT","TRANSFER","PROFILE","ATTACHMENT") VALUES (6,'3ZSBH2Q33XIMXXZQ','2023-12-08 23:45:30','kjhkjhjk','r',0.0,1200.0,8200.0,6,'actifs/Comptes Bancaires Reguliers/Comptes Brahim Desjardins','bnaitdjoudi@gmail.com',NULL);
INSERT INTO "OPERATION" ("ID","NUM_TRANS","TIME","DESCRIPTION","STATUT","CREDIT","DEBIT","BALANCE","ID_ACCOUNT","TRANSFER","PROFILE","ATTACHMENT") VALUES (7,'3773NZ0R8XKUPG54','2023-12-20 23:28:28','lj;lj;lj;ljlljlkhlkhkjhjkjh','r',0.0,455225.0,456410.19,7,'income/Salaire brahim','bnaitdjoudi@gmail.com',NULL);
INSERT INTO "OPERATION" ("ID","NUM_TRANS","TIME","DESCRIPTION","STATUT","CREDIT","DEBIT","BALANCE","ID_ACCOUNT","TRANSFER","PROFILE","ATTACHMENT") VALUES (8,'3773NZ0R8XKUPG54','2023-12-20 23:28:28','lj;lj;lj;ljlljlkhlkhkjhjkjh','r',0.0,455225.0,457610.19,55,'actifs/Comptes Bancaires Reguliers/Comptes Brahim Desjardins','bnaitdjoudi@gmail.com',NULL);
INSERT INTO "OPERATION" ("ID","NUM_TRANS","TIME","DESCRIPTION","STATUT","CREDIT","DEBIT","BALANCE","ID_ACCOUNT","TRANSFER","PROFILE","ATTACHMENT") VALUES (9,'V3QDV2P0HJX0EA86','2023-12-14 23:26:00','bvnvbnvbn','r',0.0,2385.19,1185.19,7,'income/Salaire brahim','bnaitdjoudi@gmail.com',NULL);
INSERT INTO "OPERATION" ("ID","NUM_TRANS","TIME","DESCRIPTION","STATUT","CREDIT","DEBIT","BALANCE","ID_ACCOUNT","TRANSFER","PROFILE","ATTACHMENT") VALUES (10,'V3QDV2P0HJX0EA86','2023-12-14 23:26:00','bvnvbnvbn','r',0.0,2385.19,2385.19,55,'actifs/Comptes Bancaires Reguliers/Comptes Brahim Desjardins','bnaitdjoudi@gmail.com',NULL);
INSERT INTO "OPERATION" ("ID","NUM_TRANS","TIME","DESCRIPTION","STATUT","CREDIT","DEBIT","BALANCE","ID_ACCOUNT","TRANSFER","PROFILE","ATTACHMENT") VALUES (11,'JYT1S7JK2X3GDF4F','2024-01-22 23:49:18','gdfgdfgdfg','r',0.0,78.0,-6922.0,8,'actifs/Comptes Bancaires Reguliers/Comptes Brahim Desjardins','bnaitdjoudi@gmail.com',NULL);
INSERT INTO "OPERATION" ("ID","NUM_TRANS","TIME","DESCRIPTION","STATUT","CREDIT","DEBIT","BALANCE","ID_ACCOUNT","TRANSFER","PROFILE","ATTACHMENT") VALUES (12,'JYT1S7JK2X3GDF4F','2024-01-22 23:49:18','gdfgdfgdfg','r',78.0,0.0,456332.19,7,'actifs/Comptes Bancaires Reguliers/Comptes Brahim RBC','bnaitdjoudi@gmail.com',NULL);
INSERT INTO "OPERATION" ("ID","NUM_TRANS","TIME","DESCRIPTION","STATUT","CREDIT","DEBIT","BALANCE","ID_ACCOUNT","TRANSFER","PROFILE","ATTACHMENT") VALUES (13,'3CWJYLW5K7CM7R6P','2024-01-22 23:57:01','sdfsdfsdf','r',0.0,852.59,-6069.41,8,'actifs/Comptes Bancaires Reguliers/Comptes Brahim Desjardins','bnaitdjoudi@gmail.com',NULL);
INSERT INTO "OPERATION" ("ID","NUM_TRANS","TIME","DESCRIPTION","STATUT","CREDIT","DEBIT","BALANCE","ID_ACCOUNT","TRANSFER","PROFILE","ATTACHMENT") VALUES (14,'3CWJYLW5K7CM7R6P','2024-01-22 23:57:01','sdfsdfsdf','r',852.59,0.0,455479.6,7,'actifs/Comptes Bancaires Reguliers/Comptes Brahim RBC','bnaitdjoudi@gmail.com',NULL);
INSERT INTO "PROFIL" ("mail","FIRST_NAME","LAST_NAME","PHONE","IS_ADMIN") VALUES ('bnaitdjoudi@gmail.com','brahim','nait djoudi','438 778 1187',1);
INSERT INTO "AUTH" ("mail","password","DATE") VALUES ('bnaitdjoudi@gmail.com','f213135c96cbd2a383b87f91bd8a84798ce6773429c99a2d2487545b247adabc','Thu Nov 30 2023 22:40:56 GMT-0500 (Eastern Standard Time)');
CREATE VIEW OPERATION_VIEW AS SELECT OP.* , ACC.TYPE , ACC.PATH FROM OPERATION OP LEFT OUTER JOIN ACCOUNT ACC ON OP.ID_ACCOUNT = ACC.ID;
COMMIT;`;
