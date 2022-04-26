import DefaultHeader from "../../../components/admin/default/DefaultHeader";
import DefaultHead from "../../../components/default/DefaultHead";
import { checkIfUserExist } from "../../../lib/api/session";
import { TreeObj } from "../../../types/tree";
import { basePath, voidUrl } from "../../../config";
import { ProjectData } from "../../../types/api";
import sessionConfig from "../../../config/session";
import { PROJECT_TREE } from "../../../config/placeholder";
import { Provider } from "react-redux";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import DefaultOperationsForm from "../../../components/admin/default/project/DefaultOperationsForm";
import { store } from "../../../redux/admin/projects/storage";
import { LoadProjects } from "../../../lib/api/project";
import { addFile, allowedReader, formPath } from "../../../lib/public/files";
import { LoadFile } from "../../../lib/api/file";
import { CapitalizeString } from "../../../lib/public/string";
import { CRON_TIME } from "../../../redux/admin/projects/reducer/preview";

export interface ProjectOperationProps {
  code?: { tree: TreeObj };
  preview?: { [name: string]: any };
}

export default function ProjectOperation(props: ProjectOperationProps) {
  const router = useRouter();

  return (
    <>
      <DefaultHead>
        <title>
          {CapitalizeString(
            [...(router.query?.operations ?? []), ""]
              .slice(0, 2)
              .join(" Project ")
              .replace(/ $/, "")
          )}
        </title>
      </DefaultHead>
      <DefaultHeader />

      <Provider store={store}>
        <DefaultOperationsForm
          operation={router.query?.operations?.[0] ?? "create"}
          preview={props.preview}
          code={props.code}
        />
      </Provider>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, params }) {
    const operations: string[] = (params?.operations as string[]) || [];
    if (!req.session.user || !(await checkIfUserExist(req.session.user))) {
      return {
        redirect: {
          basePath: false,
          destination: `${basePath}/admin/login`,
          permanent: false,
        },
      };
    }

    switch (operations[0]) {
      case "create":
        return { props: {} };

      case "update":
        if (!operations[1]) break;
        const project = await LoadProjects<ProjectData>({
          name: operations[1],
        });

        if (!project || !project.length) break;

        let tree = PROJECT_TREE;
        let img = `${basePath}/img/CodeRain.webp`;

        for (let file of project[0].files) {
          const path = `${project[0].name}/${formPath(file)}`;
          if (file.role === "thumbnail") img = `${voidUrl}/${path}`;

          const content = allowedReader.includes(file.type)
            ? await LoadFile(path)
            : null;

          tree = addFile(tree, { dir: file.path, role: file.role }, [
            { ...file, url: `${voidUrl}/${path}`, content },
          ]);
        }

        return {
          props: {
            preview: {
              ...["id", "name", "flag", "title", "desc", "note"].reduce(
                (acc, key) => ({ ...acc, [key]: project[0][key] }),
                { img }
              ),

              links: project[0].links.reduce(
                (acc, curr) => ({ ...acc, [curr.name]: curr.link }),
                {}
              ),

              cron: (project[0].subscription?.[0]?.cron_time || "* * */1 0 0 0")
                .split(" ")
                .reduce(
                  (acc, curr, i) => ({ ...acc, [CRON_TIME[i]]: curr }),
                  {}
                ),

              // FIXME:
              // * Save repo value in db some how ?
              // * Maybe by creating new table ?
              // * Or just loading it from kubernetes deployment ??
              // repo: "",
            },
            code: { tree },
          },
        };
    }

    return {
      redirect: {
        basePath: false,
        destination: `${basePath}/admin/projects`,
        permanent: false,
      },
    };
  },
  sessionConfig
);
