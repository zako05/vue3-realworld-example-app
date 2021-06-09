export const navigate = () => {
  cy.visit('/#/register')
}
export const signUpWith = (username, email, password) => {
  cy.get('form > fieldset:nth-child(1) > input').type(username)
  cy.get('form > fieldset:nth-child(2) > input').type(email)
  cy.get('form > fieldset:nth-child(3) > input').type(password)
  cy.get('form > button').click()
}

export const validateSignUp = (xhr, httpStatus, httpMsg) => {
  cy.wait(xhr).then(({ response }) => {
    expect(response.statusCode).to.eq(httpStatus)
    expect(response.statusMessage).to.eq(httpMsg)
  })
}

export const validateErrorMsg = msgs => {
  for (let i = 0; i < msgs.length; i++) {
    cy.get('ul.error-messages').contains(msgs[i]).should('be.visible')
  }
}
