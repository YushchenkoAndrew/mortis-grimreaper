import { ProjectContainer } from './ProjectContainer';
import { memo } from 'react';
import { RenderHtml } from '../../dynamic';

export default memo(function Html(props: ProjectContainer) {
  return (
    <RenderHtml
      className="w-full h-full overflow-y-hidden pl-5"
      html={props.preview[0]?.[1]}
      setOptions={{
        height: 'calc(100vh - 4rem)',
        containerHeighOffset: 8,
        containerClassName: `overflow-y-auto block relative`,
      }}
    />
  );
});
