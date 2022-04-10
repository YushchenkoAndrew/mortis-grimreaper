import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, Container } from "react-bootstrap";
import styles from "./AddCard.module.css";

export interface AddCardProps {
  href: string;
}

export default function AddCard(props: AddCardProps) {
  return (
    <Col lg="4" md="6" sm="11" className="my-3 text-center">
      <a
        href={props.href}
        className={`card border-info text-decoration-none p-2 h-100 ${styles["add-card"]}`}
      >
        <Container className="d-flex h-100 w-80">
          <Col className="align-self-center text-center">
            <FontAwesomeIcon
              className="text-info my-4"
              icon={faPlusCircle}
              size="6x"
              fontSize="2rem"
            />
            <p className={`text-info mt-4 ${styles["add-title"]}`}>Project</p>
          </Col>
        </Container>
      </a>
    </Col>
  );
}
