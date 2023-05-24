import { FormGroup } from '@angular/forms';

export function matchDebitCredit() {
  return (control: FormGroup) => {
    const debit = control.get('debit')?.value;
    const credit = control.get('credit')?.value;
    console.log('test match');
    return debit == 0 || credit == 0 ? { noMatch: true } : null;
  };
}
