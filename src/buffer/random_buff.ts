import { DependencyInjectable } from "../di/DependencyInjectable.ts";
import { Supplyer } from "../di/supplyer.ts";
import { useDI } from "../di/useDI.tsx";
import { RandomLogic, RandomLogicSupplyer } from "../logic/random_logic.ts";
import { useStore } from "../hooks/store.tsx";
import { supabase } from "../supabase.ts";
import { MatchingState } from "../hooks/useMatchingReducer.ts";
import { Dictionary } from "../dictionary.ts";

export const RandomBuffSupplyer = new Supplyer<RandomBuff>(() => {
    console.log("ふがふが　rancom buff supplyer called");
    return new RandomBuff();
});

export class RandomBuff implements DependencyInjectable {
    private state;
    private dispatch;
    
    private matchingState;
    private matchingDispatch;
    
    
    private logic;
    
    constructor() {
//        [this.state, this.dispatch] = useShiritoriReducer();
        console.log("ほげほげ　random matching buff created");
        [this.state, this.dispatch] = useStore().shiritoriReducer;
        [this.matchingState, this.matchingDispatch] = useStore().matchingReducer;
        this.logic = useDI<RandomLogic>(RandomLogicSupplyer);
        console.log(this.state);
        
//        useEffect(() => {
//            this.toWaitingState();
//        });

//        this.reset();
    }

    set NextWord(_word: string) {
        console.log(this.state);
        console.log("setNextWord");
        this.dispatch({type: 'CHANGE_VALUE', data: _word, field: 'nextWordInput'});
    }

    private set PreviousWord(_word: string) {
        console.log(this.state);
        console.log("setPreviousWord");
        this.dispatch({type: 'CHANGE_VALUE', data: _word, field: 'previousWord'});
    }
    
    // deno-lint-ignore require-await
    async submission() {
        console.log("ほげ");
        console.log(this.state.nextWordInput);
        const nextWord = this.nextWordInput;
        console.log(nextWord);
        /*
        const response = await fetch("/api/shiritori", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({nextWord})
        });
        if(response.status / 100 !== 2) {
//                    alert(await response.text());
            console.log("res");
            return;
        }
//                const previousWord = await response.text();
        setPreviousWord(await response.text());
        
//                para.innerText = `前の単語:${previousWord}`;
        */
        if(this.isEndingAtN(nextWord)) {(async () => {
            this.PreviousWord = nextWord;
            // 「ん」で終わっていたら負けにする
            this.lose();
            // 負けたことを相手に伝える
            const rooms = (await supabase.from('rooms').select("*")).data;
            // 仮の実装としてroomsの配列の最初を取るようにする
            const currentData = rooms[0];
            currentData.history.push({word: nextWord, game: 'end'})
            const { error } = await supabase
                .from('rooms')
                .update([{history: currentData.history}])
                .match({room_id: this.matchingState.roomId});

        })();
            return;
        }

        if(this.logic.isWordUpdatable(this.previousWord, nextWord, this.state.wordHistory)) {(async () =>{
            this.PreviousWord = nextWord;
            console.log(this.previousWord);
            
            this.addWordHistory(nextWord);
            
            // clear input
    //                const input = document.querySelector("#nextWordInput");
    //                input.value = "";
            console.log("ふがふが　reset");
            
            const rooms = (await supabase.from('rooms').select("*")).data;
            // 仮の実装としてroomsの配列の最初を取るようにする
            const currentData = rooms[0];
//            this.matchingState.roomId
            // roomに単語を登録する 状態はcontinueとする
            currentData.history.push({word: nextWord, game: 'continue'})
            const { error } = await supabase
                .from('rooms')
                .update([{history: currentData.history}])
                .match({room_id: this.matchingState.roomId});
            
            this.NextWord = '';

            this.toOpponentTurn();
        })();}
    }
    
    reset() {
        this.PreviousWord = "しりとり";
    }
    
    
    get nextWordInput() {
        console.log("ふがふが get next word input");
        return this.state.nextWordInput;   
    }
    
    get previousWord() {
        console.log("ふがふが get next word input");
        console.log(this.state);
        return this.state.previousWord;
    }
    
    private addWordHistory(nextWord: string) {
        console.log("ふがふが add word history");
        console.log(this.state);
        this.dispatch({type: 'ADD_WORD_HISTORY', data: nextWord, field: 'wordHistory'});
    }
    
    get pageState(): MatchingState {
        console.log(this.matchingState.matchingState);
        return this.matchingState.matchingState;
    }

    private isEndingAtN(_word: string): boolean{
        // 最後の文字が「ん」で終わっているかどうか
        const subscriptOfLastLetter = _word.length - 1;
        return 'ん' == _word.charAt(subscriptOfLastLetter);
    }
    
    toMyTurn() {
        this.matchingDispatch({
            type: "CHANGE_MATCHING_STATE", 
            data: MatchingState.MYTURN});
    }
    
    private toOpponentTurn() {
        this.matchingDispatch({
            type: "CHANGE_MATCHING_STATE", 
            data: MatchingState.OPPONENTTURN});
        
        // roomが更新されるまで待つ
        const subscription = supabase.from("rooms").on('UPDATE', async (payload) => {
            console.log("ふがふが　supabase update されたナリ");
            console.log(payload);
            const newData = payload.new;
            // roomのhistoryがupdateされたらその値を取得する
            const nextHistory = newData.history[newData.history.length - 1];
            this.PreviousWord = nextHistory.word;

            // gameがcontinueならしりとりを続ける
            if(nextHistory.game == 'continue') {
                this.toMyTurn();
                console.log("俺のターン！");
            } else if(nextHistory.game == 'end') {
                // gameがendなら相手の負けとする
                this.win();
                // 勝ったほうが後片付けをする。ルームを消す
                const { error } = await supabase.from('rooms')
                    .delete().match({room_id: this.matchingState.roomId});
            }
            supabase.removeSubscription(subscription);
        }).subscribe();
    }
    
    private lose() {
        this.matchingDispatch({
            type: "CHANGE_MATCHING_STATE", 
            data: MatchingState.LOSE});
    }

    private win() {
        this.matchingDispatch({
            type: "CHANGE_MATCHING_STATE", 
            data: MatchingState.WIN});
    }

    async toWaitingState() {
        console.log("ふがふが　to waiting state");
        this.matchingDispatch({type: "CHANGE_MATCHING_STATE", data: MatchingState.MATCHING});
        const userID = new Date().getTime();
        const userIdText = userID.toString();
        console.log(userIdText);
        this.matchingDispatch({type: "SET_USER_ID", data: userIdText});
        /*
        const data = await supabase
            .from('wating')
            .select('*');
        console.log(data)
        */
        const waitingDB = (await supabase.from('wating').select('*')).data;
        console.log(waitingDB);
        /* 待っている人がいたらその人と対戦する いなかったら待つ
        * 対戦するときは新しいroomを作成する
        */
        if(waitingDB?.length === 0) {
            console.log("悲しいときー 悲しいときー");
            console.log("待ってるひとがいなかったときー");
            console.log(userIdText);
            try {
                console.log("ふがふが　insert するナリ");
                const { error } = await supabase
                    .from('wating')
                    .insert([{user_id: userIdText}]);
                if(error) {
                    throw error;
                }
            } catch(error) {
                alert("ぴよぴよ supabase insert error ナリ");
            }
            
            // 多分プライマリキーを決めないとsubscriptionできないZ
            const subscription = supabase.from("wating").on('INSERT', async payload => {
                console.log("ふがふが　insert されたナリ");
                console.log(payload);

                // 相手が入ってきたときの処理
                const insertedData = payload.new;
                const roomId = insertedData.user_id;
                // あとから入ってきた人のuser_idをroom_idとする
                this.matchingDispatch({type: "SET_ROOM_ID", data: roomId});
                try {
                    const { error } = await supabase.from('rooms')
                        .insert([{room_id: roomId, history: {}}]);
                    if(error) {throw error;}
                } catch(error) { alert("ぴよぴよ supabase insert error ナリ");}

                // 最初の単語を決める
                const dictionaryLength = Dictionary.length;
                const randomIndex = Math.floor(Math.random() * dictionaryLength);
                const _index = Dictionary[randomIndex];
                const _word = _index.word;

                this.PreviousWord = _word;
                this.addWordHistory(_word);

                try {
                    console.log("ふがふが　update するナリ");
                    const { error } = await supabase
                        .from('rooms')
                        .update([{history: [{word: _word, game: 'continue'}]}])
                        .match({room_id: roomId});
                    if(error) {
                        throw error;
                    }
                } catch(error) {
                    alert("ぴよぴよ supabase insert error ナリ");
                }

                // watingから自分と相手の情報を消す
                const meUndOppose = (await supabase.from('wating').select('*')).data;
                meUndOppose?.forEach(async (value, index, array) => {try {
                    console.log("ふがふが　delete するのだ");
                    const { error } = await supabase.from('wating')
                        .delete().match({id: value.id});
                    if(error) {throw error;}
                } catch(error) {alert("ぴよぴよ supabase delete error ナリ");}});

                await supabase.removeSubscription(subscription);

                // 相手のターンにする
                this.toOpponentTurn();
                console.log("相手のターン！");
            }).subscribe();
        } else {
            console.log("待ってるひとがいた");

            console.log("ふがふが　subscription");
            // waitingのデータが消されたらroomに参加して自分の番にする
            // もともとはinsertのほうが先だったけど間に合わないからsubscriptionを前にした
            const subscriptionD = await supabase.from("wating").on('DELETE', async (payload) => {
                console.log("ふがふが　消されたナリ");
                const roomId = userIdText;
                this.matchingDispatch({type: "SET_ROOM_ID", data: roomId});

                const rooms = (await supabase.from('rooms').select("*")).data;
                // 仮の実装としてroomsの配列の最初を取るようにする
                const currentData = rooms[0];
                const firstWord = currentData.history[0].word;
                this.PreviousWord = firstWord;
                this.addWordHistory(firstWord);

                this.matchingDispatch({
                    type: "CHANGE_MATCHING_STATE", 
                    data: MatchingState.MYTURN});
                console.log("俺のターン！");
                supabase.removeSubscription(subscriptionD);
            }).subscribe();

            console.log("ふがふが　insert");
//            try {
                console.log("ふがふが　insert するのだ");
                const { error } = await supabase
                    .from('wating')
                    .insert([{user_id: userIdText}]);
            /*
                if(error) {
                    throw error;
                }
            } catch(error) {
                alert("ぴよぴよ supabase insert error ナリ");
            }
            */
        }
    }
    
    public async resetSupabase() {
        // waitingのレコードを全消しする
        const waitings = (await supabase.from('wating').select('*')).data;
        waitings?.forEach(async (value, index, array) => {try {
            console.log("ふがふが　delete するのだ");
            const { error } = await supabase.from('wating')
                .delete().match({id: value.id});
            if(error) {throw error;}
        } catch(error) {/*alert("ぴよぴよ supabase waiting delete error ナリ");*/}});

        // roomsのレコードを全消しする
        const rooms = (await supabase.from('rooms').select('*')).data;
        console.log(rooms);
        rooms?.forEach(async (value, index, array) => {try {
            console.log("ふがふが　delete するのだ");
            const { error } = await supabase.from('rooms')
                .delete().match({id: value.id});
            if(error) {throw error;}
        } catch(error) {/*alert("ぴよぴよ supabase rooms delete error ナリ");*/}});
        console.log("ふがふが　delete したのだ");
    }
    
    public TYPE = 'RandomBuff';
    public SUPPLYER: Supplyer<RandomBuff> = RandomBuffSupplyer;
    public updateState() {
        [this.state, this.dispatch] = useStore().shiritoriReducer;
        [this.matchingState, this.matchingDispatch] = useStore().matchingReducer;
    }
}