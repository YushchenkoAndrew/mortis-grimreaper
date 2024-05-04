import { GetServerSidePropsContext } from 'next';
import { Config } from '../../config';
import Header from '../../components/Header/Header';
import Container from '../../components/Container/Container';
import GlitchItem from '../../components/Navbar/GlitchItem';
import { NAVIGATION } from '../../constants';
import Navbar from '../../components/Navbar/Navbar';
import { ProjectEntity } from '../../lib/project/entities/project.entity';
import { AttachmentService } from '../../lib/attachment/attachment.service';
import { ProjectTypeEnum } from '../../lib/project/types/project-type.enum';
import Emscripten from '../../components/Container/Project/Emscripten';
import P5js from '../../components/Container/Project/P5js';
import Markdown from '../../components/Container/Project/Markdown';
import { AttachmentEntity } from '../../lib/attachment/entities/attachment.entity';
import { useMemo } from 'react';
import Html from '../../components/Container/Project/Html';

interface PropsT {
  project: ProjectEntity;
  preview: [string, string][];
}

export default function (props: PropsT) {
  const scripts = useMemo(() => {
    return AttachmentService.filter(
      ProjectTypeEnum.p5js,
      props.project.attachments,
    ).map((e) => new AttachmentEntity(e as any));
  }, [props.project]);

  const container = () => {
    switch (props.project.type) {
      case ProjectTypeEnum.p5js:
        return <P5js scripts={scripts} preview={props.preview} />;

      case ProjectTypeEnum.emscripten:
        return <Emscripten scripts={scripts} preview={props.preview} />;

      case ProjectTypeEnum.markdown:
        return <Markdown scripts={scripts} preview={props.preview} />;

      case ProjectTypeEnum.html:
        return <Html scripts={scripts} preview={props.preview} />;

      default:
        <></>;
    }
  };

  return (
    <>
      <Header title={props.project.name}></Header>

      <Container
        className="overflow-y-hidden w-full h-[calc(100vh-4rem)]"
        Navbar={
          <Navbar
            Item={GlitchItem}
            navigation={NAVIGATION.default}
            avatar={Config.self.github}
          />
        }
      >
        {container()}
      </Container>
    </>
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
    // FIXME: Select only files where attachment.preview = true
    const files = AttachmentService.filter(project.type, project.attachments);
    const preview = await Promise.all(
      files.map((e) =>
        AttachmentEntity.self.load
          .text(e.id, { hostname: Config.self.base.grape })
          .then((text) => [e.name, text]),
      ),
    );

    return { props: { ...ctx.params, project, preview } };
  } catch (_) {
    return { redirect: { destination: '/projects' } };
  }
}
