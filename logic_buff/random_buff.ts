import { DependencyInjectable } from "../di/DependencyInjectable.ts";
import { useShiritoriReducer } from "../hooks/useShiritoriReducer.ts";
import { Supplyer } from "../di/supplyer.ts";
import { useDI } from "../di/useDI.tsx";
import { RandomLogic, RandomLogicSupplyer } from "../logic/random_logic.ts";

export const RandomBuffSupplyer = new Supplyer<RandomBuff>(() => {
    return new RandomBuff();
});

export class RandomBuff implements DependencyInjectable {
    private state;
    private dispatch;
    
    private logic;
    
    constructor() {
        [this.state, this.dispatch] = useShiritoriReducer();
        this.logic = useDI<RandomLogic>(RandomLogicSupplyer);

//        this.reset();
    }

    set NextWord(_word: string) {
        console.log("setNextWord");
        this.dispatch({type: 'CHANGE_VALUE', data: _word, field: 'nextWordInput'});
    }

    private set PreviousWord(_word: string) {
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
        if(this.logic.isWordUpdatable(this.previousWord, nextWord)) {
            this.PreviousWord = nextWord;
            console.log(this.previousWord);
            
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
        return this.state.nextWordInput;   
    }
    
    get previousWord() {
        return this.state.previousWord;
    }

    public TYPE = 'RandomBuff';
    public SUPPLYER: Supplyer<RandomBuff> = RandomBuffSupplyer;
}