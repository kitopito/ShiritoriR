
import { serve } from "https://deno.land/std@0.138.0/http/server.ts"
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

let previousWord = "しりとり";
let wordHistory = [previousWord];

console.log("Listening on http://localhost:8000");

serve(async (req) => {
    console.log("hoge");
    const pathname = new URL(req.url).pathname;
    
    if(req.method === "GET" && pathname === "/shiritori") {
        return new Response(previousWord);
    }
    if(req.method === "POST" && pathname === "/shiritori") {
        const requestJson = await req.json();
        const nextWord = requestJson.nextWord;
        
        if(nextWord == "") {
            return new Response("単語を入力するのだ。", {status: 400});
        }
        if(nextWord.length > 0 &&
            previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)) {
            return new Response("前の単語に続いていないのだ。", {status: 400});
        }
        
        if(wordHistory.includes(nextWord)) {
            return new Response("前に使ったことのある単語なのだ。", {status: 400});
        }

        previousWord = nextWord;
        wordHistory.push(previousWord);
        return new Response(previousWord);
    }

    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
//        enablecors: true,
    });
});