import { ProjectContainer } from './ProjectContainer';
import { memo, useEffect, useState } from 'react';
import { RenderHtml } from '../../dynamic';
import { ErrorService } from '../../../lib/common/error.service';
import { StringService } from '../../../lib/common';

export default memo(function Markdown(props: ProjectContainer) {
  const [html, setHtml] = useState<string>(null);

  useEffect(() => {
    ErrorService.envelop(async () => {
      const [index] = props.preview;
      if (!index) return;

      const [_, text] = index;
      setHtml(await StringService.markdown(text));
    });
  }, []);

  return (
    <RenderHtml
      className="w-full h-full overflow-y-hidden pl-5"
      html={html}
      setOptions={{
        height: 'calc(100vh - 4rem)',
        containerHeighOffset: 8,
        containerClassName: `overflow-y-auto block relative`,
      }}
    />
  );
});
