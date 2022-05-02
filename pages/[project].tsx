import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultProjectInfo from "../components/default/DefaultProjectInfo";
import { GetServerSidePropsContext } from "next";
import { LinkData, ProjectData } from "../types/api";
import { FlagType } from "../types/flag";
import { LoadRecords } from "../lib/api/api";
import { LoadFile } from "../lib/api/file";
import { formPath } from "../lib/public/files";
import { HtmlMarkers } from "../config/placeholder";
import { voidUrl } from "../config";
import DefaultTemplate from "../components/default/DefaultTemplate";
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

      <DefaultTemplate
        flag={props.flag}
        name={props.name}
        template={props.template}
      />

      <DefaultFooter name={props.title}>
        <DefaultProjectInfo
          links={props.links.map(({ link, name }) => ({
            name: name,
            link:
              "http://" +
              link
                .replace(new RegExp(HtmlMarkers.FILE_SERVER, "g"), voidUrl)
                .replace(new RegExp(HtmlMarkers.PROJECT_NAME, "g"), props.name)
                .replace(/http:\/\/|https:\/\//g, ""),
          }))}
          description={props.note}
        />
      </DefaultFooter>
    </>
  );
}

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext) => {
  const project = await LoadRecords<ProjectData>("project", {
    name: params?.project || "",
    "link[name]": "main",
    "file[role]": "template",
  });

  if (!project) return { notFound: true };
  if (["Link", "Docker"].includes(project[0].flag)) {
    return {
      redirect: {
        basePath: false,
        permanent: false,
        destination:
          "http://" +
          project[0].links[0].link
            .replace(new RegExp(HtmlMarkers.FILE_SERVER, "g"), voidUrl)
            .replace(new RegExp(HtmlMarkers.PROJECT_NAME, "g"), project[0].name)
            .replace(/http:\/\/|https:\/\//g, ""),
      },
    };
  }

  return {
    props: {
      ...project[0],
      template: await LoadFile(
        `${project[0].name}/${formPath(project[0].files[0])}`
      ),
    },
  };
};
