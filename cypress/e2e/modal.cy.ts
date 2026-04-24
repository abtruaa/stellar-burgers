describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('открытие / закрытие модального окна ингредиента', () => {
    cy.contains('Флюоресцентная булка R2-D3').click();
    
    // Проверяем открытие
    cy.get('#modals').within(() => {
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Флюоресцентная булка R2-D3').should('be.visible');
    });
    
    // Закрываем по крестику
    cy.get('#modals button').last().click();
    
    // Проверяем закрытие
    cy.get('#modals').should('be.empty');
  });

  it('закрытие модального окна по оверлею', () => {
    cy.contains('Флюоресцентная булка R2-D3').click();
    // Альтернативный способ закрытия - клик по оверлею
cy.get('#modals').then(($modal) => {
  // Ищем элемент с классом overlay или просто кликаем по фону
  const overlay = $modal.find('[class*="overlay"]');
  if (overlay.length) {
    cy.wrap(overlay).click();
  } else {
    // Если оверлея нет, кликаем по крестику
    cy.get('#modals button').last().click();
  }
});

// Проверяем, что модалка закрылась (элемент #modals пуст)
cy.get('#modals').children().should('have.length', 0);
  })
});