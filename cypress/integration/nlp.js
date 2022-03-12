describe('Category', () => {
    it('gets', () => {
        cy.request({
            method: 'POST',
            url: Cypress.env('SITE_NAME') + '/api/nlp',
            body: {
                text: 'Align helps bay area tech reps stay ahead of the pack when it comes to understanding the tech they sell.'
            }
        })
    })

    it('generates predictive text', () => {
        cy.setCookie(Cypress.env('COOKIE_NAME'), Cypress.env('SESSION_TOKEN'));
        cy.visit('/')
        cy.get('[data-cy=edit_mode]').click()
        cy.get('[data-cy=editor] .ProseMirror').click()
        cy.get('[data-cy=editor] .ProseMirror').type('cy test')
        cy.get('[data-cy=editor] .ProseMirror').invoke('text').then((text) => {
            expect(text.length).to.be.at.least(8)
        })
    })
})