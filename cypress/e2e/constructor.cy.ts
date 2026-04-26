describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    // cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    // В конструктор можно добавлять ингредиенты без авторизации
    // cy.window().then((win) => {
    //   win.localStorage.setItem('accessToken', 'Bearer mock-token');
    //   win.localStorage.setItem('refreshToken', 'mock-refresh-token');
    // });
    
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('добавить ингредиент из списка в конструктор', () => {
    // Булка
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093d"]')
      .find('button').click();

    cy.get('[class*="constructor-element_pos_top"]').should('contain', 'Флюоресцентная булка R2-D3');
    cy.get('[class*="constructor-element_pos_bottom"]').should('contain', 'Флюоресцентная булка R2-D3');
  
    // Начинка
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]')
      .find('button')
      .click();
    cy.get('[class*="constructor-element"]').should('contain', 'Биокотлета из марсианской Магнолии');

  });
});