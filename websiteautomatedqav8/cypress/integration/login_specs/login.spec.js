import {UserData} from '../../support';

describe('login_cases', () => {
    beforeEach(() => {
        cy.server()
        cy.route('GET', '/tour/getCasinoTournamentInstances*').as('tournament')
        cy.clock();
        cy.visit('');
        cy.window().then(() => {
            Cypress.$('ul.games').remove()
        })
        cy.wait('@tournament')
    });

    it('Check login modal appearance', () => {
        cy.contains('span', 'Login').click();
        cy.percySnapshot('login_modal_test')
    });

    it('Check if login modal closed', () => {
        cy.contains('span', 'Login').click();
        cy.get('[class*="form"] > svg').click();
        cy.get('[role="dialog"]').should('not.exist');
    });

    it('Check functionality of login modal elements', () => {
        cy.contains('span', 'Login').click();
        cy.get('form [type="text"]').type('123abc!@#').should('have.value', '123abc!@#');
        cy.get('form [type="text"] ~ label input').type('123abc!@#').should('have.value', '123abc!@#');
        cy.get('span[class="visibilitySection"] svg').click();
        cy.get('form [type="text"] ~ label input')
            .invoke("attr", "type")
            .should('eq', 'text');
        cy.get('[type="checkbox"]').click();
        cy.percySnapshot('login_modal_filled_test');
    });

    it('Check error messages for empty input fields', () => {
        cy.contains('span', 'Login').click();
        cy.get('[role="dialog"] button').click();
        cy.get('[class="error-message"]').should('have.length', 2).each(($el) => {
            cy.wrap($el).should('have.text', '*Field is required')
        })
        cy.percySnapshot( 'login_modal_empty_error_test');
    });

    it('Check both login and password required for login', () => {
        cy.contains('span', 'Login').click();
        cy.get('form [type="text"]').type('for_login_testing');
        cy.get('[role="dialog"] button').click();
        cy.get('[class="error-message"]')
            .should('have.length', '1')
            .and('have.text', '*Field is required')
            .get('[role="dialog"]')
        cy.percySnapshot('login_modal_empty_username_error_test');
        cy.get('form [type="text"]').clear();
        cy.get('form [type="text"] ~ label input').type('Test1');
        cy.get('[role="dialog"] button').click();
        cy.get('[class="error-message"]')
            .should('have.length', '1')
            .and('have.text', '*Field is required')
            .get('[role="dialog"]')
        cy.percySnapshot('login_modal_empty_password_error_test');
    });

    it('Check user can login with valid credentials', () => {
        let data = new UserData();
        let email_address = data.generateEmail();
        let user_login = data.generateUserName();
        cy.api_register(email_address, user_login);
        cy.server();
        cy.route('POST', '/api/authenticate').as('loginRequest')
        cy.contains('span', 'Login').click();
        cy.get('form [type="text"]').type(user_login);
        cy.get('form [type="text"] ~ label input').type('Test123');
        cy.get('[role="dialog"] button').click();
        cy.wait('@loginRequest').its('responseBody').then(response => {
            expect(response.code).to.eq(200);
        });
    });

    it('Check user can not login with invalid credentials', () => {
        cy.server();
        cy.route('POST', '/api/authenticate').as('loginRequest');
        cy.contains('span', 'Login').click();
        cy.get('form [type="text"]').type('invalid_login');
        cy.get('form [type="text"] ~ label input').type('invalid_password');
        cy.get('[role="dialog"] button').click();
        cy.wait('@loginRequest').its('responseBody').then(response => {
            expect(response.code).to.eq(403);
        });
        cy.get('[class="errorText"]')
            .should('have.text', '*Invalid Username or Password')
            .get('[role="dialog"]')
        cy.percySnapshot('login_modal_invalid_login_test');
    });

    it('Check user can not open game without login', () => {
        cy.reload()
        cy.get('[class="games__element__overlay__background"]').eq(0).click({force: true});
        cy.get('[role="dialog"]').should('exist');
    });
});
