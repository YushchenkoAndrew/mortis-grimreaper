import DefaultHeader from "../../../components/admin/default/DefaultHeader";
import DefaultHead from "../../../components/default/DefaultHead";
import { checkIfUserExist } from "../../../lib/api/session";
import { TreeObj } from "../../../types/tree";
import { basePath, voidUrl } from "../../../config";
import { FileData, LinkData, ProjectData } from "../../../types/api";
import sessionConfig from "../../../config/session";
import { PROJECT_TREE } from "../../../config/placeholder";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import DefaultOperationsForm from "../../../components/admin/default/DefaultOperationsForm";
import { store } from "../../../redux/admin/projects/storage";
import { LoadProjects } from "../../../lib/api/project";
import { addFile, allowedReader, formPath } from "../../../lib/public/files";
import { LoadFile } from "../../../lib/api/file";

export interface ProjectOperationProps {
  code?: { tree: TreeObj };
  preview?: { [name: string]: any };
}

function CapitalizeString([first, ...rest]: string) {
  return first.toUpperCase() + rest.join("");
}

export default function ProjectOperation(props: ProjectOperationProps) {
  const router = useRouter();

  return (
    <Provider store={store}>
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

      <DefaultOperationsForm
        operation={router.query?.operations?.[0] ?? "create"}
        preview={props.preview}
        code={props.code}
      />
    </Provider>
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
        for (let file of project[0].files) {
          let content: string | null = null;
          if (allowedReader.readAsText.includes(file.type)) {
            content = await LoadFile({ id: file.id });
          }

          tree = addFile(tree, { dir: file.path, role: file.role }, [
            {
              ...file,
              url: `${voidUrl}/${project[0].name}/${formPath(file)}`,
              content: content,
            },
          ]);
        }

        return {
          props: {
            preview: {
              ...["id", "name", "flag", "title", "desc", "note"].reduce(
                (acc, key) => ({ ...acc, [key]: project[0][key] }),
                {}
              ),

              links: project[0].links.reduce(
                (acc, curr) => ({ ...acc, [curr.name]: curr.link }),
                {}
              ),
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
