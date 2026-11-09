import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { initialDemo } from '../data/demo';
import { normalizeCart } from './cart';
import { sandySupabase } from './sandy-supabase';
import type { CartLine, DemoState, Product } from './models';

const CART_KEY = 'sandy-creates-bag-v1';

type DbVariant = { id:string; size:string; price:number; sku:string; inventory:number; active:boolean };
type DbImage = {path:string;alt:string;position:number};
type DbProduct = {
 id:string; slug:string; name:string; category:Product['category']; short_description:string;
 description:string; ingredients:string; allergens:string; storage:string;
 shipping:boolean; pickup:boolean; published:boolean; featured:boolean;
 product_variants:DbVariant[]; product_images:DbImage[];
};

function fromDatabase(product:DbProduct):Product {
 const original=initialDemo.products.find(p=>p.slug===product.slug);
 const originalImage=product.product_images?.slice().sort((a,b)=>a.position-b.position)[0];
 const image=originalImage?.path?.startsWith('/') ? originalImage.path :
  originalImage?.path ? sandySupabase.storage.from('product-images').getPublicUrl(originalImage.path).data.publicUrl : undefined;
 const variants=product.product_variants?.filter(v=>v.active).map(v=>({
  id:v.id,size:v.size,price:v.price,sku:v.sku,inventory:v.inventory,
 })) ?? [];
 return {
  id:product.id,slug:product.slug,name:product.name,category:product.category,currency:'USD',
  short:product.short_description,description:product.description,ingredients:product.ingredients,
  allergens:product.allergens,storage:product.storage,published:product.published,featured:product.featured,
  shipping:product.shipping,pickup:product.pickup,color:original?.color ?? '#6f7a4f',
  image:image ?? original?.image,imageAlt:originalImage?.alt ?? original?.imageAlt,
  imageTreatment:'supplied-product',pricePending:variants.length===0,
  variants:variants.length?variants:[{id:'pending-'+product.id,size:'Size to be confirmed',price:0,sku:'NOT-FOR-SALE',inventory:0}],
  demo:true,
 };
}

function readCart():CartLine[] {
 try {
  const value=localStorage.getItem(CART_KEY);
  const result=value?JSON.parse(value):[];
  return Array.isArray(result)?result:[];
 } catch {return [];}
}
const Context=createContext<null|{
 data:DemoState;setData:React.Dispatch<React.SetStateAction<DemoState>>;
 cart:CartLine[];setCart:React.Dispatch<React.SetStateAction<CartLine[]>>;
 storageError:boolean;reset:()=>void;
}>(null);

export function Store({children}:{children:ReactNode}) {
 const [data,setData]=useState<DemoState>(()=>structuredClone(initialDemo));
 const [cart,setCart]=useState<CartLine[]>(readCart);
 const [storageError,setStorageError]=useState(false);
 useEffect(()=>{
  let alive=true;
  async function load() {
   const [products,content,availability,events]=await Promise.all([
    sandySupabase.from('products').select('*,product_variants(*),product_images(*)').eq('published',true).order('created_at',{ascending:true}),
    sandySupabase.from('site_content').select('key,value').eq('published',true),
    sandySupabase.from('availability').select('*').eq('id',true).maybeSingle(),
    sandySupabase.from('events').select('id,slug,title,description,start_at,end_at,timezone,published,image_path').eq('published',true),
   ]);
   if(!alive)return;
   if(products.error) { console.warn('Public catalog unavailable:',products.error.message);return; }
   const actual=(products.data??[]) as DbProduct[];
   setData(old=>({
    ...old,
    products:actual.map(fromDatabase),
    events:events.error?old.events:(events.data??[]).map(e=>({
      id:e.id,slug:e.slug,title:e.title,description:e.description,
      start:e.start_at??'',end:e.end_at??'',timezone:e.timezone,
      location:'',published:e.published,image:e.image_path??'',
      status:e.end_at&&Date.parse(e.end_at)<Date.now()?'past' as const:'upcoming' as const,
    })),
    content:{
     ...old.content,
     ...Object.fromEntries((content.data??[]).filter(row=>typeof row.value==='string').map(row=>[row.key,row.value])),
    },
    settings:availability.data?{
      ...old.settings,
      paused:availability.data.retail_paused,
      culinaryPaused:availability.data.culinary_paused,
      timezone:availability.data.timezone,
      capacity:availability.data.daily_capacity,
      leadDays:availability.data.lead_days,
      blockedDates:availability.data.blocked_dates??[],
      pickupWindows:availability.data.pickup_windows??[],
      availabilityMessage:availability.data.message,
    }:old.settings,
   }));
  }
  void load();
  return ()=>{alive=false;};
 },[]);
 useEffect(()=>{
  try { localStorage.setItem(CART_KEY,JSON.stringify(cart)); }
  catch {setStorageError(true);}
 },[cart]);
 function reset(){setCart([]);}
 return <Context.Provider value={{data,setData,cart:normalizeCart(cart,data.products),setCart,storageError,reset}}>{children}</Context.Provider>;
}
export function useStore(){const c=useContext(Context);if(!c)throw new Error('Store missing');return c;}
