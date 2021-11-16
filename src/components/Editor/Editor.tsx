import * as React from 'react';
import * as monaco from 'monaco-editor-core';
import { IFieldMeta } from '@toy-box/meta-schema';
// import { SchemaMapWraper } from '../../language-service/schemaMap.data';

interface IEditorPorps {
  language: string;
}
let edt: any;
const Editor: React.FC<IEditorPorps> = (props: IEditorPorps) => {
  let divNode;
  const assignRef = React.useCallback((node) => {
    // On mount get the ref of the div and assign it the divNode
    divNode = node;
  }, []);

  const initSchemaMap=() =>{
    // SchemaMapWraper.getInstance().setSchemaMap(schemaMap);//todo store redux
  }
  const setValue = () => {
    edt.setValue('COUNT(1,2,3)');
  };
  const getValue = () => {
    alert(edt.getValue());
  };
  const getReturnType=()=>{
    alert('');//todo 获取redux?
  }

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
      <div>
        <button disabled onClick={initSchemaMap}>
          initSchemaMap
        </button>
        <button onClick={setValue}>set value</button>
        <button onClick={getValue}>get value</button>
        <button onClick={getReturnType}>get returnType</button>
        {/* <span> 约定：全局变量$variable; 局部变量!variable</span> */}
      </div>
      <div ref={assignRef} style={{ height: '90vh' }}></div>
    </div>
  );
};

export { Editor };
