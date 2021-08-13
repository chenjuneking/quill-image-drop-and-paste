import { ClientFunction, Selector } from 'testcafe';

const editor = Selector('#editor-container .ql-editor');
const execPaste = ClientFunction(() => document.execCommand('paste'));

fixture`Open example/script-demo/index.html`.page`../example/script-demo/index.html`;

test('page loaded', async (t: TestController) => {
  await t.expect(editor.exists).ok();
});

test('paste plain text, editor should display the text', async (t: TestController) => {
  // const text = 'foo bar';
  const text = 'https://t7.baidu.com/it/u=1330338603,908538247&fm=193&f=GIF';
  await t.typeText(editor, text, { paste: true });
  // await t.expect()
  // await t.expect(true).eql(true);
});

// test('paste html text, editor should display the html text', async (t: TestController) => {
//   await t.expect(true).eql(true);
// });

// test('paste a normal url, editor should display the normal url', async (t: TestController) => {
//   await t.expect(true).eql(true);
// });

// test("paste an image's url, editor should display the image", async (t: TestController) => {
//   await t.expect(true).eql(true);
// });

// test("paste an image's data url, the handler should be called", async (t: TestController) => {
//   await t.expect(true).eql(true);
// });
