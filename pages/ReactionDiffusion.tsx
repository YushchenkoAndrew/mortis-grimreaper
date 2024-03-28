import React from 'react';
import DefaultHead from '../components/Header/Header';
import DefaultHeader from '../components/Navbar/Navbar';
import DefaultFooter from '../components/default/DefaultFooter';
import DefaultEmscContainer from '../components/default/DefaultEmscContainer';
import DefaultProjectInfo from '../components/default/DefaultProjectInfo';
import { basePath } from '../config';
import Script from 'next/script';

export default function ReactionDiffusion() {
  return (
    <>
      <DefaultHead>
        <title>Reaction Diffusion</title>
        <Script
          defer
          type="text/javascript"
          src={`${basePath}/js/index.js`}
        ></Script>
        <Script
          async
          type="text/javascript"
          src={`${basePath}/js/ReactionDiffusion/index.js`}
        ></Script>
      </DefaultHead>

      <DefaultHeader projects />
      <DefaultEmscContainer canvas="limit-md" />
      <DefaultFooter name="Reaction Diffusion">
        <DefaultProjectInfo
          href="https://github.com/YushchenkoAndrew/template/tree/master/CDump/ReactionDiffusion"
          description="A simulation of chemical reaction, which is based on Cellular automaton rules. It's using a Gray-Scott model.
          Just click on the canvas!!"
        />
      </DefaultFooter>
    </>
  );
}
