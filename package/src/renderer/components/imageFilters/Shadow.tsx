import React from "react";

import { createDeclaration } from "../../nodes/Declaration";
import type { AnimatedProps } from "../../processors/Animations/Animations";
import type { Color } from "../../../skia/types";
import { processColor } from "../../../skia";

import { getInput } from "./getInput";
import { MakeInnerShadow } from "./InnerShadow";

export interface ShadowProps {
  dx: number;
  dy: number;
  blur: number;
  color: Color;
  inner?: boolean;
  shadowOnly?: boolean;
}

const onDeclare = createDeclaration<ShadowProps>(
  (
    { dx, dy, blur, color: cl, shadowOnly, inner },
    children,
    { opacity, Skia }
  ) => {
    const input = getInput(Skia, children);
    const color = processColor(cl, opacity);
    let factory;
    if (inner) {
      factory = MakeInnerShadow.bind(null, Skia, shadowOnly);
    } else {
      factory = shadowOnly
        ? Skia.ImageFilter.MakeDropShadowOnly
        : Skia.ImageFilter.MakeDropShadow;
    }
    return factory(dx, dy, blur, blur, color, input);
  }
);

export const Shadow = (props: AnimatedProps<ShadowProps>) => {
  return <skDeclaration onDeclare={onDeclare} {...props} />;
};
