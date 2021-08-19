import React from "react";
import Card from "../components/Card";
import CardColumns from "../components/CardColumns";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultNav from "../components/default/DefaultNav";

export default function Projects() {
  return (
    <>
      <DefaultHead>
        <title>Mortis Projects</title>
        <link
          rel="preload"
          href="/projects/fonts/ABSTRACT.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/projects/fonts/Roboto-Thin.ttf"
          as="font"
          crossOrigin=""
        />
      </DefaultHead>

      <DefaultHeader projects />
      <main role="main">
        <CardColumns>
          <Card
            img="/projects/img/ApproximatingPiValue.webp"
            title="Find Pi with RNG"
            href={`/projects/ApproximatingPiValue`}
            description="Plz RNG Gods, I need to gacha the Pi value"
          />
          <Card
            img="/projects/img/CodeRain.webp"
            title="Code Rain"
            size="title-lg"
            href={`/projects/CodeRain`}
            description="Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes"
          />
          <Card
            img="/projects/img/HammingCode.webp"
            title="Hamming Code"
            href={`/projects/HammingCode`}
            description="The first algorithm for Error correction"
          />
          <Card
            img="/projects/img/Minecraft.webp"
            title="3D Engine"
            size="title-lg"
            href={`/projects/Minecraft`}
            description="Yet another Minecraft clone"
          />
          <Card
            img="/projects/img/ReactionDiffusion.webp"
            title="Reaction Diffusion"
            href={`/projects/ReactionDiffusion`}
            description="Haha, chemical elements go brrrrr "
          />
          <Card
            img="/projects/img/ShadowCasting.webp"
            title="Shadow Casting"
            href={`/projects/ShadowCasting`}
            description="Same as Ray Casting, but better"
          />

          {/* WARNING: Temp file */}
          <Card
            img="/projects/img/Black.webp"
            title="Some text"
            href="#"
            size="title-lg"
            // color="text-dark"
            description="Some small text which is no so important, but still it's good to have"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            color="text-dark"
            description="Some small text"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            color="text-dark"
            description="Some small text"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            color="text-dark"
            description="Some small text"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            color="text-dark"
            description="Some small text"
          />
          <Card
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            title="Some text"
            href="#"
            color="text-dark"
            description="Some small text"
          />
        </CardColumns>
      </main>

      <DefaultFooter name="Menu">
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}