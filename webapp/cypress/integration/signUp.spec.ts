describe('Sign Up', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should sign the user up', () => {
    cy.findByText('Sign Up').click();
    cy.get('#name').clear();
    cy.get('#name').type('John Doe');
    cy.get('#email').clear();
    cy.get('#email').type('john.doe@domain.tld');
    cy.get('#password').clear();
    cy.get('#password').type('password');
    cy.get('#password-again').clear();
    cy.get('#password-again').type('password');
    cy.get('button[type="submit"]').click();
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/`);
  });
});
