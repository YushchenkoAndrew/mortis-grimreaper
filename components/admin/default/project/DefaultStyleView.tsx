import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ProjectInfo } from '../../../../config/placeholder';
import { preloadData } from '../../../../lib/public/api';
import { HEX2HSL, svgBuild } from '../../../../lib/public/svg';
import { ColorData, PatternData } from '../../../../types/api';
import Thumbnail from '../../../Thumbnail/Thumbnail';
import { DisplayColors } from '../../../Display/DisplayColors';
import { DisplayPattern } from '../../../Display/DisplayPattern';
import InputRadio from '../../../Inputs/InputRadio';
import InputTemplate from '../../../Inputs/InputTemplate';

export interface DefaultStyleViewProps {
  show?: boolean;
}

const PREFIX = 'style';

// TODO:
// * Add Dynamic Pattern generator
// * Something similar to this (https://pattern.monster/circles-5/)

export default function DefaultStyleView(props: DefaultStyleViewProps) {
  const [minimize, onMinimize] = useState({ patterns: false, colors: false });
  const [hasMore, onReachEnd] = useState({ patterns: true, colors: true });

  // const style = useSelector((state) => state[PREFIX]);
  const preview = useSelector((state: any) => state.preview);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   (async function () {
  //     const prefix = PREFIX.toUpperCase();
  //     await fetch(`${basePath}/api/admin/cache?id=${CacheId(prefix)}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (!data.result) return;
  //         dispatch({ type: `${prefix}_INIT`, value: data.result });
  //       })
  //       .catch(() => null);

  //     await onLoadNext("pattern");
  //     await onLoadNext("colors");
  //   })();
  // }, []);

  // async function onLoadNext(path: string) {
  //   preloadData(path, style[`${path}_page`] + 1)
  //     .then((data) =>
  //       dispatch({
  //         type: `${PREFIX}_${path}_PAGE_LOADED`.toUpperCase(),
  //         value: data,
  //       })
  //     )
  //     .catch(() => onReachEnd({ ...hasMore, [path]: false }));
  // }

  return (
    <></>
    // <div className={props.show ? "" : "d-none"}>
    //   <hr />
    //   <Form.Row>
    //     <Form.Group as={Col} md={{ order: 2, span: 5 }} mb="4">
    //       <ProjectCard
    //         href="#"
    //         size={style.title}
    //         img={
    //           preview.img.length > 1
    //             ? preview.img
    //             : preview.img?.[0] || ProjectInfo.img
    //         }
    //         title={preview.title || ProjectInfo.title}
    //         description={preview.desc || ProjectInfo.desc}
    //         background={
    //           style.patterns[style.pattern_id]
    //             ? `url("data:image/svg+xml,${svgBuild(
    //                 style.patterns[style.pattern_id].width,
    //                 style.patterns[style.pattern_id].height,
    //                 style.patterns[style.pattern_id].path,
    //                 style.patterns[style.pattern_id].mode.toLowerCase(),
    //                 style.colors[style.color_id]?.colors?.map?.((c: string) =>
    //                   HEX2HSL(c)
    //                 )
    //               )}")`
    //             : undefined
    //         }
    //       />
    //     </Form.Group>
    //     <Form.Group as={Col} md={{ order: 1, span: 7 }}>
    //       <h4 className="font-weight-bold mb-3">Thumbnail</h4>
    //       <InputTemplate className="mb-3" label="Title size">
    //         <InputRadio
    //           root={PREFIX}
    //           readFrom={`${PREFIX}_title`}
    //           options={["sm", "md", "lg", "xl"]}
    //           label="btn-outline-secondary"
    //         />
    //       </InputTemplate>
    //     </Form.Group>

    //     <Form.Group as={Col} md={{ order: 1, span: 7 }}>
    //       <h4 className="font-weight-bold mb-3">Thumbnail</h4>
    //       <InputTemplate
    //         className="px-0"
    //         labelClassName="font-weight-bold ml-2 pb-2"
    //         label={[
    //           "Patterns ",
    //           <FontAwesomeIcon
    //             key={"icon-metadata"}
    //             icon={faChevronDown}
    //             style={{
    //               transitionDuration: "0.25s",
    //               transitionProperty: "transform",
    //               transform: `rotate(${minimize.patterns ? "0deg" : "-90deg"}`,
    //             }}
    //           />,
    //         ]}
    //         onClick={() =>
    //           onMinimize({ ...minimize, patterns: !minimize.patterns })
    //         }
    //       >
    //         <Collapse in={minimize.patterns}>
    //           <div>
    //             {/* // FIXME: https://github.com/danbovey/react-infinite-scroller/issues/91#issuecomment-552128273 */}
    //             <InfiniteScroll
    //               className="row justify-content-center px-3"
    //               dataLength={style.patterns.length}
    //               // style={{ overflowY: "scroll", maxHeight: "500px" }}
    //               next={() => onLoadNext("pattern")}
    //               hasMore={hasMore.patterns}
    //               loader={
    //                 <Col
    //                   xs="10"
    //                   sm="4"
    //                   md="6"
    //                   lg="4"
    //                   xl="3"
    //                   className="my-3 text-center"
    //                 >
    //                   <Container className="d-flex h-100 w-80">
    //                     <Col className="align-self-center text-center">
    //                       <Spinner animation="border" role="status">
    //                         <span className="sr-only">Loading...</span>
    //                       </Spinner>
    //                     </Col>
    //                   </Container>
    //                 </Col>
    //               }
    //             >
    //               {style.patterns.map((item: PatternData, i: number) => {
    //                 return (
    //                   <DisplayPattern
    //                     key={i}
    //                     xl="6"
    //                     lg="6"
    //                     md="11"
    //                     data={item}
    //                     selected={item.id === style.pattern_id}
    //                     event={{
    //                       onClick: () => {
    //                         dispatch({
    //                           type: `${PREFIX}_PATTERN_ID_CHANGED`.toUpperCase(),
    //                           value: i,
    //                         });

    //                         setTimeout(
    //                           () =>
    //                             window.scrollTo({ top: 0, behavior: "smooth" }),
    //                           0
    //                         );
    //                       },
    //                     }}
    //                   />
    //                 );
    //               })}
    //             </InfiniteScroll>
    //           </div>
    //         </Collapse>
    //       </InputTemplate>

    //       <InputTemplate
    //         className="px-0"
    //         labelClassName="font-weight-bold ml-2"
    //         label={[
    //           "Colors ",
    //           <FontAwesomeIcon
    //             key={"icon-metadata"}
    //             icon={faChevronDown}
    //             style={{
    //               transitionDuration: "0.25s",
    //               transitionProperty: "transform",
    //               transform: `rotate(${minimize.colors ? "0deg" : "-90deg"}`,
    //             }}
    //           />,
    //         ]}
    //         onClick={() =>
    //           onMinimize({ ...minimize, colors: !minimize.colors })
    //         }
    //       >
    //         <Collapse in={minimize.colors}>
    //           <div>
    //             <InfiniteScroll
    //               className="row justify-content-center px-3"
    //               dataLength={style.colors.length}
    //               style={{ overflowY: "scroll", maxHeight: "500px" }}
    //               next={() => onLoadNext("colors")}
    //               hasMore={hasMore.patterns}
    //               loader={
    //                 <Col
    //                   xs="10"
    //                   sm="4"
    //                   md="6"
    //                   lg="4"
    //                   xl="3"
    //                   className="my-3 text-center"
    //                 >
    //                   <Container className="d-flex h-100 w-80">
    //                     <Col className="align-self-center text-center">
    //                       <Spinner animation="border" role="status">
    //                         <span className="sr-only">Loading...</span>
    //                       </Spinner>
    //                     </Col>
    //                   </Container>
    //                 </Col>
    //               }
    //             >
    //               {style.colors.map((item: ColorData, i: number) => {
    //                 return (
    //                   <DisplayColors
    //                     xl="4"
    //                     lg="5"
    //                     md="8"
    //                     data={item}
    //                     selected={item.id === style.color_id}
    //                     event={{
    //                       onClick: () => {
    //                         dispatch({
    //                           type: `${PREFIX}_COLOR_ID_CHANGED`.toUpperCase(),
    //                           value: i,
    //                         });

    //                         setTimeout(
    //                           () =>
    //                             window.scrollTo({ top: 0, behavior: "smooth" }),
    //                           0
    //                         );
    //                       },
    //                     }}
    //                   />
    //                 );
    //               })}
    //             </InfiniteScroll>
    //           </div>
    //         </Collapse>
    //       </InputTemplate>

    //       <Row className="justify-content-between pt-2 mx-3">
    //         <Col xs="9" md="9" lg="10" className="px-0">
    //           <Row className="pt-2">
    //             {Array(5)
    //               .fill("")
    //               .map((_, i) => (
    //                 <Form.Group key={`pallet-color-${i}`} className="mx-2">
    //                   {/* <InputColor
    //                     root={PREFIX}
    //                     readFrom={`${PREFIX}_colors_${style.color_id}_${i}`}
    //                     writeTo={`${PREFIX}_colors`}
    //                   /> */}
    //                 </Form.Group>
    //               ))}
    //           </Row>
    //         </Col>

    //         <Col xs="3" sm="2" md="3" lg="2" className="my-auto px-2">
    //           <Button
    //             variant="outline-primary"
    //             onClick={() =>
    //               dispatch({ type: `${PREFIX}_shuffle`.toUpperCase() })
    //             }
    //           >
    //             Shuffle
    //           </Button>
    //         </Col>
    //       </Row>
    //     </Form.Group>
    //   </Form.Row>

    //   {/* <hr /> */}
    //   {/* <DefaultPreviewFooter root={PREFIX} readFrom={PREFIX} /> */}
    // </div>
  );
}
