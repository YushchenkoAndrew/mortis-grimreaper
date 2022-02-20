import React from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultEmscContainer from "../components/default/DefaultEmscContainer";
import DefaultProjectInfo from "../components/default/DefaultProjectInfo";
import { basePath } from "../config";
import Script from "next/script";

export default function HammingCode() {
  return (
    <>
      <DefaultHead>
        <title>Hamming Code</title>
        <Script
          defer
          src={`${basePath}/js/HammingCode/HammingCode.js`}
        ></Script>
        <Script defer src={`${basePath}/js/HammingCode/index.js`}></Script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultEmscContainer width={900} />
      <DefaultFooter name="Hamming Code">
        <DefaultProjectInfo
          href="https://github.com/YushchenkoAndrew/template/tree/master/JS/ApproximatingPiValue"
          description="Create a implementation of alg 'Hamming Code', which is detecting a flipped bit
          in data stream. For changing bit value just mouse click on a square and it
          will invert the value. Left table represent data with an error bit and the right
          corrected one"
        />
      </DefaultFooter>
    </>
  );
}
