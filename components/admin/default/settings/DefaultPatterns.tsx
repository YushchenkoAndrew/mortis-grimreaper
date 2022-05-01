import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";
import { basePath } from "../../../../config";
import { ToastDefault } from "../../../../config/alert";
import { CacheId } from "../../../../lib/public";
import { StateToData } from "../../../../redux/admin/settings/reducer/pattern";
import { PatternData } from "../../../../types/api";
import { DefaultRes } from "../../../../types/request";
import { DisplayPattern } from "../../../Display/DisplayPattern";
import DefaultMoreOptions from "./DefaultMoreOptions";
import DefaultPatternForm from "./DefaultPatternForm";

export interface DefaultPatternProps {
  show?: boolean;
  patterns?: { [name: string]: any }[];
}

const PREFIX = "pattern";

export default function DefaultPattern(props: DefaultPatternProps) {
  const [validated, setValidated] = useState(false);

  const dispatch = useDispatch();
  const pattern = useSelector((state: any) => state[PREFIX]);

  useEffect(() => {
    (async function () {
      const prefix = PREFIX.toUpperCase();
      await fetch(`${basePath}/api/admin/cache?id=${CacheId(prefix)}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.result) return;
          dispatch({ type: `${prefix}_INIT`, value: data.result });
        })
        .catch(() => null);
    })();
  }, []);

  return (
    <Form
      noValidate
      hidden={!props.show}
      validated={validated}
      onSubmit={async (event) => {
        event?.preventDefault();
        if (!event.currentTarget.checkValidity()) {
          event.stopPropagation();
          return setValidated(true);
        }

        const toastId = toast.loading("Please wait...");
        let message = "Pattern: Server error";

        try {
          const res = await fetch(
            `${basePath}/api/pattern/${pattern.action}?id=${CacheId()}`,
            {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(StateToData(pattern)),
            }
          );
          const data = (await res.json()) as DefaultRes<PatternData[]>;
          if (data.status === "OK" && data.result?.length) {
            dispatch({ type: `${PREFIX}_CACHE_FLUSH` });
            return toast.update(toastId, {
              ...ToastDefault,
              render: "New Patter was created successfully",
              type: "success",
              isLoading: false,
              transition: Bounce,
            });
          }

          message = data.message;
        } catch (err) {}

        toast.update(toastId, {
          ...ToastDefault,
          render: message,
          type: "error",
          isLoading: false,
          transition: Bounce,
        });
      }}
    >
      <Form.Row>
        <Form.Group className="pl-4 mb-1 w-100">
          <h4 className="font-weight-bold mb-3">Patterns</h4>
          <hr />
        </Form.Group>
        <Form.Group as={Row} className="pl-3 mb-0 w-100">
          <DefaultMoreOptions
            root={PREFIX}
            readFrom={PREFIX}
            onValidate={() => {
              if (pattern.id != -1) return true;

              toast.error("Pattern is not chosen", {
                ...ToastDefault,
                type: "error",
                transition: Bounce,
              });
              return false;
            }}
            onDelete={() => {}}
          >
            <DefaultPatternForm root={PREFIX} readFrom={PREFIX} />
          </DefaultMoreOptions>
        </Form.Group>

        <Form.Group className="w-100">
          <hr hidden={!pattern.info} />
          <InfiniteScroll
            className="row justify-content-center"
            dataLength={pattern.items.length}
            next={() => {
              // loadProjectsThumbnail(page++)
              //   .then((data) => onScrollLoad([...projects, ...data]))
              //   .catch(() => onReachEnd(false))
            }}
            hasMore={false}
            loader={
              <Col xs="10" sm="4" md="6" lg="4" className="my-3 text-center">
                <Container className="d-flex h-100 w-80">
                  <Col className="align-self-center text-center">
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </Col>
                </Container>
              </Col>
            }
          >
            {pattern.items.map((item: PatternData, i: number) => {
              return (
                <DisplayPattern
                  key={i}
                  data={item}
                  event={{
                    onClick: () => {
                      dispatch({
                        type: `${PREFIX}_INIT`.toUpperCase(),
                        value: item,
                      });

                      dispatch({
                        type: `${PREFIX}_INFO_CHANGED`.toUpperCase(),
                        value: true,
                      });

                      setTimeout(
                        () => window.scrollTo({ top: 0, behavior: "smooth" }),
                        0
                      );
                    },
                  }}
                />
              );
            })}
          </InfiniteScroll>
        </Form.Group>
      </Form.Row>
    </Form>
  );
}
