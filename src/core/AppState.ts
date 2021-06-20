import { IUser } from ".";
import { makeAutoObservable } from "mobx";

class AppState  {
    profile?:IUser;

    constructor() {
        makeAutoObservable(this);
    }

    get isConnected() {
        return Boolean(this.profile)
    }

    setUser(p: IUser) {
        this.profile = p;
    }

    unsetUser() {
        this.profile = undefined;
    }
}

export const appState = new AppState();