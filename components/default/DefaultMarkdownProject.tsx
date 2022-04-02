import React from "react";
import { marked } from "marked";
import { HtmlMarkers } from "../../config/placeholder";
import { voidUrl } from "../../config";

export interface DefaultMarkdownProjectProps {
  name: string;
  template: string;
}

export default function DefaultMarkdownProject(
  props: DefaultMarkdownProjectProps
) {
  return (
    <>
      <main role="main">
        <div
          className="jumbotron container bg-white"
          id="CanvasContainer0"
          dangerouslySetInnerHTML={{
            __html: marked.parse(
              props.template
                .replace(new RegExp(HtmlMarkers.FILE_SERVER, "g"), voidUrl)
                .replace(new RegExp(HtmlMarkers.PROJECT_NAME, "g"), props.name)
            ),
          }}
        ></div>
      </main>
    </>
  );
}
