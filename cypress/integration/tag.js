import { login } from './login'
describe('Tag', () => {
    beforeEach(() => {
        cy.log(`Visiting http://localhost:3000`)
        cy.visit('/api/auth/signin')
        login();
    })
    it('creates', () => {
        cy.visit('/')
        // create category
        cy.get('[data-cy=category]').should('have.length', 0)
        cy.setCookie(Cypress.env('COOKIE_NAME'), Cypress.env('SESSION_TOKEN'));
        cy.get('[data-cy=edit_mode]').click()
        cy.get('[data-cy=add_category_name]').type('cy test')
        cy.get('[data-cy=add_category_button]').click()
        cy.get('[data-cy=category]').should('have.length', 1)
        // create tag
        cy.get('[data-cy=add_tag_text]').type('test')
        cy.get('[data-cy=add_tag_button]').click()
        cy.get('[data-cy=category]:first-child [data-cy=tag]').should('have.length', 1)
        // create message
        cy.get('[data-cy=tiles] [data-cy=message]').should('have.length', 1)
        cy.get('[data-cy=editor] textarea').type('Hello, World')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=tiles] [data-cy=message]').should('have.length', 2)
        // add tag to message
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=message_tag]').should('have.length', 0)
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=add_tag_to_message]').click()
        cy.get('[data-cy=category]:first-child [data-cy=tag]').click()
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=message_tag]').should('have.length', 1)
        // teardown
        cy.get('[data-cy="category"]:first-child > div:first-child [data-cy="trash"]').click()
        cy.get('[data-cy=alert_confirm').click()
        cy.get('[data-cy=category]').should('have.length', 0)
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=trash]').click();
        cy.get('[data-cy=tiles] [data-cy=message]').should('have.length', 1)
    })

    it('deletes', () => {
        cy.visit('/')
        // create category
        cy.get('[data-cy=category]').should('have.length', 0)
        cy.setCookie(Cypress.env('COOKIE_NAME'), Cypress.env('SESSION_TOKEN'));
        cy.get('[data-cy=edit_mode]').click()
        cy.get('[data-cy=add_category_name]').type('cy test')
        cy.get('[data-cy=add_category_button]').click()
        cy.get('[data-cy=category]').should('have.length', 1)
        // create tag
        cy.get('[data-cy=add_tag_text]').type('test')
        cy.get('[data-cy=add_tag_button]').click()
        cy.get('[data-cy=category]:first-child [data-cy=tag]').should('have.length', 1)
        // create message
        cy.get('[data-cy=tiles] [data-cy=message]').should('have.length', 1)
        cy.get('[data-cy=editor] textarea').type('Hello, World')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=tiles] [data-cy=message]').should('have.length', 2)
        // add tag to message
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=message_tag]').should('have.length', 0)
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=add_tag_to_message]').click()
        cy.get('[data-cy=category]:first-child [data-cy=tag]').click()
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=message_tag]').should('have.length', 1)
        // delete tag from message
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=delete_tag_from_message]').click()
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=message_tag]').should('have.length', 0)
        // add tag to message
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=add_tag_to_message]').click()
        cy.get('[data-cy=category]:first-child [data-cy=tag]').click()
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=message_tag]').should('have.length', 1)
        // delete tag
        cy.get('[data-cy=category]:first-child [data-cy=tag_container] [data-cy=trash]').click()
        cy.get('[data-cy=alert_confirm').click()
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=message_tag]').should('have.length', 0)
        cy.get('[data-cy=category]:first-child [data-cy=tag]').should('have.length', 0)
        // teardown
        cy.get('[data-cy=category]:first-child [data-cy=trash]').click()
        cy.get('[data-cy=alert_confirm').click()
        cy.get('[data-cy=category]').should('have.length', 0)
        cy.get('[data-cy=tiles] [data-cy=message]:first-child [data-cy=trash]').click();
        cy.get('[data-cy=tiles] [data-cy=message]').should('have.length', 1)
    })

})