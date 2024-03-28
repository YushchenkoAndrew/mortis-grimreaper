import { ReactNode, useState } from "react";

export interface DisplayDataRecordProps {
  title: string;
  keys: string[];
  data: { [name: string]: any };

  delay?: number;
  popover?: ReactNode;
  children: ReactNode;
}

export default function DisplayDataRecord(props: DisplayDataRecordProps) {
  const [show, onShow] = useState(false);
  const [hover, onHover] = useState<any>(null);

  return (
    <></>
    // <OverlayTrigger
    //   show={show}
    //   placement="bottom"
    //   overlay={
    //     <Popover id="popover-running-line">
    //       <Popover.Title as="h4">{props.title}</Popover.Title>
    //       <Popover.Content>
    //         {props.keys.map((key, i) => (
    //           <Row
    //             as="h6"
    //             key={`${props.title.replace(/ /g, "-").toLowerCase()}-${i}`}
    //             className="mx-2"
    //           >
    //             <Badge variant="info" className="mr-auto px-2">
    //               {key}
    //             </Badge>
    //             <p className="m-0 pl-4">{props.data[key]}</p>
    //           </Row>
    //         ))}
    //         {props.popover}
    //       </Popover.Content>
    //     </Popover>
    //   }
    // >
    //   <div
    //     onMouseEnter={() =>
    //       onHover(setTimeout(() => onShow(true), props.delay || 0))
    //     }
    //     onMouseLeave={() => {
    //       onShow(false);
    //       if (hover) clearTimeout(hover);
    //     }}
    //   >
    //     {props.children}
    //   </div>
    // </OverlayTrigger>
  );
}
