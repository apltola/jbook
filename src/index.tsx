import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState('');

  useEffect(() => {
    async function startService() {
      ref.current = await esbuild.startService({
        worker: true,
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
      });
    }

    startService();
  }, []);

  async function onClick() {
    if (!ref.current || !iframe.current) return;

    iframe.current.srcDoc = html;

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    // setCode(result.outputFiles[0].text);
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  }

  const html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data)
            } catch (err) {
              document.querySelector('#root').innerHTML = '<div><h4>Runtime error!</h4>' + err + '</div>'
              document.querySelector('#root').style = "color: orange";
              console.error(err);
            }
          }, false)
        </script>
      </body>
    </html>
  `;

  return (
    <div>
      <textarea
        style={{ width: '400px', height: '200px' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe ref={iframe} srcDoc={html} title="preview" sandbox="allow-scripts"></iframe>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
