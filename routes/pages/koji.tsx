// support jsx on deno deploy
/** @jsxImportSource https://esm.sh/react@18.2.0 */

import { Header, Container, Grid, Image } from "https://esm.sh/semantic-ui-react";

export default function Koji() {

    // https://illustimage.com/?dl=11460
    return (
    <Container as="article" direction="column"  
        p="4" borderWidth="1px" borderRadius="lg" 
        align="center" verticalAlign="middle">
      <Header size="huge">このページは</Header>
      <Header size="huge">　工事中です．．．</Header>
      <Image src="../../assets/mogura.png" fluid style={{opacity: "0.8"}}></Image>
    </Container>
    );
}
