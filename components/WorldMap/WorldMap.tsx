import React, { useEffect, useState } from "react";
import GeoJSON from "geojson";
import { geoMercator, geoPath } from "d3-geo";
import { PathTooltip } from "react-path-tooltip";
import geoData from "./countries.geo";
const CDefaultColor = "#dddddd";

interface IData {
  country: string;
  value: number;
}

interface ICountryContext {
  country: string;
  countryValue: number;
  color: string;
  minValue: number;
  maxValue: number;
}

interface IProps {
  data: IData[];
  title?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  color?: string;
  strokeOpacity?: number;
  backgroundColor?: string;
  tooltipBgColor?: string;
  tooltipTextColor?: string;
  size?: string; // possile values are sm, md, lg
  frame?: boolean;
  frameColor?: string;
  // type?: string, // depracated for the time being (reasoning in the README.md file)

  styleFunction?: (context: ICountryContext) => {};

  onClickFunction?: (
    event: React.MouseEvent<SVGElement, Event>,
    countryName: string,

    isoCode: string,
    value: string,
    prefix: string,
    suffix: string
  ) => {};

  tooltipTextFunction?: (
    countryName: string,
    isoCode: string,
    value: string,
    prefix: string,
    suffix: string
  ) => string;
  borderColor?: string;
}

const CSizes: { [key: string]: number } = {
  sm: 240,
  md: 336,
  lg: 480,
  xl: 640,
  xxl: 1200,
  responsive: -1,
};

const CHeightRatio = 3 / 4;

export const WorldMap: React.FC<IProps> = (props: IProps) => {
  // calculate window width
  const [windowWidth, setWidth] = useState(0);
  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateWidth);
    updateWidth();
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // get input size
  const size = typeof props.size !== "undefined" ? props.size : "sm";

  // adjust responsive size
  const responsify = (sz: string) => {
    let realSize = sz;
    if (sz === "responsive") {
      return Math.min(window.innerHeight, window.innerWidth) * 0.75;
    }
    while (CSizes[realSize] > windowWidth) {
      if (realSize === "sm") {
        return CSizes.sm;
      }
      if (realSize === "md") {
        realSize = "sm";
      } else if (realSize === "lg") {
        realSize = "md";
      } else if (realSize === "xl") {
        realSize = "lg";
      } else if (realSize === "xxl") {
        realSize = "xl";
      }
    }
    return CSizes[realSize];
  };

  // inits
  const width = responsify(size);
  const height = responsify(size) * CHeightRatio;
  const valuePrefix =
    typeof props.valuePrefix === "undefined" ? "" : props.valuePrefix;
  const valueSuffix =
    typeof props.valueSuffix === "undefined" ? "" : props.valueSuffix;
  const tooltipBgColor =
    typeof props.tooltipBgColor === "undefined"
      ? "black"
      : props.tooltipBgColor;
  const tooltipTextColor =
    typeof props.tooltipTextColor === "undefined"
      ? "white"
      : props.tooltipTextColor;
  const isFrame = typeof props.frame === "undefined" ? false : props.frame;
  const backgroundColor =
    typeof props.backgroundColor === "undefined"
      ? "white"
      : props.backgroundColor;
  const strokeOpacity =
    typeof props.strokeOpacity === "undefined" ? 0.2 : props.strokeOpacity;
  const frameColor =
    typeof props.frameColor === "undefined" ? "black" : props.frameColor;
  const borderColor =
    typeof props.borderColor === "undefined" ? "black" : props.borderColor;
  const frame = isFrame ? (
    <rect
      x={0}
      y={0}
      width={"100%"}
      height={"100%"}
      stroke={frameColor}
      fill="none"
    />
  ) : (
    <path></path>
  );
  const title = typeof props.title === "undefined" ? "" : <p>{props.title}</p>;
  const scale = width / 960;
  const transformPaths = `scale(${scale.toString()}) translate (0,240)`;

  const containerRef = React.createRef<SVGSVGElement>();

  const defaultCountryStyle = (context: ICountryContext) => {
    const contextCountryValue = context.countryValue ? context.countryValue : 0;
    const opacityLevel =
      0.2 +
      0.6 *
        ((contextCountryValue - context.minValue) /
          (context.maxValue - context.minValue));
    const style = {
      fill: context.color,
      fillOpacity:
        contextCountryValue === 0 ? contextCountryValue : opacityLevel,
      stroke: borderColor,
      strokeWidth: 1,
      strokeOpacity,
      cursor: "pointer",
    };
    return style;
  };

  // Calc min/max values and build country map for direct access
  const countryValueMap: { [key: string]: number } = {};
  let max = -Infinity;
  let min = Infinity;
  props.data.forEach((entry) => {
    const key = entry.country.toUpperCase();
    const { value } = entry;
    min = min > value ? value : min;
    max = max < value ? value : max;
    countryValueMap[key] = value;
  });

  // Build a path & a tooltip for each country
  const projection = geoMercator();
  const pathGenerator = geoPath().projection(projection);

  const pathsAndToolstips = geoData.features.map((feature, idx) => {
    const triggerRef = React.createRef<SVGPathElement>();
    const isoCode = feature.I;
    const countryName = feature.N;
    const geoFeature: GeoJSON.Feature = {
      type: "Feature",
      properties: { NAME: countryName, ISO_A2: isoCode },
      geometry: {
        type: "MultiPolygon",
        coordinates: feature.C as GeoJSON.Position[][][],
      },
    };
    const isHighlight = typeof countryValueMap[isoCode] !== "undefined";
    const style =
      props.styleFunction && isHighlight
        ? props.styleFunction({
            country: isoCode,
            countryValue: countryValueMap[isoCode],
            color: props.color ? props.color : CDefaultColor,
            minValue: min,
            maxValue: max,
          })
        : defaultCountryStyle({
            country: isoCode,
            countryValue: countryValueMap[isoCode],
            color: props.color ? props.color : CDefaultColor,
            minValue: min,
            maxValue: max,
          });

    const path = (
      <path
        key={`path${idx}`}
        ref={triggerRef}
        d={pathGenerator(geoFeature as GeoJSON.Feature) as string}
        style={style}
        onClick={(e) => {
          if (props.onClickFunction && countryValueMap[isoCode]) {
            props.onClickFunction(
              e,
              countryName,
              isoCode,
              countryValueMap[isoCode].toString(),
              valuePrefix || "",
              valueSuffix || ""
            );
          }
        }}
        onMouseOver={(event) => {
          event.currentTarget.style.strokeWidth = "2";
          event.currentTarget.style.strokeOpacity = "0.5";
        }}
        onMouseOut={(event) => {
          event.currentTarget.style.strokeWidth = "1";
          event.currentTarget.style.strokeOpacity = `${strokeOpacity}`;
        }}
      />
    );

    let tip = "";
    if (props.tooltipTextFunction && countryValueMap[isoCode]) {
      tip = props.tooltipTextFunction(
        countryName,
        isoCode,
        countryValueMap[isoCode].toString(),
        valuePrefix || "",
        valueSuffix || ""
      );
    } else if (countryValueMap[isoCode]) {
      tip = `${countryName} ${valuePrefix} ${countryValueMap[
        isoCode
      ].toLocaleString()} ${valueSuffix}`;
    }

    const tooltip = !isHighlight ? (
      <g pointerEvents={"none"} key={`path${idx}xyz`}></g>
    ) : (
      <PathTooltip
        fontSize={12}
        bgColor={tooltipBgColor}
        textColor={tooltipTextColor}
        key={`path_${idx}_xyz`}
        pathRef={triggerRef}
        svgRef={containerRef}
        tip={tip}
      />
    );

    return { path, highlightedTooltip: tooltip };
  });

  // build paths
  const paths = pathsAndToolstips.map((entry) => entry.path);

  // build tooltips
  const highlightedTooltips = pathsAndToolstips.map(
    (entry) => entry.highlightedTooltip
  );

  // Render the SVG
  return (
    <div
      style={{
        backgroundColor,
        height: "auto",
        width: "auto",
        padding: "0px",
        margin: "0px",
      }}
    >
      {title}
      <svg ref={containerRef} height={`${height}px`} width={`${width}px`}>
        {frame}
        <g transform={transformPaths}>{paths}</g>
        {highlightedTooltips}
      </svg>
    </div>
  );
};
