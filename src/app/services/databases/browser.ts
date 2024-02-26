const returnResult = (rs: any): any => {
  if (rs.rows.length === 0) {
    return { values: [] };
  }
  let values: any[] = [];

  for (let i = 0; i < rs.rows.length; i++) {
    values.push(rs.rows.item(i));
  }

  return { values: values };
};

export const browserDBInstance = (db: any) => {
  return {
    query: (sql: any, params: any[]) => {
      return new Promise((resolve, reject) => {
        const trans = (tx: any) => {
          console.log(
            'browserDBInstance::query::' +
              sql +
              ' ' +
              params?.map((el) => JSON.stringify(el)).join(',')
          );
          tx.executeSql(
            sql,
            params,
            function (tx: any, rs: any) {
              resolve(returnResult(rs));
            },
            (rx: any, error: any) => {
              console.error(error);
              reject(error);
            }
          );
        };

        if (!sql.includes('SELECT') || sql.includes('CREATE VIEW')) {
          console.log('transaction');
          db.transaction(function (tx: any) {
            trans(tx);
          });
        } else {
          db.readTransaction(function (tx: any) {
            trans(tx);
          });
        }
      });
    },

    execute: (sql: any, params: any[]) => {
      return new Promise((resolve, reject) => {
        const trans = (tx: any) => {
          console.log(
            'browserDBInstance::query::' +
              sql +
              ' ' +
              params?.map((el) => JSON.stringify(el)).join(',')
          );
          tx.executeSql(
            sql,
            params,
            function (tx: any, rs: any) {
              resolve(returnResult(rs));
            },
            (rx: any, error: any) => {
              console.error(error);
              reject(error);
            }
          );
        };

        if (!sql.includes('SELECT') || sql.includes('CREATE VIEW')) {
          console.log('transaction');
          db.transaction(function (tx: any) {
            trans(tx);
          });
        } else {
          db.readTransaction(function (tx: any) {
            trans(tx);
          });
        }
      });
    },

    sqlBatch: (arr: any) => {
      return new Promise((r, rr) => {
        let batch: any[] = [];
        db.transaction((tx: any) => {
          for (let i = 0; i < arr.length; i++) {
            batch.push(
              new Promise((resolve, reject) => {
                tx.query(arr[i], [], () => {
                  resolve(true);
                });
              })
            );
            Promise.all(batch).then(() => r(true));
          }
        });
      });
    },
  };
};
