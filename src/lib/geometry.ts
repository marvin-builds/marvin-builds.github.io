export interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** Whether two boxes overlap or come within `pad` px of each other. */
export const touches = (a: Box, b: Box, pad: number) =>
  a.left < b.right + pad && a.right > b.left - pad && a.top < b.bottom + pad && a.bottom > b.top - pad;
