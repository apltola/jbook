import './text-editor.css';
import MDEditor from '@uiw/react-md-editor';
import { useRef } from 'react';
import { useState, useEffect } from 'react';

const TextEditor: React.FC = () => {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('# Header');

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        editorContainerRef.current &&
        event.target &&
        editorContainerRef.current.contains(event.target as Node)
      ) {
        return;
      }

      setEditing(false);
    };
    document.addEventListener('click', listener, { capture: true });

    return () => document.removeEventListener('click', listener, { capture: true });
  }, []);

  if (editing) {
    return (
      <div ref={editorContainerRef} className="text-editor">
        <MDEditor value={value} onChange={(v) => setValue(v || '')} />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default TextEditor;
