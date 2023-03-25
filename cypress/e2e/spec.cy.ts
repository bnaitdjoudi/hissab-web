describe('My First Test', () => {
  beforeEach(() => {
    cy.viewport('samsung-s10');
  });

  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.get('[id="actifs"]').click();
  });
});
