import * as React from 'react';
import * as monaco from 'monaco-editor-core';
import { ContextResource } from '../../tbexp-lang/schemaMap.data';
import { setupLanguage } from '../../tbexp-lang/setup';
import { IFieldMeta, MetaValueType } from '@toy-box/meta-schema';
import { languageID } from '../../tbexp-lang/config';

interface IEditorPorps {
  flowAllResource: {
    globalVariables: Record<string, IFieldMeta>;
    localVariables: Record<string, IFieldMeta>;
  };
  formulaText: string;
  formulaType: MetaValueType | undefined;
  onChange:any
}

let edt: any;
const Editor: React.FC<IEditorPorps> = (props: IEditorPorps) => {
  let contextResource = new ContextResource();
  contextResource.localVariable = props.flowAllResource.localVariables;
  contextResource.globalVariables = props.flowAllResource.globalVariables;

  setupLanguage(contextResource, props.formulaType,props.onChange);

  let divNode;
  const assignRef = React.useCallback((node) => {
    // On mount get the ref of the div and assign it the divNode
    divNode = node;
  }, []);

  const setValue = () => {
    edt.setValue('1+2+SUM(1)');
  };

  React.useEffect(() => {
    if (divNode) {
      const editor = monaco.editor.create(divNode, {
        language: languageID,
        minimap: { enabled: false },
        autoIndent: true,
        fontSize: 20,
      });
      edt = editor;
    }

    if (props.formulaText != '') {
      edt.setValue(props.formulaText);
    }
  }, [assignRef]);

  return (
    <div>
      <div>
        <button onClick={setValue}>set value</button>
      </div>
      <div ref={assignRef} style={{ height: '90vh' }}></div>
    </div>
  );
};

export { Editor };
