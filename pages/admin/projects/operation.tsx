import DefaultHeader from "../../../components/admin/default/DefaultHeader";
import DefaultHead from "../../../components/default/DefaultHead";
import { checkIfUserExist } from "../../../lib/api/session";
import { TreeObj } from "../../../types/tree";
import { basePath, voidUrl } from "../../../config";
import { FileData, LinkData, ProjectData } from "../../../types/api";
import { withIronSession } from "next-iron-session";
import { NextSessionArgs } from "../../../types/session";
import sessionConfig from "../../../config/session";
import { CODE_TEMPLATE, treePlaceholder } from "../../../config/placeholder";
import { LoadProjects } from "../../api/projects/load";
import { formPath } from "../../../lib/public/files";
import "react-toastify/dist/ReactToastify.css";
import { LoadFile } from "../../api/file/load";
import { Provider } from "react-redux";
import reducers from "../../../redux/admin/projects/reducer";
import { devToolsEnhancer } from "redux-devtools-extension";
import { createStore } from "redux";
import DefaultOperationsForm from "../../../components/admin/default/DefaultOperationsForm";

// export type Event = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export const store = createStore(
  reducers,
  devToolsEnhancer({ serialize: { map: true } })
);

export interface ProjectOperationProps {
  type: string;
  formData: ProjectData;
  treeStructure: TreeObj;
  template: FileData;
  links: { [name: string]: LinkData };
}

export default function ProjectOperation(props: ProjectOperationProps) {
  return (
    <Provider store={store}>
      <DefaultHead>
        <title>
          {props.type.charAt(0).toUpperCase() + props.type.slice(1)} Project
        </title>
      </DefaultHead>
      <DefaultHeader />

      <DefaultOperationsForm {...props} />
    </Provider>
  );
}

export const getServerSideProps = withIronSession(async function ({
  req,
}: NextSessionArgs) {
  const sessionID = req.session.get("user");
  const isOk = await checkIfUserExist(sessionID);

  if (!sessionID || !isOk) {
    return {
      redirect: {
        basePath: false,
        destination: `${basePath}/admin/login`,
        permanent: false,
      },
    };
  }

  let type;
  const params = new URLSearchParams((req.url ?? "").split("?")[1] ?? "");
  if ((type = params.get("type")) === "edit") {
    if (!params.get("name")) return { notFound: true };

    const { send } = await LoadProjects<ProjectData>({
      name: params.get("name") ?? "",
    });

    const template = await LoadFile({
      project_id: send.result?.[0]?.id || 0,
      project: params.get("name") ?? "",
      role: "template",
    });

    if (send.status === "ERR" || !send.result?.length) {
      return { notFound: true };
    }

    let treeStructure = treePlaceholder;
    const project = send.result[0];

    for (let i in project.files) {
      let file = project.files[i];
      file.url = `${voidUrl}/${project.name}${formPath(file)}`;

      // treeStructure = formTree(treeStructure, file, [file]);
    }

    return {
      props: {
        type,
        formData: project,
        treeStructure,
        template:
          template.send.result || CODE_TEMPLATE[project.flag]?.code || "",
        links: project.links.reduce(
          (acc, curr) => ({ ...acc, [curr.name]: curr }),
          {}
        ),
      } as ProjectOperationProps,
    };
  }

  return {
    props: {
      type,
      // formData: formPlaceholder,
      formData: {} as ProjectData,
      treeStructure: treePlaceholder,
      template: CODE_TEMPLATE.JS,
      links: { main: { name: "main", link: "" } },
    } as ProjectOperationProps,
  };
},
sessionConfig);
