import {UserData} from "../../support";

describe('forgot_password_cases', () => {
    beforeEach(() => {
        cy.server()
        cy.route('GET', '/tour/getCasinoTournamentInstances*').as('tournament')
        cy.clock();
        cy.visit('');
        cy.wait('@tournament')
        cy.window().then(() => {
            Cypress.$('ul.games').remove()
        })
    });

    it('Check forgot password modal appearance', () => {
        cy.contains('span', 'Login').click();
        cy.get('div.form-close').click();
        cy.percySnapshot('forgot_password_modal_test');
    });

    it('Check if password recovery modal closed', () => {
        cy.contains('span', 'Login').click();
        cy.get('div.form-close').click();
        cy.get('[class*="form"] > svg').click();
        cy.get('[role="dialog"]').should('not.exist');
    });

    it('Check functionality of forgot password modal elements', () => {
        cy.contains('span', 'Login').click();
        cy.get('div.form-close').click();
        cy.get('[name="username"]').type('123abc!@#').should('have.value', '123abc!@#');
        cy.get('[name="email"]').type('123abc!@#').should('have.value', '123abc!@#');
    });

    it('Check error messages for empty input fields and incorrect email field', () => {
        cy.contains('span', 'Login').click();
        cy.get('div.form-close').click();
        cy.get('button[class*="login"]').click();
        cy.percySnapshot('forgot_password_modal_empty_error_test');
        cy.get('[name="email"]').type('123abc!@#')
        cy.get('button[class*="login"]').click();
        //TODO: There is a misspell in the error message. It should be changed after fix
        cy.get('[class="error-message"]').eq(1).should('have.text', '*Please enter a valid Email Adress');
    });

    it('Check both username and email required for password recovery request', () => {
        cy.contains('span', 'Login').click();
        cy.get('div.form-close').click();
        cy.get('[name="username"]').type('for_testing')
        cy.get('button[class*="login"]').click();
        cy.get('[class="error-message"]')
            .should('have.length', '1')
            .and('have.text', '*Field is required')
            .get('[role="dialog"]')
        cy.percySnapshot('forgot_password_modal_empty_username_error_test');
        cy.get('form [type="text"]').clear();
        cy.get('[name="email"]').type('testtest1@test.test');
        cy.get('button[class*="login"]').click();
        cy.get('[class="error-message"]')
            .should('have.length', '1')
            .and('have.text', '*Field is required')
            .get('[role="dialog"]')
        cy.percySnapshot('forgot_password_modal_empty_email_error_test');
    });

    it('Check user can send password recovery request with valid credentials', () => {
        let data = new UserData();
        let email_address = data.generateEmail();
        let user_login = data.generateUserName();
        cy.api_register(email_address, user_login);
        cy.server();
        cy.route('POST', '/casinoapi/resetPassword').as('passRecoveryRequest');
        cy.contains('span', 'Login').click();
        cy.get('div.form-close').click();
        cy.get('[name="username"]').type(user_login);
        cy.get('[name="email"]').type(email_address);
        cy.get('button[class*="login"]').click();
        cy.wait('@passRecoveryRequest').its('status').then(status => {
            expect(status).to.eq(200);
        });
    });
});
