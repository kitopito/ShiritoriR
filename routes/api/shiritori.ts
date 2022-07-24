
import type { APIHandler } from 'aleph/types.d.ts'


let previousWord = "しりとり";
let wordHistory = [previousWord];

console.log("Listening on http://localhost:8000");

export const handler: APIHandler = async ({req, responce}) => {
    alert("hoge");
    console.log("hoge");
    let method = req.method;
    responce.json({"name": previousWord});
    
    if(req.method === "GET") {
//        return new Response(previousWord);
        responce.json({previousWord});
    }
    if(req.method === "POST") {
        const requestJson = await req.json();
        const nextWord = requestJson.nextWord;
        
        if(nextWord == "") {
//            return new Response("単語を入力するのだ。", {status: 400});
            responce.json({previousWord});
        }
        if(nextWord.length > 0 &&
            previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)) {
//            return new Response("前の単語に続いていないのだ。", {status: 400});
            responce.json({previousWord});
        }
        
        if(wordHistory.includes(nextWord)) {
 //           return new Response("前に使ったことのある単語なのだ。", {status: 400});
            responce.json({previousWord});
        }

        previousWord = nextWord;
        wordHistory.push(previousWord);
        responce.json({previousWord});
//        return new Response(previousWord);
    }
}
/*
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
*/