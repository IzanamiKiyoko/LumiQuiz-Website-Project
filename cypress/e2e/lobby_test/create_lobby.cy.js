describe('Join Lobby', () => {
  it('Test case 1: Host can create lobby with their name', () => {
    cy.visit('http://localhost:3000/lobby/host');
    cy.get('input[name="input name"]').type('Ngọc Ánh');
    cy.get('button[name="btn enter lobby"]').click();
    cy.url().should('include', '/lobby/room');
  });

  it('Test case 2: Empty name is not allow', () => {
    cy.visit('http://localhost:3000/lobby/host');
    cy.get('input[name="input name"]').should('have.value', '');
    cy.get('button[name="btn enter lobby"]').click();
    cy.get('[name="modal"]').should('be.visible');
  });

  it('Test case 3: Name too long is not allow', () => {
    cy.visit('http://localhost:3000/lobby/host');
    cy.get('input[name="input name"]').type('Tên dài thòng lòng quá trời quá đất luôn nè');
    cy.get('button[name="btn enter lobby"]').click();
    cy.get('[name="modal"]').should('be.visible');
  });

  it('Test case 4: Name not allow emoji', () => {
    cy.visit('http://localhost:3000/lobby/host');
    cy.get('input[name="input name"]').type('Tên hài 🤣🤣🤣');
    cy.get('button[name="btn enter lobby"]').click();
    cy.get('[name="modal"]').should('be.visible');
  });

  it('Test case 5: Name has numberic', () => {
    cy.visit('http://localhost:3000/lobby/host');
    cy.get('input[name="input name"]').type('Tên có số 123');
    cy.get('button[name="btn enter lobby"]').click();
    cy.get('[name="modal"]').should('be.visible');
  });
  it('Test case 5: Name has special character', () => {
    cy.visit('http://localhost:3000/lobby/host');
    cy.get('input[name="input name"]').type('!@#$%^&*<>');
    cy.get('button[name="btn enter lobby"]').click();
    cy.get('[name="modal"]').should('be.visible');
  });
});
