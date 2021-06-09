export const openArticlePage = () => {
  cy.get('nav > div > ul > li.nav-item:nth-child(2) > a')
    .should('have.attr', 'href', '#/article/create')
    .click()
}

export const newArticle = (title, about, body) => {
  cy.get('form > fieldset:nth-child(1) > input').clear().type(title)
  cy.get('form > fieldset:nth-child(2) > input').clear().type(about)
  cy.get('form > fieldset:nth-child(3) > textarea').clear().type(body)
  cy.get('form > button')
    .contains('Publish Article')
    .should('not.be', 'disabled')
    // .should('be.visible')
    .click()
}

export const deleteArticle = () => {
  cy.get('div.banner > div > div > button')
    .contains('Delete Article')
    .should('not.be', 'disabled')
    .click()
}

export const validateArticle = (xhr, httpStatus, articleTitle = '') => {
  cy.wait(xhr).then(({ response }) => {
    expect(response.statusCode).to.eq(httpStatus)
    if (articleTitle !== '') {
      expect(response.body.article.title).to.eq(articleTitle)
    }
  })
}

export const validateArticleError = (xhr, httpStatus) => {
  cy.wait(xhr).then(({ response }) => {
    expect(response.statusCode).to.eq(httpStatus)
    expect(response.body.errors.title[0]).to.eq('can\'t be blank')
    expect(response.body.errors.description[0]).to.eq('can\'t be blank')
    expect(response.body.errors.body[0]).to.eq('can\'t be blank')
  })
}
