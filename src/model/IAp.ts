import {IConfluence} from "./IConfluence";
import {IApRequest} from "./IApRequest";

export interface IAp {
  confluence: IConfluence;
  request: {
    (req: IApRequest): any
  };
  navigator: any;
  dialog: any;
  user: any;
}