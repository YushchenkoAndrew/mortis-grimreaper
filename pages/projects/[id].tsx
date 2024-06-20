import { GetServerSidePropsContext } from 'next';
import { Config } from '../../config';
import { ProjectEntity } from '../../lib/project/entities/project.entity';
import { AttachmentService } from '../../lib/attachment/attachment.service';
import { ProjectTypeEnum } from '../../lib/project/types/project-type.enum';
import Emscripten from '../../components/Container/Project/Emscripten';
import P5js from '../../components/Container/Project/P5js';
import Markdown from '../../components/Container/Project/Markdown';
import Html from '../../components/Container/Project/Html';
import { AttachmentEntity } from '../../lib/attachment/entities/attachment.entity';
import { marked } from 'marked';
import DefaultLayout from '../../components/Container/Layout/DefaultLayout';

interface PropsT {
  project: ProjectEntity;
  html: string;
  preview: [string, string][];
}

export default function (props: PropsT) {
  const container = () => {
    switch (props.project.type) {
      case ProjectTypeEnum.p5js:
        return <P5js html={props.html} preview={props.preview} />;

      case ProjectTypeEnum.emscripten:
        return <Emscripten html={props.html} preview={props.preview} />;

      case ProjectTypeEnum.markdown:
        return <Markdown html={props.html} preview={props.preview} />;

      case ProjectTypeEnum.html:
        return <Html html={props.html} preview={props.preview} />;

      default:
        <></>;
    }
  };

  return (
    <DefaultLayout title={props.project.name}>{container()}</DefaultLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const project: ProjectEntity = await ProjectEntity.self.load
    .build(ctx.params.id, { hostname: Config.self.base.grape })
    .then((res) => JSON.parse(JSON.stringify(res)))
    .catch(() => null);

  if (!project) return { redirect: { destination: '/projects' } };
  if (project.redirect?.link) return { redirect: { destination: project.redirect.link } }; // prettier-ignore

  try {
    const Handlebars = await import('handlebars');
    const { existsSync, readFileSync } = await import('fs');

    // FIXME: Select only files where attachment.preview = true
    const files = AttachmentService.filter(project.type, project.attachments);
    const preview = await Promise.all(
      files.map((e) =>
        AttachmentEntity.self.load
          .text(e.id, { hostname: Config.self.base.grape })
          .then((text) => [e.name, text]),
      ),
    );

    const first = preview?.[0]?.[1];
    const scripts = AttachmentService.filter(
      ProjectTypeEnum.p5js,
      project.attachments,
    ).map((e) => new AttachmentEntity(e as any)._url());

    const filename = `html/${project.type}-template.html.hbs`;
    const template = (existsSync(filename) && readFileSync(filename, 'utf-8')) || ''; // prettier-ignore
    const markdown = project.type == ProjectTypeEnum.markdown && first && (await marked.parse(first)); // prettier-ignore

    const html = Handlebars.compile(template)({
      scripts,
      title: project.name,
      web: Config.self.base.web,
      markdown: markdown || '',
    });

    return { props: { ...ctx.params, html, project, preview } };
  } catch (_) {
    return { redirect: { destination: '/projects' } };
  }
}
