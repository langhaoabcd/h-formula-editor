import * as React from 'react';
import * as monaco from 'monaco-editor-core';

interface IEditorPorps {
  language: string;
}

let edt: any;

const Editor: React.FC<IEditorPorps> = (props: IEditorPorps) => {
  let divNode: HTMLElement;
  const assignRef = React.useCallback((node) => {
    // On mount get the ref of the div and assign it the divNode
    divNode = node;
  }, []);

  const setValue = () => {
    edt.setValue('COUNT(1,2,3)');
  };
  const getValue = () => {
    alert(edt.getValue());
  };
  const setLocalVariable = () => {
    const localVar = '{!}';
    const p = edt.getPosition();
    edt.executeEdits(edt.getValue(), [
      {
        range: new monaco.Range(p.lineNumber, p.column, p.lineNumber, p.column),
        text: localVar, //nextProps.setRuleContent[nextProps.setRuleContent.length - 1]
      },
    ]);
    edt.focus();
  };
  React.useEffect(() => {
    if (divNode) {
      const editor = monaco.editor.create(divNode, {
        language: props.language,
        minimap: { enabled: false },
        autoIndent: true,
        fontSize: 20,
      });
      edt = editor;
    }
  }, [assignRef]);

  return (
    <div>
      <button onClick={setValue}>set</button>
      <button onClick={getValue}>get value</button>
      <button onClick={setLocalVariable}>insert</button>
      <div ref={assignRef} style={{ height: '90vh' }}></div>
    </div>
  );
};

export { Editor };
