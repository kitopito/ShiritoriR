import { Supplyer } from "./supplyer.ts";

// for DI (Dependecy Injection)
export interface  DependencyInjectable {
     SUPPLYER: Supplyer<any>,
}