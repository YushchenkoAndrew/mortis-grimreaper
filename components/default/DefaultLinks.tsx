import React, { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { basePath } from "../../config";

export function MediaView() {
  localStorage.getItem("id")
    ? fetch(`${basePath}/api/view/media?id=${localStorage.getItem("id")}`, {
        method: "PATCH",
      }).catch(() => null)
    : null;
}

export interface DefaultLinksProps {}

export default memo(function DefaultLinks(props: DefaultLinksProps) {
  return (
    <>
      <a
        className="text-muted mx-2 mx-md-3"
        href="https://github.com/YushchenkoAndrew"
        onClick={MediaView}
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faGithub} size="lg" fontSize="1rem" />
      </a>
      <a
        className="text-muted mx-2 mx-md-3"
        href="https://twitter.com/AndrewMortis"
        onClick={MediaView}
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faTwitter} size="lg" fontSize="1rem" />
      </a>
      <a
        className="text-muted mx-2 mx-md-3"
        href="https://www.linkedin.com/in/andrew-yushchenko-7447771a2/"
        onClick={MediaView}
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faLinkedinIn} size="lg" fontSize="1rem" />
      </a>
    </>
  );
});
