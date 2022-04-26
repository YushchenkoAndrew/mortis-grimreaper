import { withIronSessionSsr } from "iron-session/next";
import { useState } from "react";
import { Badge, OverlayTrigger, Popover, Row } from "react-bootstrap";
import { Provider } from "react-redux";
import DefaultHeader from "../../../../components/admin/default/DefaultHeader";
import DefaultMetrics from "../../../../components/admin/default/metrics/DefaultMetrics";
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
import { MetricsData, ProjectData } from "../../../../types/api";

export interface MetricsProps {
  project: { [name: string]: any };
  metrics: MetricsData[];
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
                        <p className="m-0 pl-4">{props.project[key]}</p>
                      </Row>
                    )
                  )}
                  <Row as="h6" className="mx-2">
                    <Badge variant="info" className="mr-auto px-2">
                      subscription
                    </Badge>
                  </Row>
                  {(
                    props.project.subscription as { [name: string]: any }[]
                  ).map((item, i) => (
                    <div key={`subscription-${i}`}>
                      {["id", "name", "method", "cron_time"].map((key, i) => (
                        <Row
                          as="h6"
                          key={`subscription-row-${i}`}
                          className="ml-4 mr-2"
                        >
                          <Badge variant="warning" className="mr-auto px-2">
                            {key}
                          </Badge>
                          <p className="m-0 pl-4">{item[key]}</p>
                        </Row>
                      ))}
                    </div>
                  ))}
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
        <DefaultMetrics project={props.project} metrics={props.metrics} />
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

    return {
      props: {
        project: {
          created_at: project[0].created_at?.slice?.(0, 10),
          ...["id", "name", "title", "flag"].reduce(
            (acc, key) => ({ ...acc, [key]: project[0][key] }),
            {}
          ),

          subscription: (project[0].subscription || []).map(
            ({ id, name, method, cron_time }) => ({
              id,
              name,
              method,
              cron_time,
            })
          ),
        },

        metrics: project[0].metrics || [],
      },
    };
  },
  sessionConfig
);
