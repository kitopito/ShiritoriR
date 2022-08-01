// support jsx on deno deploy
/** @jsxImportSource https://esm.sh/react@18.2.0 */

import React, { useEffect, useMemo } from "react";
import Header from "../components/Header.tsx";
import { StoreProvider } from "../hooks/store.tsx";
import { DI_Provider } from "../di/useDI.tsx";

export default function App({ children }: { children: React.ReactNode }) {
  console.log("ほげほげ　app created");
  
  return (
  <>
        <Header />
        <StoreProvider> <DI_Provider>
          {children}
        </DI_Provider> </StoreProvider>
    </>
  );
}
