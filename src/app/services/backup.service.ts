import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '../model/account.model';
import { Observable, catchError, throwError } from 'rxjs';
import { AccountDto } from '../model/dtos/account.dto';
import { OperationDto } from '../model/dtos/operation.dto';
import { CapacitorHttp } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  constructor(private http: HttpClient) {}

  async getAllAccounts(): Promise<Account[]> {
    return new Promise<Account[]>(async (resolve, reject) => {
      this.http
        .get('http://10.0.2.2:3000/accounts')
        .pipe(catchError(this.handleError(reject)))
        .subscribe((response) => {
          console.log(response);
          resolve([]);
        });
    });
  }

  async createAccounts(account: AccountDto): Promise<AccountDto> {
    return new Promise<AccountDto>(async (resolve, reject) => {
      console.log('create account:', account.acountName);
      this.http
        .post('http://10.0.2.2:3000/accounts', account)
        .pipe(catchError(this.handleError(reject)))
        .subscribe((response) => {
          console.log();
          resolve(response as AccountDto);
        });
    });
  }

  async createOperation(account: OperationDto): Promise<OperationDto> {
    return new Promise<OperationDto>(async (resolve, reject) => {
      this.http
        .post('http://10.0.2.2:3000/operations', account)
        .pipe(catchError(this.handleError(reject)))
        .subscribe((response) => {
          console.log();
          resolve(response as OperationDto);
        });
    });
  }

  orderTreeAccount() {
    return new Promise<string>(async (resolve, reject) => {
      this.http
        .post(
          'http://10.0.2.2:3000/accounts/order/brahim',
          {},
          { responseType: 'text' }
        )
        .pipe(catchError(this.handleError(reject)))
        .subscribe((response) => {
          console.log(response);
          resolve(response.toString());
        });
    });
  }

  private handleError(
    reject: any
  ): (error: HttpErrorResponse) => Observable<never> {
    const errorHandler = (error: HttpErrorResponse) => {
      if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
        reject('error de statut');
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, body was: `,
          error.error
        );
        console.log('erreur http:', error.message);
        reject(`Backend returned code ${error.status}, body was: `);
      }
      // Return an observable with a user-facing error message.
      return throwError(
        () => new Error('Something bad happened; please try again later.')
      );
    };

    return errorHandler;
  }
}
