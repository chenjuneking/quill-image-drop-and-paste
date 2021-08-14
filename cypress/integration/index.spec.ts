/* eslint-disable @typescript-eslint/ban-ts-comment */
const PAGE_URL = '../../example/script-demo/index.html';
const EDITOR = '#editor-container .ql-editor';

describe('Test example/script-demo/index.html', () => {
  beforeEach(() => {
    cy.visit(PAGE_URL);
  });

  it('elements exists', () => {
    cy.get(EDITOR).should('exist');
  });

  it('paste plain text, editor should display the text', () => {
    const value = 'foo bar';
    cy.get(EDITOR).focus();
    // @ts-ignore
    cy.get(EDITOR).paste({
      type: 'text/plain',
      payload: value,
    });
    cy.get(EDITOR).should('have.text', value);
    cy.window().then((win: any) => {
      const quill = win.quill;
      expect(quill).not.to.be.null;
      expect(quill.getSelection(true).index).to.equal(7);
    });
  });

  it('paste a normal url, editor should display the normal url', () => {
    const value = 'https://raw.githubusercontent.com/chenjuneking/quill-image-drop-and-paste/feature-e2e/lenna.png';
    cy.get(EDITOR).focus();
    // @ts-ignore
    cy.get(EDITOR).paste({
      type: 'text/plain',
      payload: value,
    });
    cy.get(EDITOR).find('img').should('exist').and('have.attr', 'src', value);
    cy.window().then((win: any) => {
      const quill = win.quill;
      expect(quill).not.to.be.null;
      expect(quill.getSelection(true).index).to.equal(1);
    });
  });

  it('paste rich text, editor should display the rich text content', () => {
    // TODO
  });

  it('paste an image, the handler should be called', () => {
    // TODO
  });
});
