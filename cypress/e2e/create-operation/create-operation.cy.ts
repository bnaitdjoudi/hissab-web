import { Given, When, After } from '@badeball/cypress-cucumber-preprocessor';
import { Then } from '@badeball/cypress-cucumber-preprocessor/lib/methods';

Given('open honepage', () => {
  cy.viewport('iphone-8');
  cy.visit('http://localhost:8100');
});

Then('go to income acount', () => {
  cy.get('#income').click();
});

Then('go to brahim salary', () => {
  cy.get('#account-55').click({ force: true });
  cy.wait(2000);
});

Then('open operation form', () => {
  cy.get('#menu-button').click({ force: true }).wait(1000);
});
Then('create operation', () => {
  cy.get('button.action-sheet-createOp').click().wait(500);
  cy.contains('New Operation');
  cy.get('ion-input#description input').type('walou');
  cy.get('input[ng-reflect-name="debit"]').type('5000');
  cy.get('#tranferToModal').click().wait(100);
  cy.get('#item-leaf-7').click();
  cy.get('ion-button:contains("Submit")').click().wait(100);

});
