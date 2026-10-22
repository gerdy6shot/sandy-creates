import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { initialDemo } from '../data/demo';
import { upgradeCatalog } from '../data/catalog-upgrade';
import { normalizeCart } from './cart';
import type { CartLine, DemoState } from './models';
const DATA_KEY='sandy-creates-demo-v1'; const CART_KEY='sandy-creates-bag-v1';
function read<T>(key:string,fallback:T):T {try {const v=localStorage.getItem(key);return v?JSON.parse(v):fallback;}catch{return fallback;}}
function loadDemo():DemoState {const saved=read<DemoState>(DATA_KEY,initialDemo);return saved&&Array.isArray(saved.products)&&Array.isArray(saved.events)&&Array.isArray(saved.inquiries)&&saved.settings&&saved.content ? upgradeCatalog(saved) : structuredClone(initialDemo);}
const Context=createContext<null|{data:DemoState;setData:React.Dispatch<React.SetStateAction<DemoState>>;cart:CartLine[];setCart:React.Dispatch<React.SetStateAction<CartLine[]>>;storageError:boolean;reset:()=>void}>(null);
export function Store({children}:{children:ReactNode}) {
 const [data,setData]=useState(loadDemo);const [cart,setCart]=useState(()=>normalizeCart(read(CART_KEY,[]),data.products));const [storageError,setStorageError]=useState(false);
 useEffect(()=>{try{localStorage.setItem(DATA_KEY,JSON.stringify(data));localStorage.setItem(CART_KEY,JSON.stringify(cart));}catch{setStorageError(true);}},[data,cart]);
 function reset(){setData(structuredClone(initialDemo));setCart([]);}
 return <Context.Provider value={{data,setData,cart,setCart,storageError,reset}}>{children}</Context.Provider>;
}
export function useStore(){const c=useContext(Context);if(!c)throw new Error('Store missing');return c;}
