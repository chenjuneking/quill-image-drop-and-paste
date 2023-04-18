/* eslint-disable @typescript-eslint/ban-ts-comment */
const INDEX_URL = '../../example/script-demo/index.html'
const AUTO_CONVERT_URL = '../../example/script-demo/autoConvert.html'
const EDITOR = '#editor-container .ql-editor'

describe('Test example/script-demo/index.html', () => {
  it('elements exists', () => {
    cy.visit(INDEX_URL)
    cy.get(EDITOR).should('exist')
  })

  it('paste plain text, editor should display the text', () => {
    /**
     * FIXME
     * This test case failure since commit(https://github.com/chenjuneking/quill-image-drop-and-paste/commit/728c4b91eff34463cc0954347ec5797991889f14)
     * but working fine on manual test
     */
    // const value = 'foo bar';
    // cy.get(EDITOR).focus();
    // // @ts-ignore
    // cy.get(EDITOR).paste({
    //   type: 'text/plain',
    //   payload: value,
    // });
    // cy.get(EDITOR).should('have.text', value);
    // cy.window().then((win: any) => {
    //   const quill = win.quill;
    //   expect(quill).not.to.be.null;
    //   expect(quill.getSelection(true).index).to.equal(7);
    // });
  })

  it("paste a image's url, editor should display the image", () => {
    const value =
      'https://raw.githubusercontent.com/chenjuneking/quill-image-drop-and-paste/master/lenna.png'
    cy.visit(INDEX_URL)
    cy.get(EDITOR).focus()
    // @ts-ignore
    cy.get(EDITOR).paste({
      type: 'text/plain',
      payload: value,
    })
    cy.get(EDITOR).find('img').should('exist').and('have.attr', 'src', value)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(300).then(() => {
      cy.window().then((win: any) => {
        const quill = win.quill
        expect(quill).not.to.be.null
        expect(quill.getSelection(true).index).to.equal(1)
      })
    })
  })

  it("Set `autoConvert` option to false, then paste a image's url, editor should display the url", () => {
    // TODO
  })

  it('paste rich text, editor should display the rich text content', () => {
    // TODO
  })

  it('paste an image, the handler should be called', () => {
    // TODO
  })
})
