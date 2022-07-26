import { DependencyInjectable } from "../di/DependencyInjectable.ts";
import { Supplyer } from "../di/supplyer.ts";
//import { useShiritoriReducer } from "../hooks/useShiritoriReducer.ts";

export const RandomLogicSupplyer = new Supplyer<RandomLogic>(() => {
    return new RandomLogic();
});

export class RandomLogic implements DependencyInjectable {
//    private state;
    constructor(/*_state*/) {
//        this.state = _state;
    }
    
    public isWordUpdatable(
            previousWord: string,
            nextWord: string,
            wordHistory: Array<string>) {
        
        if(nextWord.includes(' ') || nextWord.includes('　')) {
            alert("空白を含めないでほしいのだ。");
            return false;
        }
        if(nextWord == "" || nextWord == null) {
            alert("単語を入力するのだ。");
            return false;
        }
        if(this.isHiragana(nextWord) == false) {
            alert("全てひらがなで入力するのだ。");
            return false;
        }
        if(nextWord.length > 0 &&
                previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)) {
            alert("前の単語に続いていないのだ。");
            return false;
        }
        
        // 無限ハム太郎地獄: "はむたろう" は何度でも入力できる
        if(nextWord === "はむたろう") {
            alert("ハム太郎なのだ！");
            return true;
        }
//        console.log(this.state);
//        const wordHistory = this.state.wordHistory as Array<string>; 
//        console.log("ほげほげ　wordHistory");
//        console.log(wordHistory);
        if(wordHistory.includes(nextWord)) {
            alert("前に使ったことがある単語なのだ。");
            return false;
        }
        
        /*
        if(wordHistory.includes(nextWord)) {
            return new Response("前に使ったことのある単語なのだ。", {status: 400});
        }
        */
        return true;
    }
    
    isHiragana(str: string): boolean {
        str = (str==null)?"":str;
        if(str.match(/^[ぁ-んー　]*$/)) { //"ー"の後ろの文字は全角スペースです。
          return true;
        }else{
          return false;
        }
  }
    public TYPE = 'RandomLogic';
    public SUPPLYER: Supplyer<RandomLogic> = RandomLogicSupplyer;
}