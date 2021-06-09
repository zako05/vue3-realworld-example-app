Cypress.Commands.add('createArticle', (token, title, about, body) => {
  Cypress.log({
    name: 'createArticle',
    message: `${token} ${title} | ${about} | ${body}`,
  })

  const apiArticles = `${Cypress.env('apiUrl')}/articles`

  return cy
    .request({
      method: 'POST',
      url: `${apiArticles}`,
      headers: {
        authorization: `Token ${token}`,
      },
      body: {
        article: {
          title: title,
          description: about,
          body: body,
        },
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200)
      // return response.article.slug
    })
})
