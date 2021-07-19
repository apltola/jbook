import './preview.css';
import { useEffect } from 'react';
import { useRef } from 'react';

interface PreviewProps {
  code: string;
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

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcDoc = html;
    iframe.current.contentWindow.postMessage(code, '*');
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        className="preview-frame"
        ref={iframe}
        srcDoc={html}
        title="preview"
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default Preview;
