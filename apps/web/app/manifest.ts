import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Doctor Who",
    short_name: "Doctor Who",
    description: "Local-first health analytics with biometric capture, reporting, and device integrations.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#09101e",
    theme_color: "#0f766e",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
