Cypress.Commands.add('loginUser', (email, password) => {
  Cypress.log({
    name: 'loginUser',
    message: ` ${email} | ${password}`,
  })

  const apiLogin = `${Cypress.env('apiUrl')}/users/login`
  // const apiLogin = `/#/login`
  let token

  cy.request({
    method: 'POST',
    url: `${apiLogin}`,
    form: true,
    body: {
      user: {
        email: email,
        password: password,
      },
    },
  }).then((response) => {
    expect(response.status).to.eq(200)
    token = response.body.user.token
    return token
  })
})
