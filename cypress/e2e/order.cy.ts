// cypress/e2e/order.cy.ts
describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'Bearer mock-token');
      win.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });
    
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('создать заказ и показать номер', () => {
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
    
    cy.contains('Оформить заказ').click();
    
    cy.wait('@createOrder');
    
    // Проверяем модальное окно
    // Проверяем, что модальное окно открылось и содержит номер заказа
    cy.get('#modals', { timeout: 10000 })
      .should('exist')
      .within(() => {
        cy.contains('12345').should('be.visible');
        cy.contains('идентификатор заказа').should('be.visible');
      });
    
    // Закрываем модальное окно (клик на крестик)
    cy.get('#modals button').click();
    
    // Проверяем, что модальное окно закрылось
    cy.get('#modals').should('be.empty');
    
    // Проверяем, что конструктор пуст (нет ингредиентов)
    cy.get('[class*="constructor-element"]').should('have.length', 0);
  });
});