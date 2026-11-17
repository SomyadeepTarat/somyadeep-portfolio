'use client';
import {createContext, useContext, useReducer, type ReactNode} from 'react';
import {apps, type AppId} from './registry';
export type Bounds={x:number;y:number;width:number;height:number};
export type WindowState=Bounds & {id:AppId;minimized:boolean;maximized:boolean;selection?:string;previous?:Bounds};
type State={windows:WindowState[]};
type Action={type:'open';id:AppId;selection?:string;viewport:{width:number;height:number}}|{type:'focus'|'close'|'minimize'|'maximize';id:AppId}|{type:'bounds';id:AppId;bounds:Bounds}|{type:'viewport';width:number;height:number};
export function clampBounds(b:Bounds,width:number,height:number):Bounds {const w=Math.min(Math.max(320,b.width),Math.max(320,width-24));const h=Math.min(Math.max(240,b.height),Math.max(240,height-140));return {width:w,height:h,x:Math.max(12,Math.min(b.x,width-w-12)),y:Math.max(44,Math.min(b.y,height-h-96))};}
export function windowReducer(state:State,action:Action):State {
 const existing='id' in action ? state.windows.find(w=>w.id===action.id):undefined;
 switch(action.type){
 case 'open': {const app=apps.find(a=>a.id===action.id)!;const w=existing?{...existing,minimized:false,selection:action.selection}: {id:action.id,minimized:false,maximized:false,selection:action.selection,...clampBounds({x:(action.viewport.width-app.defaultSize.width)/2+state.windows.length*22,y:Math.max(80,(action.viewport.height-app.defaultSize.height)/2-15)+state.windows.length*16,...app.defaultSize},action.viewport.width,action.viewport.height)};return {windows:[...state.windows.filter(w=>w.id!==action.id),w]};}
 case 'focus':return existing?{windows:[...state.windows.filter(w=>w.id!==action.id),existing]}:state;
 case 'close':return {windows:state.windows.filter(w=>w.id!==action.id)};
 case 'minimize':return {windows:state.windows.map(w=>w.id===action.id?{...w,minimized:true}:w)};
 case 'maximize':return {windows:state.windows.map(w=>w.id===action.id?{...w,maximized:!w.maximized}:w)};
 case 'bounds':return {windows:state.windows.map(w=>w.id===action.id?{...w,...action.bounds}:w)};
 case 'viewport':return {windows:state.windows.map(w=>({...w,...clampBounds(w,action.width,action.height)}))};
 }
}
const Context=createContext<{state:State;dispatch:React.Dispatch<Action>}|null>(null);
export function WindowProvider({children}:{children:ReactNode}) {const [state,dispatch]=useReducer(windowReducer,{windows:[]});return <Context.Provider value={{state,dispatch}}>{children}</Context.Provider>;}
export function useWindows(){const c=useContext(Context);if(!c)throw Error('WindowProvider missing');return c;}
