describe('casino_games_navigation_bar_cases', () => {
    beforeEach(() => {
        cy.server()
        cy.route('GET', '/tour/getCasinoTournamentInstances*').as('tournament')
        cy.viewport(1920, 4000);
        cy.server();
        cy.route('/lobby/allGames*').as('games');
        cy.clock();
        cy.visit('');
        cy.wait('@tournament')
    });

    it('Check casino games navigation bar appearance', () => {
        cy.percySnapshot('casino_navigation_bar_appearance_test');
    });

    it.skip('Check casino games categories', () => {
        cy.check_game_categories_content("regular");
    });

    it.skip('Check casino games search functionality', () => {
        cy.check_search_functionality();
    });

    it('Check casino games providers filter functionality', () => {
        cy.get('button[class*="providers"]').click();
        cy.wait(1000)
        cy.percySnapshot('casino_providers_appearance_test');
        cy.check_providers_functionality("regular");
    });

    it.skip('Check casino games icons are loaded after scroll', () => {
        cy.check_game_icons_loaded();
    });

});
