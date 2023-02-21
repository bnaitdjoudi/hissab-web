export const deleteConfirmation = (
  textHeader: string,
  cancelCallBack: () => void,
  confirmCallBack: () => void,
  cssClass: string
): any => {
  return {
    header: textHeader,
    cssClass: cssClass,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: cancelCallBack,
      },
      {
        text: 'Confirm',
        role: 'confirm',
        handler: confirmCallBack,
      },
    ],
  };
};
