Cypress.Commands.add('check_providers_functionality', (type) => {
    cy.viewport(1920, 10000);
    cy.get('a[class*="providers"]').siblings('span').then(($el) => {
        let provider = $el[1].innerHTML;
        cy.wait('@games').its('responseBody').then(body => {
            let me = Object.assign(body.casino);
            let all_num = 0;
            for (const key in me) {
                for (let k = 0; k < me[key].products.length; k++) {
                    if (me[key].products[k].category !== undefined) {
                        if (me[key].products[k].category.type === type) {
                            all_num++;
                        }
                    }
                }
            }
            // cy.get('li[class*="games__element"]').should('have.length', all_num);
            let prov_name = me[provider];
            cy.contains('span', provider).siblings('a[href]').click();
            let num = 0;
            for (let j = 0; j < prov_name.products.length; j++) {
                if (prov_name.products[j].category.type === type) {
                    cy.contains('li', prov_name.products[j].name.trim()).should('be.visible');
                    num++;
                }
            }
            cy.get('li[class*="games__element"]').should('have.length', num);
        });
    });
});

Cypress.Commands.add('check_live_providers_functionality', (type) => {
    cy.viewport(1920, 10000);
    cy.get('a[class*="providers"]').siblings('span').then(($el) => {
        let provider = $el[1].innerHTML;
        cy.wait('@games').its('responseBody').then(body => {
            let me = Object.assign(body.liveCasino);
            let all_num = 0;
            for (const key in me) {
                for (let k = 0; k < me[key].products.length; k++) {
                    if (me[key].products[k].category !== undefined) {
                        if (me[key].products[k].category.type === type) {
                            all_num++;
                        }
                    }
                }
            }
            // cy.get('li[class*="games__element"]').should('have.length', all_num);
            let prov_name = me[provider];
            cy.contains('span', provider).siblings('a[href]').click();
            let num = 0;
            for (let j = 0; j < prov_name.products.length; j++) {
                if (prov_name.products[j].category.type === type) {
                    cy.contains('li', prov_name.products[j].name.trim()).should('be.visible');
                    num++;
                }
            }
            cy.get('li[class*="games__element"]').should('have.length', num);
        });
    });
});

Cypress.Commands.add('check_search_functionality', () => {
    cy.viewport(1920, 10000);
    cy.get('[class*="search__input"]')
        .should('be.empty')
        .type('abc 123!@#')
        .should('have.value', 'abc 123!@#')
        .clear()
        .should('be.empty');
    cy.get('[class*="gameTag"]').then((element) => {
        let nav_bar_elements = element.length;
        for (let i = 0; i <= nav_bar_elements; i++) {
            cy.get('[class*="card-title h5"]').eq(0).then((element) => {
                let game_title = element.text();
                let words = game_title.split(" ");
                let search_word = words[words.length - 1];
                cy.get('[class*="card-title h5"]').should('have.length.above', 0);
                cy.get('[class*="search__input"]').type(search_word);
                cy.get('[class*="card-title h5"]').each(($el) => {
                    if ($el.text().includes(search_word.toLowerCase())) {
                        cy.wrap($el).should('contain.text', search_word.toLowerCase());
                    } else {
                        cy.wrap($el).should('contain.text', search_word);
                    }
                });
                cy.get('[class*="search__input"]').clear().type('Example word');
                cy.get('[class*="card-title h5"]').should('have.length', 0);
                cy.get('[class*="search__input"]').clear();
                cy.get('[class*="card-title h5"]').should('have.length.above', 0);
            });
            if (i !== nav_bar_elements) {
                cy.get('[class*="gameTag"]').eq(i).click();
                cy.get('[class*="search__input"]').clear();
                cy.get('[class*="gameTag"]').eq(i).invoke('attr', 'class').should('include', 'selected');
            }
        }
    });
});

Cypress.Commands.add('check_game_icons_loaded', () => {
    cy.get('[class="games__element"]').last().find('[class="games__element__card card"]').then(($el) => {
        if ($el.children().length === 3) {
            cy.log("2")
            cy.get('[class="games__element"]').last().find('img').should('exist');
        } else {
            cy.log("3")
            cy.get('[class="games__element"]').last().find('img').should('not.exist');
            cy.get('[class="games__element"]').last().scrollIntoView();
            cy.get('[class="games__element"]').last().find('img').should('exist');
        }
    })
});

Cypress.Commands.add('check_game_categories_content', (type) => {
    cy.wait('@games').its('responseBody').then(body => {
        cy.get('[class*="gameTag"]').then((element) => {
            let nav_bar_elements = element.length;
            for (let i = 1; i < nav_bar_elements; i++) {
                if (i !== nav_bar_elements) {
                    cy.get('[class*="gameTag"]').eq(i).then(($el) => {
                        let me = Object.assign(body.casino);
                        let all_num = 0;
                        for (const key in me) {
                            for (let k = 0; k < me[key].products.length; k++) {
                                if (me[key].products[k].category !== undefined) {
                                    if (me[key].products[k].category.type === type && me[key].products[k].tags[0] === $el.text()) {
                                        all_num++;
                                    }
                                }

                            }
                        }
                        if ($el.text() !== "All Casino Games") {
                            cy.get('[class*="gameTag"]').eq(i).click();
                            cy.get('li[class*="games__element"]').should('have.length', all_num);
                        }
                    });
                }
            }
        });
    });
});
