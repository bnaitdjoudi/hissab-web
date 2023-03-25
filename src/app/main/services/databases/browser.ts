export const browserDBInstance = (db: any) => {
  return {
    executeSql: (sql: any, params: any[]) => {
      return new Promise((resolve, reject) => {
        const trans = (tx: any) => {
          console.log(
            'browserDBInstance::executeSql::' +
              sql +
              ' ' +
              params?.map((el) => JSON.stringify(el)).join(',')
          );
          tx.executeSql(
            sql,
            params,
            function (tx: any, rs: any) {
              resolve(rs);
            },
            (rx: any, error: any) => {
              reject(error);
            }
          );
        };

        if (!sql.includes('SELECT')) {
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
                tx.executeSql(arr[i], [], () => {
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
