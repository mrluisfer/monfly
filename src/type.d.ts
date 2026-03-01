declare module "*.css?url" {
  const url: string;
  export default url;
}
declare module "*.svg?react" {
  import * as React from "react";
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "@tanstack/react-start/config" {
  export function defineConfig<T>(config: T): T;
}

declare module "@tanstack/react-start/api" {
  export const defaultAPIFileRouteHandler: unknown;
  export function createStartAPIHandler(
    handler: unknown
  ): (event: unknown) => unknown;
}
