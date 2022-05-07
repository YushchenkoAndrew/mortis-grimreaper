import { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useDispatch, useSelector } from 'react-redux';

export interface InputColorProps {
  root?: string | (() => void);
  readFrom: string;
  writeTo?: string | ((item: string) => void);
  required?: boolean;
  className?: string;
  colors?: string[];

  disabled?: boolean;
}

const STEP = 5;
const PRESET_COLOR = [
  "#f44336",
  "#e15283",
  "#9c27b0",
  "#805ad5",
  "#3f51b5",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ecc94b",
  "#f6ad55",
  "#ffffff",
  "#000000",
];

export default function InputColor(props: InputColorProps) {
  const [isOpen, onOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();
  const value = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  );

  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event: any) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!popoverRef.current || popoverRef.current?.contains?.(event.target)) {
        return;
      }

      onOpen(false);
      if (!props.root) return;

      if (typeof props.root === "function") return props.root();
      dispatch({ type: `${props.root}_CACHED`.toUpperCase() });
    };

    const validateEventStart = (event: any) => {
      startedWhenMounted = !!popoverRef.current;
      startedInside = !!(
        popoverRef.current && popoverRef.current?.contains?.(event.target)
      );
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [popoverRef]);

  function onColorSet(color: string) {
    if (typeof props.writeTo === "function") {
      return props.writeTo(color);
    }

    dispatch({
      type: `${props.writeTo ?? props.readFrom}_CHANGED`.toUpperCase(),
      readFrom: props.readFrom,
      value: color,
    });
  }

  return (
    <>
      <span
        className={`color-view ${props.className || ""}`}
        style={{ backgroundColor: value }}
        onClick={() => props.disabled || onOpen(true)}
      ></span>

      {isOpen && (
        <div
          ref={popoverRef}
          className="border pb-3 mt-2 color-picker"
          style={{ width: "300px" }}
        >
          <HexColorPicker color={value} onChange={onColorSet} />

          <div className="px-3 d-flex flex-wrap justify-content-center ">
            {(props.colors ?? PRESET_COLOR).map((color, i) => (
              <span
                key={`preset-color-${i}`}
                className="color-view m-1"
                style={{
                  backgroundColor: color,
                  width: "2rem",
                  height: "2rem",
                }}
                onClick={() => onColorSet(color)}
              ></span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
