// support jsx on deno deploy
/** @jsxImportSource https://esm.sh/react@18.2.0 */

import Header from "../components/Header.tsx";
import { ChakraProvider } from 'chakra-ui';
import { StoreProvider } from "../hooks/store.tsx";
import { DI_Provider } from "../di/useDI.tsx";

export default function App({ children }: { children: React.ReactNode }) {
  console.log("ほげほげ　app created");
  
  return (
  <>
      <ChakraProvider>
        <Header />
        <StoreProvider> <DI_Provider>
          {children}
        </DI_Provider> </StoreProvider>
      </ChakraProvider>
    </>
  );
}
