import React, { memo } from "react";
import Image from "react-bootstrap/Image";
import { FlagType } from "../../types/flag";
import styles from "./Card.module.css";
import Flag from "./Flag";
import { Button, Col, Container, Row } from "react-bootstrap";

export type EventLinks = {
  metrics?: { href?: string; onClick?: () => void };
  modify: { href?: string; onClick?: () => void };
  delete: { href?: string; onClick?: () => void };
};
export interface CardProps {
  id: number;
  img: string | string[];
  href: string;
  title: string;
  flag: FlagType;
  desc?: string;
  frameRate?: number;
  event: EventLinks;
}

export default memo(function Card(props: CardProps) {
  const desc = (props.desc ?? "").split(" ");
  return (
    <Col lg="4" md="6" sm="11" className="my-3 text-center">
      <div className={`card p-2 h-100 ${styles["shadow"]}`}>
        <div className="text-right">
          <div className="d-flex justify-content-between">
            <span />
            <Flag className="mr-2" name={props.flag} />
          </div>
        </div>
        <Container className="text-center">
          <a
            className="text-decoration-none"
            href={props.href}
            target="_blank"
            rel="noreferrer"
          >
            <Container className={styles["project-link"]}>
              <Image
                className={styles["circular"]}
                src={
                  Array.isArray(props.img)
                    ? props.img[
                        Math.round(
                          new Date().getTime() / (props.frameRate ?? 100)
                        ) % props.img.length
                      ]
                    : props.img
                }
                // FIXME: Do not change img
                // width="100"
                alt="Project image"
              />

              <h4 className="d-block text-dark font-weight-bold mt-3">
                {props.title}
              </h4>
            </Container>
          </a>
          <hr />
          <p className="font-italic text-muted ml-1">
            {desc.slice(0, 15).join(" ") + (desc.length < 15 ? "" : "...")}
          </p>
          <div className="d-flex justify-content-between mt-3 mb-2">
            <span />
            <Row className="mr-2 mb-2">
              {props.flag === "Docker" ? (
                <Button
                  size="sm"
                  className="mr-2"
                  variant="outline-secondary"
                  {...props.event.metrics}
                >
                  Metrics
                </Button>
              ) : null}
              <Button
                size="sm"
                className="mr-2"
                variant="outline-info"
                {...props.event.modify}
              >
                Modify
              </Button>
              <Button
                size="sm"
                className="mr-2"
                variant="outline-danger"
                {...props.event.delete}
              >
                Delete
              </Button>
            </Row>
          </div>
        </Container>
      </div>
    </Col>
  );
});
