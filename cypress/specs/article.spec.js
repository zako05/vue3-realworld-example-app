import {
  openArticlePage,
  newArticle,
  deleteArticle,
  validateArticle,
  validateArticleError
} from '../page-actions/article.page.js'
import {
  navigate as navigateLogin,
  loginWith
} from '../page-actions/login.page.js'
import { createUser } from '../support/faker-generator.js'

describe('Article', () => {
  let user

  before(() => {
    // create new user
    user = {
      ...createUser()
    }
    cy.createUser(user)
  })

  beforeEach(() => {
    // load data from fixtures
    cy.fixture('article.json').as('article')
    cy.loginUser(user.email, user.password).as('userToken')
    cy.get('@article').then(article => {
      cy.get('@userToken').then(userToken => {
        // create article for currently logged in user
        cy.createArticle(
          userToken,
          article.article2.title,
          article.article2.about,
          article.article2.body
        ).as('articleCreated')
      })
    })
    // spy on login request
    cy.intercept({
      method: 'POST',
      url: '/api/users/login'
    }).as('getLogin')
    // spy on articles request
    cy.intercept({
      method: 'POST',
      url: '/api/articles'
    }).as('getArticles')
    // spy on "existing article" request
    cy.get('@articleCreated').then(articleCreated => {
      cy.intercept({
        method: 'DELETE',
        url: `/api/articles/${articleCreated.body.article.slug}`
      }).as('deleteArticle')
    })
    cy.intercept({
      method: 'GET',
      url: `/api/profiles/${user.username}`
    }).as('getUserProfile')
    // login with user created in 'before' hook
    navigateLogin()
    loginWith(user.email, user.password)
  })

  it('create succeeded', () => {
    openArticlePage()
    // load data from fixture
    cy.get('@article').then(article => {
      // submit new article
      newArticle(
        article.article1.title,
        article.article1.about,
        article.article1.body
      )
    })
    cy.get('@article').then(article => {
      validateArticle('@getArticles', 200, article.article1.title)
    })
  })

  it('open to edit succeeded', () => {
    // need a user token to edit existing article
    cy.wait('@getLogin')
      .then(({ response }) => {
        return response.body.user.token
      })
      .as('loginToken')
    cy.get('@loginToken').then(loginToken => {
      cy.get('@articleCreated').then(articleCreated => {
        cy.intercept({
          method: 'GET',
          url: `/api/articles/${articleCreated.body.article.slug}`
        }).as('getArticle')
        cy.visit(`/#/profile/${user.username}`, loginToken)
        cy.get(`[href="#/article/${articleCreated.body.article.slug}"]`).click()
        validateArticle('@getArticle', 200)
      })
    })
  })

  it('edit succeeded', () => {
    // need a user token to edit existing article
    cy.wait('@getLogin')
      .then(({ response }) => {
        return response.body.user.token
      })
      .as('loginToken')
    cy.get('@loginToken').then(loginToken => {
      // edit existing article
      cy.get('@articleCreated').then(articleCreated => {
        // spy on "existing article" request
        cy.intercept({
          method: 'GET',
          url: `/api/articles/${articleCreated.body.article.slug}`
        }).as('getArticle')
        cy.visit(
          `/#/article/${articleCreated.body.article.slug}/edit`,
          loginToken
        )
        cy.wait('@getArticle')
        cy.get('@article').then(article => {
          // edit existing article
          newArticle(
            article.article3.title,
            article.article3.about,
            article.article3.body
          )
        })
      })
      cy.get('@article').then(article => {
        // validation adjusted article status & title
        validateArticle('@getArticle', 200, article.article3.title)
      })
    })
  })

  it('delete succeeded', () => {
    cy.wait('@getLogin')
      .then(({ response }) => {
        return response.body.user.token
      })
      .as('loginToken')
    cy.get('@loginToken').then(loginToken => {
      cy.get('@articleCreated').then(articleCreated => {
        // spy on "existing article" request
        cy.intercept({
          method: 'GET',
          url: `/api/articles/${articleCreated.body.article.slug}`
        }).as('getArticle')
        cy.visit(`/#/article/${articleCreated.body.article.slug}`, loginToken)
        cy.wait('@getArticle')
        deleteArticle()
        validateArticle('@deleteArticle', 200)
      })
    })
  })

  // article body, desc & title can't be blank
  it('create failed', () => {
    openArticlePage()
    // load data from fixture
    cy.get('@article').then(article => {
      // submit new article
      newArticle(' ', ' ', ' ')
    })
    cy.get('@article').then(article => {
      validateArticleError('@getArticles', 422)
    })
  })
})
