import {
  faChevronDown,
  faChevronRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import styles from "./Default.module.css";

export interface K3sFieldProps {
  name: string;
  show?: boolean;
  // writeTo?: string;
  // add?: boolean;
  // del?: boolean;
  onAdd?: () => void;
  // onDel?: () => void;
  onHide?: () => void;
  children?: React.ReactNode;
}

export interface K3sFieldRef {}

export default function K3sField(props: K3sFieldProps) {
  const dispatch = useDispatch();
  return (
    <>
      <hr className="mb-4" />
      <Container className={`${styles["el-index-2"]} px-0 px-sm-3`}>
        <div className="row px-3">
          <Row className="mr-auto" onClick={props.onHide}>
            <h4 className="mr-2">{props.name}</h4>
            <FontAwesomeIcon
              className="my-2"
              icon={props.show ? faChevronDown : faChevronRight}
            />
          </Row>
          <Row className="mr-1">
            {props.onAdd ? (
              <a
                className={`mr-1 btn btn-outline-info ${styles["el-container-2"]}`}
                onClick={props.onAdd}
                // dispatch({ type: `${props.writeTo}_add`.toUpperCase() })
              >
                <FontAwesomeIcon
                  className={`text-info ${styles["icon"]}`}
                  icon={faPlus}
                  size="lg"
                  fontSize="1rem"
                />
              </a>
            ) : (
              <></>
            )}

            {/* {props.prefix && props.del ? (
              <a
                className={`mr-1 btn btn-outline-danger ${styles["el-container-2"]}`}
                onClick={() =>
                  dispatch({ type: `${props.prefix}_del`.toUpperCase() })
                }
              >
                <FontAwesomeIcon
                  className={`text-danger ${styles["icon"]}`}
                  icon={faTrashAlt}
                  size="lg"
                  fontSize="1rem"
                  // onClick={props.onDel}
                />
              </a>
            ) : (
              <></>
            )} */}
          </Row>
        </div>

        <Row className="justify-content-center mb-2">{props.children}</Row>
      </Container>
    </>
  );
}
