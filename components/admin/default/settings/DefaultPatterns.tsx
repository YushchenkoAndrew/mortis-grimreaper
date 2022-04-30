import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { PatternData } from "../../../../types/api";
import { Pattern } from "../../Pattern";
import DefaultMoreOptions from "./DefaultMoreOptions";
import DefaultPatternForm from "./DefaultPatternForm";

export interface DefaultPatternProps {
  show?: boolean;
  update?: boolean;
}

const PREFIX = "pattern";

export default function DefaultPattern(props: DefaultPatternProps) {
  const pattern = useSelector((state: any) => state[PREFIX]);
  const dispatch = useDispatch();

  return (
    <div className={props.show ? "" : "d-none"}>
      <Form.Row>
        <Form.Group className="pl-4 mb-1 w-100">
          <h4 className="font-weight-bold mb-3">Patterns</h4>
          <hr />
        </Form.Group>
        <Form.Group as={Row} className="pl-3 mb-0 w-100">
          <DefaultMoreOptions root={PREFIX} readFrom={PREFIX}>
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
                <Pattern
                  key={i}
                  mode={item.mode}
                  path={item.path}
                  width={item.width}
                  height={item.height}
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
    </div>
  );
}
