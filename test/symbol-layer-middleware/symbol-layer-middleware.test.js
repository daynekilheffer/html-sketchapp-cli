const { promisify } = require('es6-promisify');
const rimrafAsync = promisify(require('rimraf'));
const path = require('path');
const { exec } = require('child-process-promise');
const dirContentsToObject = require('../_utils/dirContentsToObject');

const distPath = path.join(__dirname, 'dist');

beforeEach(() => rimrafAsync(distPath));

describe('symbol-layer-middleware', () => {
  test('function', async () => {
  await exec('node ../../bin/cli', { cwd: __dirname });

    const output = await dirContentsToObject(distPath);
    expect(output).toMatchSnapshot();
  });

  test('string', async () => {
    await exec('node ../../bin/cli --puppeteer-args="--no-sandbox --disable-setuid-sandbox" --out-dir dist --file index.html --symbol-layer-middleware symbol.layer.middleware.js', { cwd: __dirname });

    const output = await dirContentsToObject(distPath);
    expect(output).toMatchSnapshot();
  });
  test('expose node', async () => {
    await exec('node ../../bin/cli --puppeteer-args="--no-sandbox --disable-setuid-sandbox" --out-dir dist --file index.html --symbol-layer-middleware symbol-layer.with-nodes.middleware.js', { cwd: __dirname });

    const output = await dirContentsToObject(distPath);
    console.log(JSON.stringify(output, ' ', 2));
    expect(output).toMatchObject({
      'document.page.json': expect.objectContaining({
        layers: [
          expect.objectContaining({
            name: 'node class Symbol 1',
          }),
          expect.objectContaining({
            name: 'node class Symbol 2',
          }),
          expect.objectContaining({
            name: 'node class Symbol 3',
          })
        ]
      })
    })
  })
})
