// support jsx on deno deploy
/** @jsxImportSource https://esm.sh/react@18.2.0 */

import { Head, Link } from "aleph/react";
import App from "../App.tsx";

const externalLinks = [
  ["Get Started", "https://alephjs.org/docs/get-started"],
  ["Docs", "https://alephjs.org/docs"],
  ["Github", "https://github.com/alephjs/aleph.js"],
];

export default function Index() {
  return (
    <App/ >
  );
}
