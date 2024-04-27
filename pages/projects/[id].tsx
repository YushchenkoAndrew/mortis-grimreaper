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
import P5js from '../../components/Container/P5js';

interface PropsT {
  project: ProjectEntity;
}

export default function (props: PropsT) {
  const container = () => {
    switch (props.project.type) {
      case ProjectTypeEnum.p5js:
        return (
          <P5js
            scripts={AttachmentService.js(props.project.attachments) as any}
          />
        );

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

  return { props: { ...ctx.params, project } };
}
