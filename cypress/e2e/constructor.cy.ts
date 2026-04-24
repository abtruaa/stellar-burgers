// cypress/e2e/order.cy.ts
describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'Bearer mock-token');
      win.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });
    
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('добавить ингредиент из списка в конструктор', () => {
    cy.contains('Флюоресцентная булка R2-D3')
      .parent()
      .parent()
      .find('button')
      .click();
    
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent()
      .parent()
      .find('button')
      .click();

  });
});