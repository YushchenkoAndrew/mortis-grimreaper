import { ProjectContainer } from './ProjectContainer';
import { memo } from 'react';
import { RenderHtml } from '../../dynamic';

export default memo(function Markdown(props: ProjectContainer) {
  return (
    <RenderHtml
      className="w-full h-full overflow-y-hidden pl-5"
      html={props.html}
      setOptions={{
        height: 'calc(100vh - 4rem)',
        containerHeighOffset: 8,
        containerClassName: `overflow-y-auto block relative`,
      }}
    />
  );
});
