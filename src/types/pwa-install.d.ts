import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "pwa-install": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        "manifest-url"?: string;
        "use-local-storage"?: boolean | string;
        "manual-apple"?: boolean | string;
        "manual-chrome"?: boolean | string;
        "disable-chrome"?: boolean | string;
        "disable-close"?: boolean | string;
        "disable-install-description"?: boolean | string;
        "disable-screenshots"?: boolean | string;
        "disable-screenshots-apple"?: boolean | string;
        "disable-screenshots-chrome"?: boolean | string;
        "disable-android-fallback"?: boolean | string;
        "manual-how-to"?: boolean | string;
        "install-description"?: string;
        name?: string;
        description?: string;
        icon?: string;
        styles?: string;
      };
    }
  }
}
