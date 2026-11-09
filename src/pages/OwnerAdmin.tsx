import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, FileText, LayoutDashboard, LogOut, MessageSquare, Package, Settings, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { sandySupabase, OWNER_EMAIL } from '../lib/sandy-supabase';
import { money } from '../lib/cart';

type LiveVariant={id:string;product_id:string;size:string;sku:string;price:number;inventory:number;active:boolean};
type LiveImage={id:string;path:string;alt:string;position:number};
type LiveProduct={
 id:string;name:string;slug:string;category:'Blends'|'Sauces'|'Collections';
 short_description:string;description:string;ingredients:string;allergens:string;storage:string;
 published:boolean;featured:boolean;shipping:boolean;pickup:boolean;approved_for_sale:boolean;
 product_variants:LiveVariant[];product_images:LiveImage[];
};
type Inquiry={id:string;name:string;email:string;category:string;message:string;status:string;private_notes:string;created_at:string};
type Order={id:string;customer_email:string;total:number;payment_status:string;fulfillment_status:string;created_at:string};
type Event={id:string;title:string;slug:string;description:string;start_at:string|null;end_at:string|null;timezone:string;location:string|null;published:boolean};
type Availability={id:boolean;retail_paused:boolean;culinary_paused:boolean;timezone:string;daily_capacity:number;lead_days:number;blocked_dates:string[];pickup_windows:string[];message:string};
type ContentRow={key:string;value:string;published:boolean};
type ProductDraft={
 id?:string;variantId?:string;name:string;slug:string;category:LiveProduct['category'];
 short_description:string;description:string;ingredients:string;allergens:string;storage:string;
 published:boolean;featured:boolean;size:string;sku:string;price:string;inventory:string;imageAlt:string;
};
const sections=[['','Overview',LayoutDashboard],['products','Products',Package],['orders','Orders',ShoppingBag],['inquiries','Inquiries',MessageSquare],['events','Events',CalendarDays],['content','Website content',FileText],['availability','Availability',SlidersHorizontal],['settings','Settings',Settings]] as const;
const initialDraft:ProductDraft={name:'',slug:'',category:'Blends',short_description:'',description:'',ingredients:'',allergens:'',storage:'',published:false,featured:false,size:'',sku:'',price:'',inventory:'0',imageAlt:''};
const contentLabels:Record<string,string>={heroTitle:'Homepage headline',heroIntro:'Homepage introduction',story:'About Sandy / story',philosophy:'Philosophy'};
function errMessage(error:unknown){return error instanceof Error?error.message:String(error);}
function readImage(path:string){return path.startsWith('/')?path:sandySupabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;}
async function isOwnerAuthorized(){
 const {data:userResult,error:userError}=await sandySupabase.auth.getUser();
 if(userError||!userResult.user)return false;
 const {data,error}=await sandySupabase.rpc('is_authorized_admin');
 return !error&&data===true;
}

export function OwnerLogin(){
 const navigate=useNavigate();const [sending,setSending]=useState(false);
 const [message,setMessage]=useState('');const [checking,setChecking]=useState(true);
 useEffect(()=>{let mounted=true;void isOwnerAuthorized().then(allowed=>{
  if(mounted){setChecking(false);if(allowed)navigate('/admin',{replace:true});}
 }).catch(()=>{if(mounted)setChecking(false);});
 return ()=>{mounted=false;};},[navigate]);
 async function sendLink(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(sending)return;setSending(true);setMessage('');
  try{
   const {error}=await sandySupabase.auth.signInWithOtp({
    email:OWNER_EMAIL,
    options:{emailRedirectTo:window.location.origin+'/admin',shouldCreateUser:true},
   });
   if(error)throw error;
   setMessage('Check the owner email inbox for the secure sign-in link. The link is single-use.');
  }catch(error){setMessage('Could not send a sign-in link: '+errMessage(error));}
  finally{setSending(false);}
 }
 return <section className="section studio-login">
  <p className="eyebrow">SAN D CREATES / PRIVATE ADMINISTRATION</p>
  <h1>Welcome<br/><i>back.</i></h1>
  <p>Secure owner access to products, orders, inquiries, and website content.</p>
  {checking?<p role="status">Checking your session…</p>:<form className="studio-panel editor-form" onSubmit={e=>void sendLink(e)}>
   <p className="eyebrow">OWNER EMAIL</p>
   <p>{OWNER_EMAIL}</p>
   <p className="small-copy">A secure email link signs you in. No password is shared with the website or stored in source code.</p>
   <button type="submit" className="button" disabled={sending}>{sending?'Sending…':'Email my secure sign-in link'} <ArrowUpRight size={16}/></button>
   <p role="status" aria-live="polite">{message}</p>
  </form>}
  <Link className="text-link" to="/">Back to the website <ArrowUpRight size={16}/></Link>
 </section>;
}

export default function OwnerAdmin(){
 const navigate=useNavigate();const location=useLocation();
 const section=location.pathname.split('/')[2]??'';
 const [authorized,setAuthorized]=useState(false);
 const [checking,setChecking]=useState(true);
 const [busy,setBusy]=useState(false);
 const [status,setStatus]=useState('');
 const [products,setProducts]=useState<LiveProduct[]>([]);
 const [inquiries,setInquiries]=useState<Inquiry[]>([]);
 const [orders,setOrders]=useState<Order[]>([]);
 const [events,setEvents]=useState<Event[]>([]);
 const [content,setContent]=useState<ContentRow[]>([]);
 const [availability,setAvailability]=useState<Availability|null>(null);
 const [draft,setDraft]=useState<ProductDraft|null>(null);
 const [file,setFile]=useState<File|null>(null);
 const [newEvent,setNewEvent]=useState({title:'',slug:'',description:''});

 useEffect(()=>{let mounted=true;
  void isOwnerAuthorized().then(ok=>{
   if(!mounted)return;setChecking(false);setAuthorized(ok);
   if(!ok)navigate('/admin/login',{replace:true});
  }).catch(()=>{if(mounted){setChecking(false);navigate('/admin/login',{replace:true});}});
  return ()=>{mounted=false;};
 },[navigate]);

 const refresh=useCallback(async()=>{
  const [p,i,o,e,c,a]=await Promise.all([
   sandySupabase.from('products').select('*,product_variants(*),product_images(*)').order('created_at',{ascending:false}),
   sandySupabase.from('inquiries').select('id,name,email,category,message,status,private_notes,created_at').order('created_at',{ascending:false}).limit(100),
   sandySupabase.from('orders').select('id,customer_email,total,payment_status,fulfillment_status,created_at').order('created_at',{ascending:false}).limit(100),
   sandySupabase.from('events').select('id,title,slug,description,start_at,end_at,timezone,location,published').order('created_at',{ascending:false}),
   sandySupabase.from('site_content').select('key,value,published'),
   sandySupabase.from('availability').select('*').eq('id',true).maybeSingle(),
  ]);
  const errors=[p,i,o,e,c,a].filter(x=>x.error).map(x=>x.error?.message);
  if(errors.length)throw new Error(errors.join(' · '));
  setProducts((p.data??[]) as LiveProduct[]);
  setInquiries((i.data??[]) as Inquiry[]);
  setOrders((o.data??[]) as Order[]);
  setEvents((e.data??[]) as Event[]);
  setContent((c.data??[]) as ContentRow[]);
  setAvailability((a.data??null) as Availability|null);
 },[]);
 useEffect(()=>{if(authorized)void refresh().catch(error=>setStatus('Could not load owner records: '+errMessage(error)));},[authorized,refresh]);

 async function run(action:()=>Promise<void>,success:string){
  if(busy)return;setBusy(true);setStatus('');
  try{await action();await refresh();setStatus(success);}
  catch(error){setStatus('Could not save: '+errMessage(error));}
  finally{setBusy(false);}
 }
 function editProduct(item:LiveProduct){
  const variant=item.product_variants?.[0];
  setDraft({
   id:item.id,variantId:variant?.id,name:item.name,slug:item.slug,category:item.category,
   short_description:item.short_description,description:item.description,
   ingredients:item.ingredients,allergens:item.allergens,storage:item.storage,
   published:item.published,featured:item.featured,size:variant?.size??'',sku:variant?.sku??'',
   price:variant?(variant.price/100).toFixed(2):'',inventory:String(variant?.inventory??0),
   imageAlt:item.product_images?.[0]?.alt??'',
  });
  setFile(null);setStatus('');
 }
 async function saveProduct(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(!draft)return;
  const chosen=draft;
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(chosen.slug)){setStatus('Use lowercase words separated by hyphens for the product URL.');return;}
  const price=Number(chosen.price);const inventory=Number(chosen.inventory);
  if(chosen.price!==''&&(!Number.isFinite(price)||price<=0||!Number.isSafeInteger(Math.round(price*100))||!Number.isInteger(inventory)||inventory<0||!chosen.sku.trim()||!chosen.size.trim())){
   setStatus('Enter a valid price, size, SKU, and nonnegative whole-number inventory.');return;
  }
  await run(async()=>{
   const payload={
    name:chosen.name.trim(),slug:chosen.slug.trim(),category:chosen.category,
    short_description:chosen.short_description,description:chosen.description,
    ingredients:chosen.ingredients,allergens:chosen.allergens,storage:chosen.storage,
    published:chosen.published,featured:chosen.featured,
   };
   const result=chosen.id
    ?await sandySupabase.from('products').update(payload).eq('id',chosen.id).select('id').single()
    :await sandySupabase.from('products').insert({...payload,approved_for_sale:false,shipping:false,pickup:false}).select('id').single();
   if(result.error||!result.data)throw result.error??new Error('Product save failed.');
   const id=result.data.id as string;
   if(chosen.price!==''){
    const variant={product_id:id,size:chosen.size.trim(),sku:chosen.sku.trim(),price:Math.round(price*100),inventory,active:true};
    const saved=chosen.variantId
     ?await sandySupabase.from('product_variants').update(variant).eq('id',chosen.variantId)
     :await sandySupabase.from('product_variants').insert(variant);
    if(saved.error)throw saved.error;
   }
   if(file){
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>2*1024*1024)throw new Error('Use an original JPEG, PNG, or WebP image under 2 MB.');
    const extension=file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':'webp';
    const path='products/'+id+'/'+crypto.randomUUID()+'.'+extension;
    const uploaded=await sandySupabase.storage.from('product-images').upload(path,file,{contentType:file.type,upsert:false});
    if(uploaded.error)throw uploaded.error;
    const removed=await sandySupabase.from('product_images').delete().eq('product_id',id);
    if(removed.error)throw removed.error;
    const inserted=await sandySupabase.from('product_images').insert({product_id:id,path,alt:chosen.imageAlt||chosen.name,position:0});
    if(inserted.error)throw inserted.error;
   }
   setDraft(null);setFile(null);
  },'Product saved in Supabase. Published changes appear on the website after refresh.');
 }
 async function saveContent(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  await run(async()=>{
   const rows=content.filter(c=>Object.keys(contentLabels).includes(c.key)).map(c=>({key:c.key,value:c.value,published:true}));
   const r=await sandySupabase.from('site_content').upsert(rows,{onConflict:'key'});
   if(r.error)throw r.error;
  },'Website copy saved. Refresh the public website to see it.');
 }
 async function saveAvailability(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(!availability)return;
  await run(async()=>{
   const {id,...fields}=availability;
   const result=await sandySupabase.from('availability').update(fields).eq('id',id);
   if(result.error)throw result.error;
  },'Availability saved. Payment checkout remains disabled until separately authorized.');
 }
 async function saveEvent(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(newEvent.slug)){setStatus('Event URL must use lowercase words and hyphens.');return;}
  await run(async()=>{
   const r=await sandySupabase.from('events').insert({
    title:newEvent.title,slug:newEvent.slug,description:newEvent.description,published:false,
    timezone:'America/New_York',
   });
   if(r.error)throw r.error;setNewEvent({title:'',slug:'',description:''});
  },'Private event draft created. It is not publicly published.');
 }
 async function signOut(){
  await sandySupabase.auth.signOut();navigate('/admin/login',{replace:true});
 }
 if(checking||!authorized)return <section className="section studio-login"><p role="status">Checking secure owner access…</p></section>;

 return <div className="studio-layout">
  <aside className="studio-sidebar">
   <Link to="/admin" className="studio-title">The studio<span>SAN D CREATES / OWNER</span></Link>
   <nav aria-label="Owner navigation">{sections.map(([slug,label,Icon])=><NavLink key={slug} to={'/admin'+(slug?'/'+slug:'')} end><Icon size={17}/>{label}</NavLink>)}</nav>
   <Link className="studio-back" to="/">View website <ArrowUpRight size={15}/></Link>
   <button className="studio-back" type="button" onClick={()=>void signOut()}><LogOut size={15}/> Sign out</button>
  </aside>
  <section className="studio-main">
   <div className="studio-heading"><div><p className="eyebrow">SECURE OWNER WORKSPACE</p><h1>{sections.find(s=>s[0]===section)?.[1]??'Owner studio'}</h1></div><span className="studio-badge">LIVE DATA</span></div>
   <p role="status" aria-live="polite" className="status studio-status">{status}</p>
   {section===''&&<>
    <div className="studio-stats">
     <div><span>Products</span><strong>{products.length}</strong><small>{products.filter(p=>p.published).length} published</small></div>
     <div><span>Orders</span><strong>{orders.length}</strong><small>Real records only</small></div>
     <div><span>Inquiries</span><strong>{inquiries.length}</strong><small>{inquiries.filter(i=>i.status==='New').length} new</small></div>
    </div>
    <div className="studio-two">
     <section className="studio-panel"><h2>Spice Gurl</h2><p>Manage the live product catalog, prices, availability, and original product photos.</p><Link className="text-link" to="/admin/products">Manage products <ArrowUpRight size={16}/></Link></section>
     <section className="studio-panel"><h2>Orders and inquiries</h2><p>Only real Supabase records appear here. Checkout remains disabled until fulfillment and payment requirements are approved.</p><Link className="text-link" to="/admin/inquiries">Review inquiries <ArrowUpRight size={16}/></Link></section>
    </div>
   </>}
   {section==='products'&&<>{draft?<form className="studio-panel editor-form" onSubmit={e=>void saveProduct(e)}>
    <h2>{draft.id?'Edit product':'New product'}</h2>
    <div className="form-grid">
     {(['name','slug','short_description','description','ingredients','allergens','storage'] as const).map(key=><label key={key} className={['description','ingredients','allergens','storage'].includes(key)?'full-width':''}>{({name:'Product name',slug:'URL slug',short_description:'Short description',description:'Description',ingredients:'Ingredients',allergens:'Allergens',storage:'Storage'} as const)[key]}<input value={draft[key]} required={key==='name'||key==='slug'} onChange={e=>setDraft({...draft,[key]:e.target.value})}/></label>)}
     <label>Category<select value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value as LiveProduct['category']})}><option>Blends</option><option>Sauces</option><option>Collections</option></select></label>
     {(['size','sku','price','inventory'] as const).map(key=><label key={key}>{({size:'Variant size',sku:'Stock keeping unit',price:'Price (USD)',inventory:'Stock units'} as const)[key]}<input type={key==='price'||key==='inventory'?'number':'text'} min={key==='price'?'0.01':key==='inventory'?'0':undefined} step={key==='price'?'0.01':key==='inventory'?'1':undefined} value={draft[key]} onChange={e=>setDraft({...draft,[key]:e.target.value})}/></label>)}
    </div>
    <label className="checkbox-label"><input type="checkbox" checked={draft.published} onChange={e=>setDraft({...draft,published:e.target.checked})}/>Display this product publicly</label>
    <label className="checkbox-label"><input type="checkbox" checked={draft.featured} onChange={e=>setDraft({...draft,featured:e.target.checked})}/>Feature on homepage</label>
    <label>Original product photograph (JPEG, PNG, WebP; max 2 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setFile(e.target.files?.[0]??null)}/></label>
    <label>Photograph description<input value={draft.imageAlt} onChange={e=>setDraft({...draft,imageAlt:e.target.value})}/></label>
    <p className="small-copy">Photographs are uploaded without image processing. Publishing does not activate paid checkout.</p>
    <div className="form-grid"><button className="button" type="submit" disabled={busy}>{busy?'Saving…':'Save product'}</button><button className="button secondary" type="button" onClick={()=>{setDraft(null);setFile(null);}}>Cancel</button></div>
   </form>:<>
    <button className="button" onClick={()=>{setDraft({...initialDraft});setFile(null);}} type="button">Add product</button>
    <div className="studio-table" role="table" aria-label="Live products"><div className="table-head" role="row"><span>Product</span><span>Price</span><span>Status</span><span>Action</span></div>
     {products.map(p=><div className="table-row" role="row" key={p.id}>
      <div><strong>{p.name}</strong><small>{p.category} · {p.product_variants?.reduce((s,v)=>s+v.inventory,0)??0} units</small>
       {p.product_images?.[0]&&<img src={readImage(p.product_images[0].path)} alt={p.product_images[0].alt} width="80" height="80" style={{objectFit:'contain'}}/>}</div>
      <span>{p.product_variants?.[0]?money(p.product_variants[0].price):'Not set'}</span>
      <span>{p.published?'Published':'Draft'}</span>
      <button className="table-action" onClick={()=>editProduct(p)}>Edit</button>
     </div>)}
    </div>
   </>}</>}
   {section==='orders'&&<section className="studio-panel"><h2>Orders</h2>{!orders.length?<p>No live orders yet. Checkout has not been enabled.</p>:orders.map(o=><article key={o.id} className="studio-panel"><strong>{o.id.slice(0,8)}</strong><p>{o.customer_email} · {money(o.total)} · Payment: {o.payment_status}</p><label>Fulfillment status<select value={o.fulfillment_status} disabled={busy} onChange={e=>void run(async()=>{const r=await sandySupabase.from('orders').update({fulfillment_status:e.target.value}).eq('id',o.id);if(r.error)throw r.error;},'Order status saved.')}>{['unfulfilled','processing','ready','shipped','completed','canceled','needs_review'].map(s=><option key={s}>{s}</option>)}</select></label></article>)}</section>}
   {section==='inquiries'&&<>{!inquiries.length?<section className="studio-panel"><h2>Inquiries</h2><p>No customer inquiries have been recorded. The public inquiry form is not activated yet.</p></section>:inquiries.map(i=><section className="studio-panel" key={i.id}><p className="eyebrow">{i.category} · {new Date(i.created_at).toLocaleDateString()}</p><h2>{i.name}</h2><p><a href={'mailto:'+i.email}>{i.email}</a></p><p>{i.message}</p><label>Response status<select value={i.status} onChange={e=>setInquiries(prev=>prev.map(x=>x.id===i.id?{...x,status:e.target.value}:x))}>{['New','In progress','Closed'].map(s=><option key={s}>{s}</option>)}</select></label><label>Private owner notes<textarea value={i.private_notes} onChange={e=>setInquiries(prev=>prev.map(x=>x.id===i.id?{...x,private_notes:e.target.value}:x))}/></label><button className="button" disabled={busy} onClick={()=>void run(async()=>{const r=await sandySupabase.from('inquiries').update({status:i.status,private_notes:i.private_notes}).eq('id',i.id);if(r.error)throw r.error;},'Inquiry updated.')}>Save inquiry</button></section>)}</>}
   {section==='events'&&<><form className="studio-panel editor-form" onSubmit={e=>void saveEvent(e)}><h2>New event draft</h2><label>Title<input value={newEvent.title} required onChange={e=>setNewEvent({...newEvent,title:e.target.value})}/></label><label>URL slug<input value={newEvent.slug} required onChange={e=>setNewEvent({...newEvent,slug:e.target.value})}/></label><label>Description<textarea value={newEvent.description} onChange={e=>setNewEvent({...newEvent,description:e.target.value})}/></label><button className="button" disabled={busy}>Create private draft</button></form>
    {events.map(e=><section className="studio-panel" key={e.id}><h3>{e.title}</h3><p>{e.published?'Published':'Draft'} · {e.description}</p><button className="button secondary" disabled={busy} onClick={()=>void run(async()=>{const r=await sandySupabase.from('events').update({published:!e.published}).eq('id',e.id);if(r.error)throw r.error;},'Event visibility saved.')}>{e.published?'Unpublish':'Publish event'}</button></section>)}
   </>}
   {section==='content'&&<form className="studio-panel editor-form" onSubmit={e=>void saveContent(e)}><h2>Website copy</h2><p>Changes update the live website copy without changing the approved photography or layout.</p>
    {Object.entries(contentLabels).map(([key,label])=><label key={key}>{label}<textarea rows={key==='heroIntro'?3:5} value={String(content.find(c=>c.key===key)?.value??'')} onChange={e=>setContent(rows=>rows.some(r=>r.key===key)?rows.map(r=>r.key===key?{...r,value:e.target.value}:r):[...rows,{key,value:e.target.value,published:true}])}/></label>)}
    <button className="button" disabled={busy}>Save website content</button>
   </form>}
   {section==='availability'&&availability&&<form className="studio-panel editor-form" onSubmit={e=>void saveAvailability(e)}>
    <h2>Availability & operations</h2>
    <p>Turning off a pause does not enable payment checkout. Payment acceptance remains separately disabled.</p>
    <label className="checkbox-label"><input type="checkbox" checked={availability.retail_paused} onChange={e=>setAvailability({...availability,retail_paused:e.target.checked})}/>Pause retail catalog ordering</label>
    <label className="checkbox-label"><input type="checkbox" checked={availability.culinary_paused} onChange={e=>setAvailability({...availability,culinary_paused:e.target.checked})}/>Pause culinary booking</label>
    <div className="form-grid"><label>Lead time (days)<input type="number" min="0" value={availability.lead_days} onChange={e=>setAvailability({...availability,lead_days:Number(e.target.value)})}/></label><label>Daily capacity<input type="number" min="0" value={availability.daily_capacity} onChange={e=>setAvailability({...availability,daily_capacity:Number(e.target.value)})}/></label></div>
    <label>Public availability message<textarea value={availability.message} onChange={e=>setAvailability({...availability,message:e.target.value})}/></label>
    <button className="button" disabled={busy}>Save availability</button>
   </form>}
   {section==='settings'&&<section className="studio-panel"><h2>Owner account</h2><p>Signed in as {OWNER_EMAIL}. Database access is restricted by verified email and administrator authorization.</p><p>Products, orders, inquiries and uploaded product photographs are stored in Supabase with Row Level Security.</p><button className="button secondary" type="button" onClick={()=>void signOut()}>Sign out</button></section>}
  </section>
 </div>;
}
