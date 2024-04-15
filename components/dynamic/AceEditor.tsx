import AceEditor from 'react-ace';
import { IAceEditorProps } from 'react-ace/lib/ace';

import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';
import { Vim } from 'ace-builds/src-noconflict/keybinding-vim';
import 'ace-builds/src-noconflict/ext-spellcheck';

import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-handlebars';
import 'ace-builds/src-noconflict/mode-javascript';
import modelist from 'ace-builds/src-noconflict/ext-modelist';

export default function (props: IAceEditorProps) {
  Vim.defineEx('write', 'w', ({ ace }) => {
    ace.execCommand('write');
  });
  return <AceEditor {...props} />;
}

export const mode = modelist;
