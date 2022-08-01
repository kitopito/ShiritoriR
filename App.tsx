// support jsx on deno deploy
//
/** @jsxImportSource https://esm.sh/react@18.2.0 */
import React, { useState, FC, useMemo, useEffect} from 'react';
import { Link } from 'aleph/react';
//import { Button } from "https://esm.sh/antd?bundle";
//import {Button, Paper, Tabs, Tab} from 'material-ui-core';
//import { Button } from "https://cdn.skypack.dev/semantic-ui-react";
import { Button, Container, Header, Divider } from "https://esm.sh/semantic-ui-react";

export default function App() {

    return(
        <div>
            <Container textAlign="center" direction="column" >
            <Header size='huge'>SHIRITORING BAY</Header>
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
            </Container>
        </div>
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