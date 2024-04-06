import { Dispatch } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { AceEditor } from '../../dynamic';
import NextFormElement from '../Elements/NextFormElement';

export interface ProjectFileEditorFormProps {
  next: Dispatch<void>;
}

export default function ProjectFileEditorForm(
  props: ProjectFileEditorFormProps,
) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.projects.form);

  return (
    <>
      <AceEditor
        className="w-full h-full"
        mode="javascript"
        theme="tomorrow_night"
        name="blah2"
        // onLoad={this.onLoad}
        // onChange={this.onChange}
        fontSize={16}
        tabSize={2}
        lineHeight={19}
        keyboardHandler="vim"
        enableBasicAutocompletion
        enableLiveAutocompletion
        showGutter
        showPrintMargin
        highlightActiveLine
        value={`function onLoad(editor) { console.log("i've loaded"); }`}
        setOptions={{
          spellcheck: true,
          showLineNumbers: true,
          highlightGutterLine: true,
          enableSnippets: false,
        }}
      />

      <NextFormElement processing={form.processing} next={props.next} />
      {/* </div> */}
    </>
  );
}
