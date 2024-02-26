import { AccountLimit } from "./account-limit.model";
import { Account } from "./account.model";

export interface AlertLimit{
    account: Account;
    accountLimit:AccountLimit

}