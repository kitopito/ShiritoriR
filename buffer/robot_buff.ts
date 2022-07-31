import { DependencyInjectable } from "../di/DependencyInjectable.ts";
import { Supplyer } from "../di/supplyer.ts";
import { useDI } from "../di/useDI.tsx";
import { RandomLogic, RandomLogicSupplyer } from "../logic/random_logic.ts";
import { useStore } from "../hooks/store.tsx";
import { RobotPageState } from "../hooks/useRobotReducer.ts";
import { Dictionary } from "../dictionary.ts";

export const RobotBuffSupplyer = new Supplyer<RobotBuff>(() => {
    console.log("ふがふが　Robot buff supplyer called");
    return new RobotBuff();
});

export class RobotBuff implements DependencyInjectable {
    private state;
    private dispatch;
    
    private roboState;
    private roboDispatch;
    
    private logic;
    
    constructor() {
        console.log("ほげほげ robot buff created");
        [this.state, this.dispatch] = useStore().shiritoriReducer;
        [this.roboState, this.roboDispatch] = useStore().robotReducer;
        this.logic = useDI<RandomLogic>(RandomLogicSupplyer);
        console.log(this.state);
        
//        useEffect(() => {
//            this.toWaitingState();
//        });

//        this.reset();
        this.setFirstWord();
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

        if(this.isEndingAtN(nextWord)) {(() => {
            this.PreviousWord = nextWord;
            // 「ん」で終わっていたら負けにする
            this.lose();
            // 負けたことを相手に伝える
        })();
            return;
        }

        if(this.logic.isWordUpdatable(this.previousWord, nextWord, this.state.wordHistory)) {(() =>{
            this.PreviousWord = nextWord;
            console.log(this.previousWord);
            
            this.addWordHistory(nextWord);
            
            console.log("ふがふが　reset");
            
            this.NextWord = '';
        
            // robotPageStateをrobot turnにする
            this.toRobotTurn();
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
    
    get pageState(): RobotPageState {
        console.log(this.roboState.robotPageState);
        return this.roboState.robotPageState;
    }

    private isEndingAtN(_word: string): boolean{
        // 最後の文字が「ん」で終わっているかどうか
        const subscriptOfLastLetter = _word.length - 1;
        return 'ん' == _word.charAt(subscriptOfLastLetter);
    }
    
    toMyTurn() {
        this.roboDispatch({
            type: "CHANGE_ROBOT_PAGE_STATE", 
            data: RobotPageState.MYTURN});
    }
    
    public robotTurn() {
        let wordFound: boolean = false;
        const _previousWord = this.state.previousWord;
        const lastCharacter = _previousWord.charAt(_previousWord.length - 1);

        // dictionaryからランダムで単語を探す
        const dictionaryLength = Dictionary.length;
        for(let i=0;i<100;i++) {
            const randomIndex = Math.floor(Math.random() * dictionaryLength);
            const _index = Dictionary[randomIndex];
            const _word = _index.word;

            console.log("探し中");
            console.log(_word);
            
            console.log(_word.charAt(0));
            console.log(lastCharacter);
            console.log(this.state.wordHistory);

            if(_word.charAt(0) == lastCharacter && 
                    this.state.wordHistory.includes(_word) == false) {
                this.PreviousWord = _word;
                this.addWordHistory(_word);
                wordFound = true;

                this.toMyTurn();
                console.log("俺のターン！");
                break;
            }
        }
        // 百回探しても単語が無かった場合は負けを認める
        if(wordFound == false) {
            this.win();
        }
    }

    private toRobotTurn() {
        this.roboDispatch({
            type: "CHANGE_ROBOT_PAGE_STATE", 
            data: RobotPageState.ROBOTTURN});
    }
    
    private lose() {
        this.roboDispatch({
            type: "CHANGE_ROBOT_PAGE_STATE", 
            data: RobotPageState.LOSE});
    }

    private win() {
        this.roboDispatch({
            type: "CHANGE_ROBOT_PAGE_STATE", 
            data: RobotPageState.WIN});
    }
    
    private setFirstWord() {
        const dictionaryLength = Dictionary.length;
        const randomIndex = Math.floor(Math.random() * dictionaryLength);
        const _index = Dictionary[randomIndex];
        const _word = _index.word;

        this.PreviousWord = _word;
        this.addWordHistory(_word);
    }

    public TYPE = 'RandomBuff';
    public SUPPLYER: Supplyer<RobotBuff> = RobotBuffSupplyer;
    public updateState() {
        [this.state, this.dispatch] = useStore().shiritoriReducer;
        [this.roboState, this.roboDispatch] = useStore().robotReducer;
    }
}