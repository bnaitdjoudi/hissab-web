import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountPageStore } from '../account-page.store';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/model/account.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'account-new',
  templateUrl: './account-new.page.html',
  styleUrls: ['./account-new.page.scss'],
})
export class AccountNewPage implements OnInit, OnDestroy {
  account: Account = {} as Account;

  newAccountName: string;

  accountForm: FormGroup;
  subscription: Subscription;
  constructor(
    readonly accountStore: AccountPageStore,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private navCtrl: NavController
  ) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit() {
    this.accountStore.startEdition();
    this.accountStore.currentAccount$.subscribe((acc) => {
      this.account = acc;
      this.initForm();
    });

    this.accountStore.newAccount$.subscribe((acc) => {
      this.newAccountName = acc ? acc.acountName : '';
      this.initForm();
    });

    this.initForm();
  }
  initForm() {
    this.accountForm = this.fb.group({
      accountName: [
        this.account.acountName,
        {
          validators: [Validators.required],
          updateOn: 'blur',
        },
      ],
      idAccount: [
        this.account.id,
        {
          validators: [Validators.required],
          updateOn: 'blur',
        },
      ],
      path: [
        this.account.path,
        { validators: [Validators.required], updateOn: 'blur' },
      ],

      newAccountName: [
        this.newAccountName,
        { validators: [Validators.required], updateOn: 'blur' },
      ],
    });
    this.initReactionForm();
  }

  initReactionForm() {
    this.accountForm.get('newAccountName')?.valueChanges.subscribe((val) => {
      this.newAccountName = val;
      this.accountStore.editNewAccount(val, this.account.id);
    });
  }

  openMode() {
    this.router.navigate(['/account/search'], {});
  }

  gotHome() {
    this.accountStore.cancelEdition();
    this.router.navigate(['/dashboard'], {});
  }

  async submit() {
    try {
      const id = await this.accountStore.submit();
      this.router.navigate(['/account/' + id], {});
    } catch (error) {
      console.error(error);
    }
  }

  backNavigation() {
    this.navCtrl.back();
  }
}
