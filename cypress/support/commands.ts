// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Simulates a paste event.
 * Modified from https://gist.github.com/nickytonline/bcdef8ef00211b0faf7c7c0e7777aaf6
 *
 * @param subject A jQuery context representing a DOM element.
 * @param pasteOptions Set of options for a simulated paste event.
 * @param pasteOptions.pastePayload Simulated data that is on the clipboard.
 * @param pasteOptions.pasteFormat The format of the simulated paste payload. Default value is 'text'.
 *
 * @returns The subject parameter.
 *
 * @example
 * cy.get('body').paste({
 *   type: 'application/json',
 *   payload: {hello: 'yolo'},
 * });
 */
Cypress.Commands.add('paste', { prevSubject: true }, function (subject, pasteOptions) {
  const { payload, type } = pasteOptions;
  const data = type === 'application/json' ? JSON.stringify(payload) : payload;
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
  const clipboardData = new DataTransfer();
  clipboardData.setData(type, data);
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
  const pasteEvent = new ClipboardEvent('paste', {
    bubbles: true,
    cancelable: true,
    // type: type,
    // data,
    clipboardData,
  });
  subject[0].dispatchEvent(pasteEvent);
  return subject;
});
