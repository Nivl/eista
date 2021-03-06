describe('Sign In', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should log the user in', () => {
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/login`);
    cy.get('#email').clear();
    cy.get('#email').type('john.doe@domain.tld');
    cy.get('#password').clear();
    cy.get('#password').type('password');
    cy.get('button[type="submit"]').click();
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/`);
  });

  it('Fail on invalid login', function () {
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/login`);
    cy.get('#email').clear();
    cy.get('#email').type('unknown@domain.tld');
    cy.get('#password').clear();
    cy.get('#password').type('password');
    cy.get('button[type="submit"]').click();
    cy.get(':nth-child(2) > .MuiTypography-root').should(
      'have.text',
      'Invalid email or password',
    );
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/login`);
  });

  it('allow user to go back and forth with Sign Up', () => {
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/login`);
    cy.findByText('Sign Up').click();
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/signup`);
    cy.findByText('Sign In').click();
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/login`);
  });
});
