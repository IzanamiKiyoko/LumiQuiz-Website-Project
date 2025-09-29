let lobby_id = '751545';
describe('Join Lobby', () => {
  it('Test case 1: Client can join lobby with their name and pin', () => {
    cy.visit('http://localhost:3000/lobby/client');
    cy.get('input[name="input pin"]').type(lobby_id);
    cy.get('input[name="input name"]').type('Ngọc Ánh');
    cy.get('button[name="btn enter lobby"]').click();
    cy.url().should('include', '/lobby/room');
  });

  it('Test case 2: Empty name is not allow', () => {
    cy.visit('http://localhost:3000/lobby/client');
    cy.get('input[name="input pin"]').type(lobby_id);
    cy.get('input[name="input name"]').should('have.value', '');
    cy.get('button[name="btn enter lobby"]').click();
    cy.get('[name="modal"]').should('be.visible');
  });

  it('Test case 2: Empty pin is not allow', () => {
    cy.visit('http://localhost:3000/lobby/client');
    cy.get('input[name="input pin"]').should('have.value', '');
    cy.get('input[name="input name"]').type('Ngọc Ánh');
    cy.get('button[name="btn enter lobby"]').click();
    cy.get('[name="modal"]').should('be.visible');
  });
});
