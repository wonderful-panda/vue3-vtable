import { CSSProperties, CSSProperties } from "vue";

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      class?: string | string[] | Record<string, boolean>;
      style?: string | CSSProperties;
      on?: Record<string, (...args: any[]) => any>;
    }
  }
}
