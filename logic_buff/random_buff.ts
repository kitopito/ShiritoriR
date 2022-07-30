import { DependencyInjectable } from "../di/DependencyInjectable.ts";
import { Supplyer } from "../di/supplyer.ts";
import { useDI } from "../di/useDI.tsx";
import { RandomLogic, RandomLogicSupplyer } from "../logic/random_logic.ts";
import { useStore } from "../hooks/store.tsx";
import { supabase } from "../supabase.ts";
import { MatchingState } from "../hooks/useMatchingReducer.ts";

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
    
    submission() {
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
        if(this.logic.isWordUpdatable(this.previousWord, nextWord, this.state.wordHistory)) {
            this.PreviousWord = nextWord;
            console.log(this.previousWord);
            
            this.addWordHistory(nextWord);
            
            // clear input
    //                const input = document.querySelector("#nextWordInput");
    //                input.value = "";
            this.NextWord = '';
        }
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

    async toWaitingState() {
        console.log("ふがふが　to waiting state");
        this.matchingDispatch({type: "CHANGE_MACHING_STATE", data: MatchingState.MATCHING});
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
            let subscriptionCalledNum = 0;
            const subscription = supabase.from("wating").on('INSERT', payload => {
                console.log("ふがふが　insert されたナリ");
                console.log(payload);

                // なぜか二回インサートされてるので後から追加した方を消す
                if(subscriptionCalledNum == 0) {(async function () {
                    const insertedData = payload.new;
                    const deleteTargetId = insertedData.id;
                    try {
                        console.log("ふがふが　delete するのだ");
                        const { error } = await supabase
                            .from('wating')
                            .delete()
                            .match({id: deleteTargetId});
                        if(error) {
                            throw error;
                        }
                    } catch(error) {
                        alert("ぴよぴよ supabase delete error ナリ");
                    }
                    return;
                })();} else {(async function() {
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
                    try {
                        console.log("ふがふが　insert するナリ");
                        const { error } = await supabase
                            .from('rooms')
                            .update([{history: {word: 'しりとり'}}])
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
                    this.matchingDispatch({
                        type: "CHANGE_MACHING_STATE", 
                        data: MatchingState.OPPONENTTURN});
                    console.log("相手のターン！");
                })();}
                subscriptionCalledNum++;
            }).subscribe();
        } else {
            console.log("待ってるひとがいた");
//            try {
                console.log("ふがふが　insert するのだ");
                const { error } = await supabase
                    .from('wating')
                    .insert([{user_id: userIdText}]);
                if(error) {
                    throw error;
                }
            /*
            } catch(error) {
                alert("ぴよぴよ supabase insert error ナリ");
            }
            */

            console.log("ふがふが　subscription");
            let subscriptionACalledNum = 0;
            const subscriptionA = supabase.from("wating").on('INSERT', (payload) => {
                console.log("ふがふが　insert されたのだ");
                console.log(payload);
                // なぜか二回インサートされてるので後から追加した方を消す
                if(subscriptionACalledNum == 0) {(async function () {
                    const insertedData = payload.new;
                    const deleteTargetId = insertedData.id;
                    try {
                        console.log("ふがふが　delete するのだ");
                        const { error } = await supabase
                            .from('wating')
                            .delete()
                            .match({id: deleteTargetId});
                        if(error) {
                            throw error;
                        }
                    } catch(error) {
                        alert("ぴよぴよ supabase delete error ナリ");
                    }
                    supabase.removeSubscription(subscriptionA);
                    return;
                })();}
                subscriptionACalledNum++;
            }).subscribe();

            // waitingのデータが消されたらroomに参加して自分の番にする
            const subscriptionD = supabase.from("wating").on('DELETE', (payload) => {
                const roomId = userIdText;
                this.matchingDispatch({type: "SET_ROOM_ID", data: roomId});
                this.matchingDispatch({
                    type: "CHANGE_MACHING_STATE", 
                    data: MatchingState.MYTURN});
                console.log("俺のターン！");
                supabase.removeSubscription(subscriptionD);
            }).subscribe();
        }
    }
    
    private toMyTurn() {
        this.matchingDispatch({
            type: "CHANGE_MACHING_STATE", 
            data: MatchingState.MYTURN});
    }

    public TYPE = 'RandomBuff';
    public SUPPLYER: Supplyer<RandomBuff> = RandomBuffSupplyer;
    public updateState() {
        [this.state, this.dispatch] = useStore().shiritoriReducer;
        [this.matchingState, this.matchingDispatch] = useStore().matchingReducer;
    }
}