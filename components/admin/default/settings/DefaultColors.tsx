import { faCube } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { basePath } from "../../../../config";
import { ToastDefault } from "../../../../config/alert";
import { CacheId } from "../../../../lib/public";
import { preloadData } from "../../../../lib/public/api";
import { palette } from "../../../../lib/public/svg";
import { StateToData } from "../../../../redux/admin/settings/reducer/pattern";
import { ColorData } from "../../../../types/api";
import { DefaultRes } from "../../../../types/request";
import { DisplayColors } from "../../../Display/DisplayColors";
import HoverButton from "../../../HoverButton";
import DefaultColorsForm from "./DefaultColorsForm";
import DefaultMoreOptions from "./DefaultMoreOptions";

export interface DefaultColorsProps {
  show?: boolean;
}

const PREFIX = "colors";

export default function DefaultColors(props: DefaultColorsProps) {
  const [hasMore, onReachEnd] = useState(true);
  const [validated, setValidated] = useState(false);

  const dispatch = useDispatch();
  const colors = useSelector((state: any) => state[PREFIX]);

  useEffect(() => {
    (async function () {
      const prefix = PREFIX.toUpperCase();
      await fetch(`${basePath}/api/admin/cache?id=${CacheId(prefix)}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.result) return;
          dispatch({ type: `${prefix}_INIT`, value: data.result });
        })
        .catch(() => null);

      await onLoadNext();
    })();
  }, []);

  async function onLoadNext() {
    preloadData("colors", colors.page + 1)
      .then((data) =>
        dispatch({
          type: `${PREFIX}_PAGE_LOADED`.toUpperCase(),
          value: data,
        })
      )
      .catch(() => onReachEnd(false));
  }

  async function onAction(action: string) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const res = await fetch(
          `${basePath}/api/colors/${action}?id=${CacheId()}`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(StateToData(colors)),
          }
        );
        const data = (await res.json()) as DefaultRes<ColorData[]>;
        if (data.status !== "OK" || !data.result?.length) {
          return reject(data.message);
        }

        dispatch({ type: `${PREFIX}_CACHE_FLUSH` });
        return resolve("New Color was created successfully");
      } catch (_) {
        return reject("Color: Server error");
      }
    });
  }

  return (
    // <Form
    //   noValidate
    //   hidden={!props.show}
    //   validated={validated}
    //   onSubmit={async (event) => {
    //     event?.preventDefault();
    //     if (!event.currentTarget.checkValidity()) {
    //       event.stopPropagation();
    //       return setValidated(true);
    //     }

    //     const toastId = toast.loading("Please wait...");

    //     try {
    //       // NOTE: This is fix strange bug (https://github.com/fkhadra/react-toastify/issues/575)
    //       await new Promise<void>((resolve) =>
    //         setTimeout(() => resolve(), 1000)
    //       );
    //       toast.update(toastId, {
    //         ...ToastDefault,
    //         render: await onAction(colors.action),
    //         type: "success",
    //         isLoading: false,
    //         transition: Bounce,
    //       });
    //       setTimeout(() => window.location.reload(), 5000);
    //       toast("Page will be refresh after 5s", {
    //         ...ToastDefault,
    //         autoClose: 5000,
    //         transition: Bounce,
    //         type: "info",
    //       });
    //     } catch (err: any) {
    //       toast.update(toastId, {
    //         ...ToastDefault,
    //         render: err,
    //         type: "error",
    //         isLoading: false,
    //         transition: Bounce,
    //       });
    //     }
    //   }}
    // >
    //   <Form.Row>
    //     <Form.Group className="pl-4 mb-1 w-100">
    //       <h4 className="font-weight-bold mb-3">Colors</h4>
    //       <hr />
    //     </Form.Group>
    //     <Form.Group className="mb-0 w-100">
    //       <DefaultMoreOptions
    //         root={PREFIX}
    //         readFrom={PREFIX}
    //         onValidate={() => {
    //           if (colors.id != -1) return true;

    //           toast.error("Pattern is not chosen", {
    //             ...ToastDefault,
    //             type: "error",
    //             transition: Bounce,
    //           });
    //           return false;
    //         }}
    //         onDelete={() => onAction("delete")}
    //         buttons={
    //           <HoverButton
    //             name="Shuffle"
    //             variant="outline-primary"
    //             icon={faCube}
    //             event={{
    //               onClick: () => {
    //                 dispatch({
    //                   type: `${PREFIX}_COLORS_GENERATED`.toUpperCase(),
    //                   value: palette(),
    //                 });

    //                 if (colors.info) return;
    //                 dispatch({
    //                   type: `${PREFIX}_INFO_CHANGED`.toUpperCase(),
    //                   value: true,
    //                 });
    //               },
    //             }}
    //           />
    //         }
    //       >
    //         <DefaultColorsForm root={PREFIX} readFrom={PREFIX} />
    //       </DefaultMoreOptions>
    //     </Form.Group>

    //     <Form.Group className="w-100">
    //       <hr hidden={!colors.info} />
    //       <InfiniteScroll
    //         className="row justify-content-center"
    //         dataLength={colors.items.length}
    //         next={onLoadNext}
    //         hasMore={hasMore}
    //         loader={
    //           <Col
    //             xs="10"
    //             sm="6"
    //             md="6"
    //             lg="4"
    //             xl="3"
    //             className="my-3 text-center"
    //           >
    //             <Container className="d-flex h-100 w-80">
    //               <Col className="align-self-center text-center">
    //                 <Spinner animation="border" role="status">
    //                   <span className="sr-only">Loading...</span>
    //                 </Spinner>
    //               </Col>
    //             </Container>
    //           </Col>
    //         }
    //       >
    //         {colors.items.map((item: ColorData, i: number) => {
    //           return (
    //             <DisplayColors
    //               data={item}
    //               selected={item.id === colors.id}
    //               event={{
    //                 onClick: () => {
    //                   dispatch({
    //                     type: `${PREFIX}_INIT`.toUpperCase(),
    //                     value: item,
    //                   });

    //                   dispatch({
    //                     type: `${PREFIX}_INFO_CHANGED`.toUpperCase(),
    //                     value: true,
    //                   });

    //                   setTimeout(
    //                     () => window.scrollTo({ top: 0, behavior: "smooth" }),
    //                     0
    //                   );
    //                 },
    //               }}
    //             />
    //           );
    //         })}
    //       </InfiniteScroll>
    //     </Form.Group>
    //   </Form.Row>
    // </Form>
    <></>
  );
}
