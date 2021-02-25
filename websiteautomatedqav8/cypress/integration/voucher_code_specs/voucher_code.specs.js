import {UserData} from '../../support';

let data = new UserData();

describe('voucher_code_cases', () => {
    let email_address = data.generateEmail();
    let user_login = data.generateUserName();

    before(() => {
        cy.api_register(email_address, user_login);
    });

    beforeEach(() => {
        cy.server()
        cy.route('GET', '/tour/getCasinoTournamentInstances*').as('tournament')
        cy.api_login(user_login)
        cy.clock();
        cy.visit('');
        cy.wait('@tournament')
        cy.window().then(() => {
            Cypress.$('ul.games').remove()
        })
        cy.contains(user_login).then($el => {
            Cypress.$($el).text('test123')
        })
    });

    it('Check voucher buttons is visible', () => {
        cy.get('span[class*="btn-voucher"]').should('be.visible')
        cy.percySnapshot('voucher_top_nav_bar_appearance_test');
    });

    it('Check voucher modal is opened and closed', () => {
        cy.get('span[class*="btn-voucher"]').click()
        cy.get('[class*="dialog voucher"]')
            .should('be.visible')
            .wait(2000)
        cy.percySnapshot('voucher_modal_test')
        cy.get('[class*="Close"]').click()
        cy.get('[class*="dialog voucher"]')
            .should('not.be.visible')
    });

    it('Check voucher input box validation', () => {
        cy.get('span[class*="btn-voucher"]').click()
        cy.get('[class="voucher-dlg-confirm"]').should('be.disabled')
        cy.get('[class*="voucher"] input').type('1234567')
        cy.get('[class="voucher-dlg-confirm"]').should('be.disabled')
        cy.get('[class*="voucher"] input').type('8')
        cy.get('[class="voucher-dlg-confirm"]').should('be.enabled').click()
        cy.get('[class="wrong-code"]')
            .should('be.visible')
            .and('have.text', 'Wrong Code')
            .get('[class*="dialog voucher"]')
        cy.percySnapshot('voucher_modal_wrong_code_test');
    });
});
