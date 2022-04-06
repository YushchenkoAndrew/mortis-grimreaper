import { useSelector } from "react-redux";
import DefaultDockerFooter from "./DefaultDockerFooter";
import DefaultLinkFooter from "./DefaultLinkFooter";
import DefaultProjectFooter from "./DefaultProjectFooter";

export interface DefaultPreviewFooterProps {
  root?: string;
  readFrom: string;
}

export default function DefaultPreviewFooter(props: DefaultPreviewFooterProps) {
  const preview = useSelector((state: any) => state[props.readFrom] as any);

  switch (preview.flag) {
    case "Link":
      return <DefaultLinkFooter root={props.root} readFrom={props.readFrom} />;

    case "Docker":
      return (
        <DefaultDockerFooter root={props.root} readFrom={props.readFrom} />
      );

    case "JS":
    case "Markdown":
      return (
        <DefaultProjectFooter root={props.root} readFrom={props.readFrom} />
      );
  }

  return <></>;
}
