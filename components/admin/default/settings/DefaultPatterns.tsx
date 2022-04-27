import {
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import InputTemplate from "../../../Inputs/InputTemplate";
import InputValue from "../../../Inputs/InputValue";
import { Pattern } from "../../Pattern";

export interface DefaultPatternProps {
  show?: boolean;
  update?: boolean;
}

const PREFIX = "pattern";

export default function DefaultPatternForm(props: DefaultPatternProps) {
  const patterns = useSelector((state) => state[PREFIX].patterns) as any[];
  const dispatch = useDispatch();

  return (
    <div className={props.show ? "" : "d-none"}>
      <Form.Row>
        <Form.Group className="w-100">
          <h4 className="font-weight-bold mb-3">Patterns</h4>
          <hr />
        </Form.Group>
        <Form.Group as={Row} className="w-100">
          <InputTemplate className="mb-3" label="Title">
            <InputGroup>
              <InputValue
                root={PREFIX}
                readFrom={`${PREFIX}_window`}
                className="rounded"
                placeholder={"ooooooooooooo"}
                required
              />
            </InputGroup>
          </InputTemplate>

          <InputTemplate className="mb-3" label="Title">
            <InputGroup>
              <InputValue
                root={PREFIX}
                readFrom={`${PREFIX}_window`}
                className="rounded"
                placeholder={"ooooooooooooo"}
                required
              />
            </InputGroup>
          </InputTemplate>
        </Form.Group>

        <Form.Group className="w-100">
          <hr />
          <InfiniteScroll
            className="row"
            dataLength={patterns.length}
            next={() => {
              // loadProjectsThumbnail(page++)
              //   .then((data) => onScrollLoad([...projects, ...data]))
              //   .catch(() => onReachEnd(false))
            }}
            hasMore={false}
            loader={
              <Col lg="4" md="6" sm="11" className="my-3 text-center p-4">
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
            {patterns.map((item, i) => {
              return (
                <Pattern
                  key={i}
                  mode={item.mode}
                  path={item.path}
                  width={item.width}
                  height={item.height}
                  event={{ onClick: () => null }}
                />
              );
            })}
          </InfiniteScroll>
        </Form.Group>
      </Form.Row>
      <hr />
    </div>
  );
}
