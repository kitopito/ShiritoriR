import { serve } from "aleph/server";
import ssr from "aleph/react-ssr";
import routes from "./src/routes/_export.ts";

serve({
  port: 8000,
  baseUrl: import.meta.url,
  router: {
    glob: "./src/routes/**/*.{tsx,ts}",
    routes,
  },
  unocss: "preset",
  ssr,
  dev: {
    reactRefresh: true,
  },
});
