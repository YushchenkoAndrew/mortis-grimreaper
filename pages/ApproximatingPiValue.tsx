import React from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultP5Container from "../components/default/DefaultP5Container";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultProjectInfo from "../components/default/DefaultProjectInfo";
import { basePath } from "../config";
import Script from "next/script";

export default function ApproximatingPiValue() {
  return (
    <>
      <DefaultHead>
        <title>Approximating Pi Value</title>
        <Script defer src={`${basePath}/js/lib/p5.min.js`}></Script>
        <Script
          defer
          src={`${basePath}/js/ApproximatingPiValue/index.js`}
        ></Script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultP5Container />
      <DefaultFooter name="Approximating Pi Value">
        <DefaultProjectInfo
          href="https://github.com/YushchenkoAndrew/template/tree/master/JS/ApproximatingPiValue"
          description="Calculate Pi Value with random function and simple Math. Idea is fascinating!
          I recommend to think about it!!"
        />
      </DefaultFooter>
    </>
  );
}
