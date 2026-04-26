describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('GET', '**/api/orders', { fixture: 'orders-history.json' }).as('getOrders');
    
    cy.setCookie('accessToken', 'Bearer mock-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });
    
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });

  it('должен создать заказ и очистить конструктор', () => {
    // Булка
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093d"]')
      .find('button')
      .click();
    
      // Начинка
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]')
      .find('button')
      .click();
    
    cy.contains('Оформить заказ').click();
    
    cy.wait('@createOrder');
    
    cy.get('#modals').should('contain', '12345');
    
    cy.get('#modals button').click();
    
    cy.get('[class*="constructor-element_pos_top"]').should('not.exist');
    cy.get('[class*="constructor-element"]').should('have.length', 0);
  });
});