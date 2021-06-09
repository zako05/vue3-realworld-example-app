export const navigate = () => {
  cy.visit('/#/login')
}

export const loginWith = (username, password) => {
  cy.get('form > fieldset:nth-child(1) > input').type(username)
  cy.get('form > fieldset:nth-child(2) > input').type(password)
  cy.get('form > button').click()
}

export const validLogin = (xhr, httpStatus, httpMesg) => {
  cy.wait(xhr).then(({ response }) => {
    expect(response.statusCode).to.eq(httpStatus)
    expect(response.statusMessage).to.eq(httpMesg)
  })
}
