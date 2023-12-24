export const printError = (msg: string, reject: any, err: any): void => {
  reject(msg);
  console.error(err);
  console.log('eeerrr:', err);
};
