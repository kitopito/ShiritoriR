// support jsx on deno deploy
//
/** @jsxImportSource https://esm.sh/react@18.2.0 */
import React, { useState, useMemo } from 'react'

export default function App() {
    const [nextWordInput, setNextWord] = useState('');
    const [previousWord, setPreviousWord] = useState('hoge');

    return(
        <div>
            <h1>しりとり</h1>
            <p id="previousWord">前の単語:{previousWord}</p>
            <input id="nextWordInput" type="text" value={nextWordInput} onChange={(event) => {
                setNextWord(event.target.value);
            }}/>
            <button id="nextWordSendButton" onClick={async ()=>{
                console.log("ほげ");
                const nextWord = nextWordInput;
                const response = await fetch("/shiritori", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({nextWord})
                });
                if(response.status / 100 !== 2) {
                    alert(await response.text());
                    return;
                }
//                const previousWord = await response.text();
                setPreviousWord(await response.text());
                
//                para.innerText = `前の単語:${previousWord}`;
                
                // clear input
//                const input = document.querySelector("#nextWordInput");
//                input.value = "";
                setPreviousWord('');
            }}>送信</button>
        </div>
    );
        
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