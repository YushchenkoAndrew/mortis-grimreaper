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
import DefaultOperationsForm from "../../../components/admin/default/DefaultOperationsForm";
import { store } from "../../../redux/admin/projects/storage";
import { LoadProjects } from "../../../lib/api/project";
import { addFile, allowedReader, formPath } from "../../../lib/public/files";
import { LoadFile } from "../../../lib/api/file";
import { Deployment } from "../../../types/K3s/Deployment";
import { Namespace } from "../../../types/K3s/Namespace";
import { Service } from "../../../types/K3s/Service";
import { Ingress } from "../../../types/K3s/Ingress";
import { CapitalizeString } from "../../../lib/public/string";

export interface ProjectOperationProps {
  code?: { tree: TreeObj };
  preview?: { [name: string]: any };
  config?: {
    namespace: Namespace[];
    deployment: Deployment[];
    service: Service[];
    ingress: Ingress[];
  };
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
        config={props.config}
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

        console.dir(project, { depth: null });

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
            },
            code: { tree },

            // TODO:
            // * Add k3s config parser
            //
            // config?: {
            //   namespace: Namespace[];
            //   deployment: Deployment[];
            //   service: Service[];
            //   ingress: Ingress[];
            // };
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
