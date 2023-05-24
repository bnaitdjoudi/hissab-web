import { TranslateService } from '@ngx-translate/core';

export const actionSheetCtrlOperation = (
  header: string,
  subHeader: string | undefined,
  roles: string[],
  translateService: TranslateService
) => {
  return {
    header: header,
    subHeader: subHeader,
    buttons: roles.map((el) => {
      return {
        text: translateService ? translateService.instant('actions.' + el) : el,
        role: el,
        data: {
          action: el,
        },
      };
    }),
  };
};
