import {
  navigate,
  signUpWith,
  validateSignUp,
  validateErrorMsg,
} from '../page-actions/register.page.js'
import { createUser } from '../support/faker-generator.js'

describe('Sign up', () => {
  let user
  let userA

  before(() => {
    userA = {
      ...createUser(),
    }
    cy.createUser(userA)
  })

  beforeEach(() => {
    user = {
      ...createUser(),
    }
    navigate()
    cy.intercept({
      method: 'POST',
      url: '/api/users',
    }).as('getUser')
  })

  it('succeeded', () => {
    signUpWith(user.username, user.email, user.password)
    validateSignUp('@getUser', 200, 'OK')
  })

  it('failed, username has already been taken', () => {
    signUpWith(userA.username, user.email, userA.password)
    validateSignUp('@getUser', 422, 'Unprocessable Entity')
    validateErrorMsg(['username has already been taken'])
  })

  it('failed, email has already been taken', () => {
    signUpWith(user.username, userA.email, userA.password)
    validateSignUp('@getUser', 422, 'Unprocessable Entity')
    validateErrorMsg(['email has already been taken'])
  })

  it('failed both', () => {
    signUpWith(userA.username, userA.email, userA.password)
    validateSignUp('@getUser', 422, 'Unprocessable Entity')
    validateErrorMsg([
      'username has already been taken',
      'email has already been taken',
    ])
  })
})
