import { DependencyInjectable } from "../di/DependencyInjectable.ts";
import { Supplyer } from "../di/supplyer.ts";

export const RandomLogicSupplyer = new Supplyer<RandomLogic>(() => {
    return new RandomLogic();
});

export class RandomLogic implements DependencyInjectable {
    constructor() {
    }
    
    public isWordUpdatable(previousWord: string, nextWord: string) {
        
        if(nextWord == "") {
            alert("単語を入力するのだ。");
            return false;
        }
        if(nextWord.length > 0 &&
                previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)) {
            alert("前の単語に続いていないのだ。");
            return false;
        }
        
        /*
        if(wordHistory.includes(nextWord)) {
            return new Response("前に使ったことのある単語なのだ。", {status: 400});
        }
        */
        return true;
    }
    
    public TYPE = 'RandomLogic';
    public SUPPLYER: Supplyer<RandomLogic> = RandomLogicSupplyer;
}