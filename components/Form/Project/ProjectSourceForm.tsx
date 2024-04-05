import { Dispatch } from 'react';
import { Config } from '../../../config';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import NextFormElement from '../Elements/NextFormElement';

export interface ProjectSourceFormProps {
  next: Dispatch<void>;
}

export default function ProjectSourceForm(props: ProjectSourceFormProps) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.projects.form);

  return (
    <>
      <div className="flex items-center">
        <img
          className="h-14 w-auto rounded my-8 mr-3"
          src={Config.self.github.src}
          alt="Admin"
        />

        <span className="text-2xl font-semibold">{form.name}</span>
      </div>
      {/* <AceEditor
        className="w-full"
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
      /> */}

      <NextFormElement processing={form.processing} next={props.next} />
      {/* </div> */}
    </>
  );
}
