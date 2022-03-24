import React from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultProjectInfo from "../components/default/DefaultProjectInfo";
import { GetServerSidePropsContext } from "next";
import { LinkData, ProjectData } from "../types/api";
import { FlagType } from "../types/flag";
import DefaultJsProject from "../components/default/DefaultJsProject";
import DefaultMarkdownProject from "../components/default/DefaultMarkdownProject";
import { LoadProjects } from "../lib/api/project";
import { LoadFile } from "../lib/api/file";
export interface ProjectPageProps {
  name: string;
  title: string;
  flag: FlagType;
  note: string;
  template: string;
  links: LinkData[];
}

export default function ProjectPage(props: ProjectPageProps) {
  return (
    <>
      <DefaultHead>
        <title>{props.title}</title>
      </DefaultHead>
      <DefaultHeader name={props.title} projects />

      {props.flag == "JS" ? (
        <DefaultJsProject name={props.name} template={props.template} />
      ) : (
        <DefaultMarkdownProject name={props.name} template={props.template} />
      )}

      <DefaultFooter name={props.title}>
        <DefaultProjectInfo
          links={props.links.map(({ link, name }) => ({
            name: name,
            link: `http://${link}`,
          }))}
          description={props.note}
        />
      </DefaultFooter>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const name = context.params?.project as string | undefined;
  if (!name) return { notFound: true };

  const project = await LoadProjects<ProjectData>({ name, link_name: "main" });
  if (!project) return { notFound: true };

  if (["Link", "Docker"].includes(project[0].flag)) {
    console.log(project);

    // const main =
    return {
      redirect: {
        basePath: false,
        destination: "http://" + project[0].links[0].link,
        permanent: false,
      },
    };
  }

  console.log(project);
  const template = await LoadFile({
    project: name,
    project_id: project[0].id,
    role: "template",
  });

  return {
    props: {
      ...project[0],
      template: template || "",
    },
  };
};
