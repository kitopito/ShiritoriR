// support jsx on deno deploy
//
/** @jsxImportSource https://esm.sh/react@18.2.0 */
import React, { useState, FC, useMemo, useEffect} from 'react';
import { Link } from 'aleph/react';
//import { Button } from "https://esm.sh/antd?bundle";
//import {Button, Paper, Tabs, Tab} from 'material-ui-core';
//import { Button } from "https://cdn.skypack.dev/semantic-ui-react";
import { Button, Container, Header, Divider, Grid, Dimmer, Loader } from "https://esm.sh/semantic-ui-react";
import { supabase } from "./supabase.ts";

export default function App() {
    const [accesCounter, setCounter] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{(async ()=>{
        const currentCounter = (await supabase.from('counter').select('*')).data[0];
        console.log(currentCounter);
        setCounter(currentCounter.value + 1);
        const { error } = await supabase
            .from('counter')
            .update([{value: currentCounter.value + 1}])
            .match({id: 1});
        
        setIsLoading(false);
    })();},[1]);

    return isLoading == false 
        ?(<Container textAlign="center" direction="column" >
            <Header size='huge' className='rainbow' style={{fontSize:"5rem"}}>
                 SHIRITORING BAY
            </Header>
            <Container textAlign="center" direction="column" >
            <Divider section></Divider>
            <Header as="h2">オンライン対戦</Header>
            <nav className="mt-8">
              <Link
                className="inline-flex items-center justify-center w-60 h-12 border-1 border-gray-300 rounded-full hover:border-gray-400 transition-colors duration-300"
                role="button"
                to="/pages/random"
              >
                ランダム対戦
              </Link>
            </nav>
            <Divider section></Divider>

            <Header as="h2">ロボ対戦</Header>
            <Button as="a" href="./pages/robo">Fight!</Button>
            <Divider section></Divider>

            <Header as="h2">ストーリーモード(未実装)</Header>
            <Grid columns="equal" textAlign='center'>
                <Grid.Column width={3}>
                    <Button as="a" href="./pages/koji">第一章</Button>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Button as="a" href="./pages/koji">第二章</Button>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Button as="a" href="./pages/koji">第三章</Button>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Button as="a" href="./pages/koji">第四章</Button>
                </Grid.Column>
            </Grid>
            <Divider section></Divider>

            <Header as="h2">あなたは {accesCounter} 人目</Header>
            <Header as="h2">の訪問者です</Header>
            <Header as="h2">
                {accesCounter % 100 == 0 
                    ? 'キリ番ゲット！！おめでとう！！' : ''}
                </Header>
            </Container>
        </Container>)

        :(
            <Container><Dimmer active inverted>
                <Loader>読み込み中．．．</Loader>
            </Dimmer></Container>
        );
    /*
    */
        
}
/*
        <script type="module">
            window.onload = async (event) => {
                const response = await fetch("/shiritori");
                const previousWord = await response.text();
                
                const para = document.querySelector("#previousWord");
                para.innerText = `前の単語:${previousWord}`;
            };

            document.querySelector("#nextWordSendButton").onclick = async (event) => {
                console.log("ほげ");
                const nextWord = document.querySelector("#nextWordInput").value;
                const response = await fetch("/shiritori", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({nextWord})
                });
                if(response.status / 100 !== 2) {
                    alert(await response.text());
                    return;
                }
                const previousWord = await response.text();
                
                const para = document.querySelector("#previousWord");
                para.innerText = `前の単語:${previousWord}`;
                
                // clear input
                const input = document.querySelector("#nextWordInput");
                input.value = "";
            }
        </script>);
    */