import { DependencyInjectable } from "../di/DependencyInjectable.ts";
import { Supplyer } from "../di/supplyer.ts";
import { useDI } from "../di/useDI.tsx";
import { RandomLogic, RandomLogicSupplyer } from "../logic/random_logic.ts";
import { useStore } from "../hooks/store.tsx";

export const RandomBuffSupplyer = new Supplyer<RandomBuff>(() => {
    console.log("ふがふが　rancom buff supplyer called");
    return new RandomBuff();
});

export class RandomBuff implements DependencyInjectable {
    private state;
    private dispatch;
    
    private logic;
    
    constructor() {
//        [this.state, this.dispatch] = useShiritoriReducer();
        console.log("ほげほげ　random matching page created");
        [this.state, this.dispatch] = useStore().shiritoriReducer;
        this.logic = useDI<RandomLogic>(RandomLogicSupplyer);
        console.log(this.state);

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

    public TYPE = 'RandomBuff';
    public SUPPLYER: Supplyer<RandomBuff> = RandomBuffSupplyer;
}