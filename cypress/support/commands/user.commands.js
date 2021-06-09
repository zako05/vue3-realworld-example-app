Cypress.Commands.add('createUser', (user) => {
  Cypress.log({
    name: 'createUser',
    message: `${user.username} | ${user.email} | ${user.password}`,
  })

  const apiUsers = `${Cypress.env('apiUrl')}/users`

  return cy
    .request({
      method: 'POST',
      url: `${apiUsers}`,
      body: {
        user: {
          username: user.username,
          email: user.email,
          password: user.password,
        },
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200)
    })
})
