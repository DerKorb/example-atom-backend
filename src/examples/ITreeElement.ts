import { Code } from "./collabtree.config";

export interface ITreeElement {
    code: Code;
    label: string;
    children: { [key: string]: ITreeElement | string };
}
