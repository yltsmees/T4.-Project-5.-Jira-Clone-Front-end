declare namespace Cypress {
    interface Chainable<Subject> {
        debounced(prevSubject: any, input: any, action: any, value: any): Chainable<any>
  }
}