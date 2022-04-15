import { withIronSessionSsr } from "iron-session/next";
import { StrictMode, useRef, useState } from "react";
import {
  Badge,
  Button,
  Container,
  OverlayTrigger,
  Popover,
  Row,
} from "react-bootstrap";
import { Provider } from "react-redux";
import DefaultHeader from "../../../../components/admin/default/DefaultHeader";
import DefaultMetrics from "../../../../components/admin/default/DefaultMetrics";
import DefaultTotalMetrics from "../../../../components/admin/default/DefaultTotalMetrics";
import DefaultFooter from "../../../../components/default/DefaultFooter";
import DefaultHead from "../../../../components/default/DefaultHead";
import DefaultNav from "../../../../components/default/DefaultNav";
import RunningLine from "../../../../components/RunningLine";
import { basePath } from "../../../../config";
import sessionConfig from "../../../../config/session";
import { LoadProjects } from "../../../../lib/api/project";
import { checkIfUserExist } from "../../../../lib/api/session";
import { FormatDate } from "../../../../lib/public/string";
import { store } from "../../../../redux/admin/projects/metrics/storage";
import { ProjectData } from "../../../../types/api";

export interface MetricsProps {
  project: { [name: string]: any };
}

export default function Metrics(props: MetricsProps) {
  const [showInfo, onNameHover] = useState(false);
  return (
    <>
      <DefaultHead>
        <title>Metrics</title>
      </DefaultHead>
      <DefaultHeader
        overlay={
          <OverlayTrigger
            show={showInfo}
            placement="bottom"
            overlay={
              <Popover id="popover-running-line">
                <Popover.Title as="h4">Project info</Popover.Title>
                <Popover.Content>
                  {["id", "created_at", "name", "title", "flag"].map(
                    (key, i) => (
                      <Row as="h6" key={`project-${i}`} className="mx-2">
                        <Badge variant="info" className="mr-auto px-2">
                          {key}
                        </Badge>
                        <p className="m-0 pl-3">{props.project[key]}</p>
                      </Row>
                    )
                  )}
                </Popover.Content>
              </Popover>
            }
          >
            <RunningLine
              size={7}
              onHover={onNameHover}
              text={props.project["name"]}
            />
          </OverlayTrigger>
        }
      />

      <Provider store={store}>
        <Container>
          <DefaultTotalMetrics />
          <DefaultMetrics />
        </Container>
      </Provider>

      <DefaultFooter name="Menu">
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, params }) {
    const name = (params?.name as string) || "";
    if (!req.session.user || !(await checkIfUserExist(req.session.user))) {
      return {
        redirect: {
          basePath: false,
          destination: `${basePath}/admin/login`,
          permanent: false,
        },
      };
    }

    const project = await LoadProjects<ProjectData>({
      name: name,
      "metrics[created_from]": FormatDate(
        new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
      ),
    });

    if (!project || !project.length) {
      return {
        redirect: {
          basePath: false,
          destination: `${basePath}/admin/projects`,
          permanent: false,
        },
      };
    }

    console.dir(project, { depth: null });

    return {
      props: {
        project: {
          created_at: project[0].created_at?.slice?.(0, 10),
          ...["id", "name", "title", "flag"].reduce(
            (acc, key) => ({ ...acc, [key]: project[0][key] }),
            {}
          ),
        },
        //   links: project[0].links.reduce(
        //     (acc, curr) => ({ ...acc, [curr.name]: curr.link }),
        //     {}
        //   ),
        //   cron: (project[0].subscription?.[0]?.cron_time || "* * */1 0 0 0")
        //     .split(" ")
        //     .reduce((acc, curr, i) => ({ ...acc, [CRON_TIME[i]]: curr }), {}),
        //   // FIXME:
        //   // * Save repo value in db some how ?
        //   // * Maybe by creating new table ?
        //   // * Or just loading it from kubernetes deployment ??
        //   // repo: "",
        // },
        // code: { tree },
      },
    };
    // }
  },
  sessionConfig
);
