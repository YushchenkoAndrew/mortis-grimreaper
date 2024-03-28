import React from "react";
import { HtmlMarkers } from "../../config/placeholder";
import { voidUrl } from "../../config";

export interface DefaultMarkdownProjectProps {
  hidden?: boolean;
  className?: string;

  name: string;
  template: string;
}

export default function DefaultMarkdownProject(
  props: DefaultMarkdownProjectProps
) {
  return (
    <>
      {/* <Container
        hidden={props.hidden}
        className={`jumbotron bg-white ${props.className ?? ""}`}
        id="CanvasContainer0"
        dangerouslySetInnerHTML={{
          __html: marked.parse(
            props.template
              .replace(new RegExp(HtmlMarkers.FILE_SERVER, "g"), voidUrl)
              .replace(new RegExp(HtmlMarkers.PROJECT_NAME, "g"), props.name)
          ),
        }}
      ></Container> */}
    </>
  );
}
