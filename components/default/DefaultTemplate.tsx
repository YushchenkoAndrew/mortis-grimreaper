import { FlagType } from '../../lib/common/types/flag';
import DefaultJsProject from './DefaultJsProject';
import DefaultMarkdownProject from './DefaultMarkdownProject';

export interface DefaultTemplateProps {
  name: string;
  flag: FlagType;
  template: string;
}

export default function DefaultTemplate(props: DefaultTemplateProps) {
  switch (props.flag) {
    case 'JS':
      return <DefaultJsProject name={props.name} template={props.template} />;

    case 'Markdown':
      return (
        <DefaultMarkdownProject name={props.name} template={props.template} />
      );
  }

  return <></>;
}
