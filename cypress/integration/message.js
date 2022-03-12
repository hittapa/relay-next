import { login } from './login'
describe('Message', () => {
    beforeEach(() => {
        cy.log(`Visiting http://localhost:3000`)
        cy.visit('/api/auth/signin')
        login();
    })
    it('creates', () => {
        cy.visit('/')
        cy.get('[data-cy=tiles] [data-cy=message]').should('have.length', 1)
        cy.setCookie(Cypress.env('COOKIE_NAME'), Cypress.env('SESSION_TOKEN'));
        cy.get('[data-cy=editor] textarea').type('Hello, World')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=tiles] [data-cy=message]').should('have.length', 2)
        cy.get('[data-cy=edit_mode]').click()
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=trash]').click();
        cy.get('[data-cy=tiles] [data-cy=message]').should('have.length', 1)
    })

    it('deletes', () => {
        cy.visit('/')
        cy.get('[data-cy=tiles] [data-cy=message]').should('have.length', 1)
        cy.setCookie(Cypress.env('COOKIE_NAME'), Cypress.env('SESSION_TOKEN'));
        cy.get('[data-cy=editor] textarea').type('Hello, World')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=tiles] [data-cy=message]').should('have.length', 2)
        cy.get('[data-cy=edit_mode]').click()
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=trash]').click();
        cy.get('[data-cy=tiles] [data-cy=message]').should('have.length', 1)
    })

})