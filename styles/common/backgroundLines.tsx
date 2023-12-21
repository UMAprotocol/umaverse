import { SerializedStyles, css } from "@emotion/react";

export const backgroundLines = (
  lineColor: string,
  bgColor: string
): SerializedStyles => css`
  position: relative;
  overflow: hidden;
  z-index: 1;
  background-image: repeating-linear-gradient(
    -27deg,
    ${bgColor},
    ${bgColor} 49px,
    ${lineColor} 49px,
    ${lineColor} 50px
  );
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-image: linear-gradient(
      to right,
      ${bgColor} 0%,
      transparent 80%,
      transparent 100%
    );
  }
`;
