export const createUser = () => {
  return {
    username: cy.faker.internet.userName(),
    email: cy.faker.internet.exampleEmail().toLowerCase(),
    password: cy.faker.internet.password()
  }
}
