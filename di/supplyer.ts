import { DependencyInjectable } from "./DependencyInjectable.ts";

export class Supplyer<T extends DependencyInjectable> {
    create: ()=>T;

    constructor(creater: () => T) {
        this.create = creater;
//        this.TYPE = T.TYPE;
    }
    
//    TYPE: string;
}