Cypress.Commands.add('pass_first_step', (user_login, user_email) => {
    cy.contains('span', 'Register').click();
    cy.get('[name="username"]').type(user_login);
    cy.get('[name="password"]').type('Test123');
    cy.get('[name="repeatPassword"]').type('Test123');
    cy.get('[name="email"]').type(user_email);
    cy.get('[name="nationalId"]').type('12345678900');
    cy.get('[name="country"]').select('Armenia');
    cy.get('button[class*="register"]').click();
});

Cypress.Commands.add('pass_second_step', () => {
    cy.get('[name="firstname"]').type('Example_Name123');
    cy.get('[name="lastname"]').type('Example_lastName123');
    cy.get('[name="gender"]').select('Female');
    cy.get('[name="birthDateDay"]').select('20');
    cy.get('[name="birthDateMonth"]').select('July');
    cy.get('[name="birthDateYear"]').select('2000');
    cy.get('[name="city"]').type('Yerevan 100');
    cy.get('[name="address"]').type('st. Abovyan 20/8');
    cy.get('[name="phoneNumber"]').type('123123123');
    cy.get('button ~ [class*="registration__submit"]').click();
});
