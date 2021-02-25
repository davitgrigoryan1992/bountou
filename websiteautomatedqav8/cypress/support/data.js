let faker = require('faker');

export class UserData {

    generateNumber() {
        return Math.floor(10000000 + Math.random() * 90000000);
    };

    generateEmail() {
        return faker.internet.email();
    };

    generateUserName() {
        return faker.lorem.word()+this.generateNumber();
    };

    generateTimeStamp() {
        let tomorrow = new Date();
        return tomorrow.setDate(new Date().getDate()+1);

    };
}
