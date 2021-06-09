import { navigate, loginWith, validLogin } from '../page-actions/login.page.js'
import { createUser } from '../support/faker-generator.js'

describe('Login', () => {
  let userA

  before(() => {
    userA = {
      ...createUser(),
    }
    cy.createUser(userA)
  })

  beforeEach(() => {
    cy.intercept({
      method: 'POST',
      url: '/api/users/login',
    }).as('getLogin')
    navigate()
  })

  it('succeeded', () => {
    loginWith(userA.email, userA.password)
    validLogin('@getLogin', 200, 'OK')
  })

  it('failed', () => {
    loginWith(userA.email, 'wrongPassword')
    validLogin('@getLogin', 422, 'Unprocessable Entity')
    cy.get('.error-messages > li')
      .contains('email or password is invalid')
      .should('be.visible')
  })
})
