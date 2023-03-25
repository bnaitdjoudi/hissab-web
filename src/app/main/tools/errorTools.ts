export const printError = (msg: string, reject: any, err: any): void => {
  reject(msg);
  console.log(JSON.stringify(err));
};
