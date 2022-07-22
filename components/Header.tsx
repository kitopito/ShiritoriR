// support jsx on deno deploy
/** @jsxImportSource https://esm.sh/react@18.2.0 */

import { Link } from "aleph/react";

export default function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        width: "100%",
        height: 80,
      }}
    >
    </header>
  );
}
