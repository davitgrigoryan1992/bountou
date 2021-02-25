import {UserData} from '../../support';

let data = new UserData();

describe('register_cases', () => {
    beforeEach(() => {
        cy.server()
        cy.route('GET', '/tour/getCasinoTournamentInstances*').as('tournament')
        const start = Date.now();
        cy.clock(start);
        Cypress.$('ul.games').remove()
        cy.visit('')
        cy.wait('@tournament')
        cy.window().then(() => {
            Cypress.$('ul.games').remove()
        })
    });

    it('Check register modal appearance', () => {
        cy.contains('span', 'Register').click();
        cy.percySnapshot('register_modal_test');
    });

    it('Check if register modal closed', () => {
        cy.contains('span', 'Register').click();
        cy.get('[class*="registration"] a~ svg').click();
        cy.get('[role="dialog"]').should('not.exist');
    });

    it('Check if login modal opens', () => {
        cy.contains('span', 'Register').click();
        cy.get('[class*="registration"] a[href]').click();
        cy.get('[class="login-form "]').parent('div[role="dialog"]').should('be.visible');
    });

    it('Check error messages for empty data and invalid data of register modal fields step1', () => {
        cy.contains('span', 'Register').click();
        cy.get('[name="username"]')
            .type('abc_123')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0)
            .get('[name="username"]')
            .type('@')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Letters, numbers or underscores only, please')
            .get('[role="dialog"]')
        cy.percySnapshot('register_username_invalid_symbol_error_test')
            .get('[name="username"]')
            .clear()
            .type('a2')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Please enter at least 6 characters')
            .get('[role="dialog"]')
        cy.percySnapshot('register_short_username_error_test')
            .get('[name="username"]')
            .clear()
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Field is required')
            .get('[role="dialog"]')
        cy.percySnapshot('register_empty_username_error_test')
            .get('[name="username"]')
            .type('abc_123')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0);
        // cy.get('[name="password"]')
        //     .type('abcd123')
        //     .get('[role="dialog"]').focus()
        //     .get('[class*="errorMessage"]')
        //     .should('have.length', 0)
        //     .get('[name="password"]')
        //     .type('!@#')
        //     .get('[role="dialog"]').focus()
        //     .get('[class*="errorMessage"]')
        //     .should('have.text', '*Password must contain both letters and digits with 6-16 characters')
        //     .get('[role="dialog"]')
        cy.percySnapshot('register_password_symbol_error_test')
            //TODO: Uncomment this when the validation is corrected
            // .get('[name="password"]')
            // .clear()
            // .type('a1')
            // .get('[role="dialog"]').focus()
            // .get('[class*="errorMessage"]')
            // .should('have.text', '*Password must contain both letters and digits with 6-16 characters')
            // .toMatchImageSnapshot({name: 'register_short_password_error_test'})
            .get('[name="password"]')
            .clear()
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Field is required')
            .get('[role="dialog"]')
        cy.percySnapshot('register_empty_password_error_test')
            .get('[name="password"]')
            .type('Test123')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0);
        cy.get('[name="repeatPassword"]')
            .type('Test12')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Passwords don\'t match')
            .get('[role="dialog"]')
        cy.percySnapshot('register_not_matching_passwords_error_test')
            .get('[name="repeatPassword"]')
            .clear()
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Please repeat the password you wrote above')
            .get('[role="dialog"]')
        cy.percySnapshot('register_empty_repeat_password_error_test')
            .get('[name="repeatPassword"]')
            .type('Test123')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0);
        cy.get('span[class="visibilitySection"] svg').eq(0).click();
        cy.get('[name="password"]')
            .invoke("attr", "type")
            .should('eq', 'text');
        cy.get('span[class="visibilitySection"] svg').eq(1).click();
        cy.get('[name="repeatPassword"]')
            .invoke("attr", "type")
            .should('eq', 'text');
        cy.get('[name="email"]')
            .type('example_1@example.com')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0)
            .get('[name="email"]')
            .clear()
            .type('example_1example.com')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            //TODO: There is a misspell in the error message. It should be changed after fix
            .should('have.text', '*Please enter a valid Email Adress')
            .get('[role="dialog"]')
        cy.percySnapshot('register_invalid_email_error_test')
            .get('[name="email"]')
            .clear()
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Field is required')
            .get('[role="dialog"]')
        cy.percySnapshot('register_empty_email_error_test')
            .get('[name="email"]')
            .type('example_1@example.com')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0);
        cy.get('[name="country"]')
            .focus()
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Field is required')
            .get('[role="dialog"]')
        cy.percySnapshot('register_empty_country_error_test')
            .get('[name="country"]')
            .select('Armenia')
        cy.percySnapshot('register_country_text_test');
        cy.get('[name="currency"]')
        cy.percySnapshot('register_currency_prefilled_text_test')
            .get('[name="currency"]')
            .select('TRY')
        cy.percySnapshot('register_currency_filled_text_test');
    });

    it('Check if user can navigate to step2 of register', () => {
        cy.contains('span', 'Register').click();
        cy.get('[name="username"]').type('example_user');
        cy.get('[name="password"]').type('Test123');
        cy.get('[name="repeatPassword"]').type('Test123');
        cy.get('[name="email"]').type('example_1@example.com');
        cy.get('[name="nationalId"]').type('12345678900');
        cy.get('[name="country"]').select('Armenia');
        cy.get('button[class*="register"]').click();
        cy.get('[class*="prev-step"]').should('be.visible')
        cy.percySnapshot('register_step2_modal_test');
    });

    it('Check error messages for empty and invalid data of register modal fields step2', () => {
        let email_address = data.generateEmail();
        let user_login = data.generateUserName();
        cy.pass_first_step(user_login, email_address);
        cy.get('[name="firstname"]')
            .type('Example_Name123')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0)
            .get('[name="firstname"]')
            .clear()
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Field is required')
            .get('[role="dialog"]')
        cy.percySnapshot('register_empty_firstname_test')
            .get('[name="firstname"]')
            .type('Example_Name123')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0);
        cy.get('[name="lastname"]')
            .type('Example_lastName123')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0)
            .get('[name="lastname"]')
            .clear()
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Field is required')
            .get('[role="dialog"]')
        cy.percySnapshot('register_empty_lastName_test')
            .get('[name="lastname"]')
            .type('Example_lastName123')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0);
        cy.get('[name="gender"]').children().should('have.length', 3)
            .eq(1).should('have.text', 'Female')
            .siblings().eq(1).should('have.text', 'Male')
            .get('[name="gender"]').focus()
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Field is required')
            .get('[role="dialog"]')
        cy.percySnapshot('register_unselected_gender_test')
            .get('[name="gender"]')
            .select('Female')
        cy.percySnapshot('register_selected_gender_test');
        cy.get('[name="birthDateDay"]')
            .focus()
            .get('[name="birthDateMonth"]')
            .focus()
            .get('[name="birthDateYear"]')
            .focus()
            .get('[role="dialog"]').focus()
        cy.percySnapshot('register_unselected_date_test');
        cy.get('[name="birthDateDay"]').select('20');
        cy.get('[name="birthDateMonth"]').select('July');
        cy.get('[name="birthDateYear"]').select('2000');
        cy.get('[role="dialog"]').focus()
        cy.percySnapshot('register_selected_date_test');
        cy.get('[name="city"]')
            .type('Yerevan 100')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0)
            .get('[name="city"]')
            .clear()
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Field is required')
            .get('[role="dialog"]')
        cy.percySnapshot('register_empty_city_test')
            .get('[name="city"]')
            .type('Yerevan 100')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0);
        cy.get('[name="address"]')
            .type('st. Abovyan 20/8')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0)
            .get('[name="address"]')
            .clear()
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Field is required')
            .get('[role="dialog"]')
          cy.percySnapshot('register_empty_address_test')
            .get('[name="address"]')
            .type('st. Abovyan 20/8')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.length', 0);
        cy.get('[name="phoneNumber"]')
            .type('1234567890-')
            .get('[role="dialog"]').focus()
            .get('[class*="errorMessage"]')
            .should('have.text', '*Please provide a valid phone number')
            .get('[name="phoneNumber"]')
            .clear()
            .type('asdf!@#')
            .should('not.have.value')
        //TODO: Uncomment this when the validation is corrected
        // .type('123')
        // .get('[role="dialog"]').focus()
        // .get('[class*="errorMessage"]')
        // .should('have.text', 'ERROR MESSAGE')
        // .get('[role="dialog"]')
        // .toMatchImageSnapshot({name: 'register_empty_address_test'})
        // .get('[name="phoneNumber"]')
        // .type('1234567890-')
        // .get('[role="dialog"]').focus()
        // .get('[class*="errorMessage"]')
        // .should('have.length', 0)
        // cy.get('[name="keepInformed"]')
        //     .should('not.be.checked')
        //     .get('[name="keepInformed"]')
        //     .check().should('be.checked')
        //     .get('[class="secondStep center"]').eq(0)
        //     .toMatchImageSnapshot({name: 'register_checked_informed_test'})
    });

    it('Check terms and conditions are opened', () => {
        let email_address = data.generateEmail();
        let user_login = data.generateUserName();
        cy.pass_first_step(user_login, email_address);
        cy.get('[class*="secondStep"] > span > a').click();
        cy.percySnapshot('register_terms_modal_test');
    });

    it('Check user can navigate to step1 from step2', () => {
        let email_address = data.generateEmail();
        let user_login = data.generateUserName();
        cy.pass_first_step(user_login, email_address);
        cy.get('[class*="prev-step"]').click()
        cy.get('[name="username"]').clear().type('test123');
        cy.get('[name="email"]').clear().type('test@gmail.com');
        cy.percySnapshot('register_step1_modal_test');
    });

    it.skip('Check user can not register with taken username and email', () => {
        let email_address = data.generateEmail();
        let user_login = data.generateUserName();
        cy.api_register(email_address, user_login);
        cy.contains('span', 'Register').click();
        cy.get('[name="username"]').type(user_login);
        cy.get('[name="password"]').type('Test123');
        cy.get('[name="repeatPassword"]').type('Test123');
        cy.get('[name="email"]').type(email_address);
        cy.get('[name="nationalId"]').type('12345678900');
        cy.get('[name="country"]').select('Armenia');
        cy.get('button[class*="register"]').click()
            .get('[class*="errorMessage"]')
            .should('have.length', 1) //TODO: Value should be updated to 2
            .eq(0).should('have.text', 'This username is taken')
        // .eq(1).should('have.text', 'This email is taken');
        //TODO: Snapshot should be updated
        cy.percySnapshot('register_modal_taken_username_email_test');
    });

    it.skip('Check user can register with valid username and email', () => {
        cy.server()
        cy.route('POST', '/casinoapi/player').as('register');
        let email_address = data.generateEmail();
        let user_login = data.generateUserName();
        cy.pass_first_step(user_login, email_address);
        cy.pass_second_step();
        cy.wait('@register');
        cy.percySnapshot('register_step3_modal_test')
        cy.get('[class*="prev-step"]').click();
        cy.get('[class="registration desktop"]').should('not.exist');
    });
});
