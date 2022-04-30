import {
  faPen,
  faPlus,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Collapse,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { PatternData } from "../../../../types/api";
import HoverButton from "../../../HoverButton";
import InputCollapse from "../../../Inputs/InputCollapse";
import InputTemplate from "../../../Inputs/InputTemplate";
import InputValue from "../../../Inputs/InputValue";
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
        <Form.Group className="w-100 mb-1">
          <h4 className="font-weight-bold mb-3">Patterns</h4>
          <hr />
        </Form.Group>
        <Form.Group as={Row} className="w-100 mb-0">
          <DefaultMoreOptions root={PREFIX} readFrom={`${PREFIX}_info`}>
            <DefaultPatternForm root={PREFIX} readFrom={PREFIX} />
          </DefaultMoreOptions>
        </Form.Group>

        <Form.Group className="w-100">
          <hr hidden={!pattern.info} />
          <InfiniteScroll
            className="row"
            dataLength={pattern.items.length}
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
            {pattern.items.map((item: PatternData, i: number) => {
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
