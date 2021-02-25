import {UserData} from '../index';

Cypress.Commands.add('api_register', (email_address, user_login) => {
    const data = new UserData();
    let number = data.generateNumber();
    cy.request('POST', `https://stagingapi.pokerplaza.com/casinoapi/player`, {
        country: "ARM",
        currency: ["TRY"],
        firstname: "Test1",
        lastname: "Test2",
        parentId: 49935,
        password: "Test123",
        password2: "Test123",
        personalInfo: {
            address: "Example Street",
            birthDate: "07/01/1915",
            city: "Example City",
            email: email_address,
            gender: "M",
            nationalId: "",
            phoneNumber: number,
            zipCode: "123123"
        },
        phoneNumber: number,
        skinId: 49935,
        typeId: 1,
        username: user_login
    });
});

Cypress.Commands.add('api_login', (user_login) => {
    const data = new UserData();
    let stamp = data.generateTimeStamp();
    cy.request('POST', `https://stagingapi.pokerplaza.com/api/authenticate`, {
        password: "Test123",
        skinId: 49935,
        username: user_login
    }).its('body').then(body => {
        localStorage.setItem('token', body.result.token);
        localStorage.setItem('token-expire', stamp);
        localStorage.setItem('user', JSON.stringify(body.result));
    });
});
