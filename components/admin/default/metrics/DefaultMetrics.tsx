import { Col, Container, Form, Row } from "react-bootstrap";
import InputRadio from "../../../Inputs/InputRadio";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultTotalMetrics from "./DefaultTotalMetrics";
import { MetricsData, ProjectData } from "../../../../types/api";
import LineChart from "../../../Display/LineChart";
import { basePath } from "../../../../config";
import { FormatDate } from "../../../../lib/public/string";
import { createQuery } from "../../../../lib/api/query";
import { TIME_RANGE } from "../../../../redux/admin/projects/metrics/reducer/main";
import { DefaultRes } from "../../../../types/request";

export interface DefaultMetricsProps {
  project: { [name: string]: any };
  metrics: MetricsData[];
}

const PREFIX = "main";

export default function DefaultMetrics(props: DefaultMetricsProps) {
  const main = useSelector((state: any) => state[PREFIX]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: `${PREFIX}_INIT`.toUpperCase(),
      value: { project: props.project },
    });
    dispatch({
      type: `${PREFIX}_METRICS_CALC`.toUpperCase(),
      value: props.metrics,
    });
  }, []);

  return (
    <Container>
      <DefaultTotalMetrics root={PREFIX} readFrom={`${PREFIX}_total`} />

      <Row className="d-flex justify-content-between px-3">
        <Form.Group className="mb-2">
          <InputRadio
            readFrom={`${PREFIX}_flag`}
            options={["Year", "Month", "Week", "Day"]}
            className="btn-group btn-group-sm btn-group-toggle mb-2"
            label="btn-outline-dark"
            writeTo={(flag) => {
              dispatch({
                type: `${PREFIX}_FLAG_CHANGED`.toUpperCase(),
                value: flag,
              });

              (async function () {
                try {
                  const res = await fetch(
                    `${basePath}/api/projects/load${createQuery({
                      name: main.project.name,
                      "metrics[created_from]": FormatDate(
                        new Date(new Date().getTime() - TIME_RANGE[flag])
                      ),
                    })}`
                  );

                  const data = (await res.json()) as DefaultRes<ProjectData[]>;
                  if (data.status === "ERR" || !data.result) return;

                  dispatch({
                    type: `${PREFIX}_METRICS_CALC`.toUpperCase(),
                    value: data.result[0].metrics || [],
                  });
                } catch (err) {}
              })();
            }}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <InputRadio
            readFrom={`${PREFIX}_process`}
            options={["Normal", "Preprocess"]}
            className="btn-group btn-group-sm btn-group-toggle mb-2"
            label="btn-outline-primary"
          />
        </Form.Group>
      </Row>

      <LineChart
        root={PREFIX}
        title="CPU Usage"
        size={{ hight: 1500, width: 3000 }}
        readFrom={`${PREFIX}_metrics_cpu`}
        scale={{
          xAxis: {
            type: "time",
            time: { unit: main.flag === "Day" ? "hour" : "day" },
          },
        }}
      />

      <LineChart
        root={PREFIX}
        title="Memory Usage"
        size={{ hight: 1500, width: 3000 }}
        readFrom={`${PREFIX}_metrics_memory`}
        scale={{
          xAxis: {
            type: "time",
            time: { unit: main.flag === "Day" ? "hour" : "day" },
          },
        }}
      />
    </Container>
  );
}
