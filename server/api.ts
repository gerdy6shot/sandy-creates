// Prepared Cloudflare Pages Functions API. Not included in the static Sites demo.
import { createClient } from '@supabase/supabase-js';
import { emptyInquiry, validateInquiry, type InquiryInput } from '../src/lib/validation.ts';
import { hmacHex, readJson, readText, response, verifyStripe } from './security.ts';
export type ServerConfig={SUPABASE_URL?:string;SUPABASE_SERVICE_ROLE_KEY?:string;APP_ORIGIN?:string;TURNSTILE_SECRET_KEY?:string;TURNSTILE_HOSTNAME?:string;RATE_LIMIT_SALT?:string;STRIPE_SECRET_KEY?:string;STRIPE_WEBHOOK_SECRET?:string;RESEND_API_KEY?:string;EMAIL_FROM?:string;ADMIN_EMAIL?:string;LIVE_INQUIRIES?:string;LIVE_CHECKOUT?:string;RETAIL_OPERATIONS_APPROVED?:string};
function db(env:ServerConfig){if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new Error('Database unavailable');return createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});}
function emailEnabled(env:ServerConfig){return !!(env.RESEND_API_KEY&&env.EMAIL_FROM&&env.ADMIN_EMAIL);}
async function verifyAbuse(request:Request,env:ServerConfig,client:ReturnType<typeof db>,token:unknown){
 if(!env.TURNSTILE_SECRET_KEY||!env.RATE_LIMIT_SALT||!env.TURNSTILE_HOSTNAME||typeof token!=='string'||token.length>2048)throw new Error('Spam protection unavailable');
 const ip=request.headers.get('CF-Connecting-IP');if(!ip)throw new Error('Request origin unavailable');
 const key=await hmacHex(env.RATE_LIMIT_SALT,ip);const {data:allowed,error}=await client.rpc('consume_rate_limit',{p_key:key});if(error||!allowed)throw new Error('Please try again later');
 const result=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET_KEY,response:token,remoteip:ip}),signal:AbortSignal.timeout(10000)});
 const check=await result.json() as {success?:boolean;hostname?:string;action?:string};
 if(!check.success||check.hostname!==env.TURNSTILE_HOSTNAME||check.action!=='inquiry')throw new Error('Verification failed');
}
function cleanInquiry(raw:unknown):InquiryInput{
 if(!raw||typeof raw!=='object')throw new Error('Invalid inquiry');const result={...emptyInquiry};
 for(const key of ['name','email','phone','category','message','orderReference','eventDate','guests','website'] as const){const value=(raw as Record<string,unknown>)[key];if(value!==undefined&&typeof value!=='string')throw new Error('Invalid field');result[key]=typeof value==='string'?value:'';}
 result.marketing=(raw as Record<string,unknown>).marketing===true;
 if(result.website||Object.keys(validateInquiry(result)).length)throw new Error('Invalid inquiry');return result;
}
export async function handleApi(request:Request,env:ServerConfig):Promise<Response>{
 const url=new URL(request.url);const path=url.pathname;
 if(path==='/api/status')return response({mode:'unconfigured',inquiries:env.LIVE_INQUIRIES==='true',checkout:false});
 if(path==='/api/stripe/webhook'){
  if(!env.STRIPE_WEBHOOK_SECRET||!env.STRIPE_SECRET_KEY)return response({error:'Payments unconfigured'},503);
  if(request.method!=='POST')return response({error:'Method not allowed'},405);
  try{const raw=await readText(request,262144);if(!await verifyStripe(raw,request.headers.get('stripe-signature')??'',env.STRIPE_WEBHOOK_SECRET))return response({error:'Invalid signature'},400);
   const event=JSON.parse(raw) as {id:string;type:string;data:{object:{id:string;payment_status:string;metadata?:{order_id?:string};amount_total:number;currency:string}}};
   if(event.type!=='checkout.session.completed')return response({received:true,ignored:true});const session=event.data.object;
   if(session.payment_status!=='paid'||!session.metadata?.order_id)return response({received:true,ignored:true});
   const {data,error}=await db(env).rpc('finalize_payment',{p_event:event.id,p_order:session.metadata.order_id,p_session:session.id,p_amount:session.amount_total,p_currency:session.currency,p_email_enabled:emailEnabled(env)});
   if(error)return response({error:'Payment record could not be updated'},500);return response({received:true,result:data});
  }catch{return response({error:'Webhook could not be processed'},400);}
 }
 if(!env.APP_ORIGIN||request.headers.get('origin')!==env.APP_ORIGIN)return response({error:'Origin not allowed'},403);
 if(request.method!=='POST')return response({error:'Method not allowed'},405);
 if(path==='/api/inquiries'){
  if(env.LIVE_INQUIRIES!=='true')return response({saved:false,error:'Inquiries are not configured'},503);
  try{const body=await readJson(request) as {payload?:unknown;turnstileToken?:unknown};const payload=cleanInquiry(body.payload);const client=db(env);await verifyAbuse(request,env,client,body.turnstileToken);
   const {data,error}=await client.rpc('save_inquiry',{p_data:payload,p_email_enabled:emailEnabled(env)});if(error||typeof data!=='string')return response({saved:false,error:'Inquiry was not saved'},503);
   return response({saved:true,reference:data},201);
  }catch{return response({saved:false,error:'Check your details and verification, or try again later'},400);}
 }
 if(path==='/api/checkout'){
  // Live checkout also requires approved shipping/pickup, tax, returns and contact rules.
  // Disabled even with credentials until the missing operating rules are implemented and tested.
  return response({error:'Retail checkout is not enabled. Operating rules and staged acceptance tests are required.'},503);
 }
 if(path==='/api/order-status')return response({error:'Live order lookup is not enabled.'},503);
 return response({error:'Not found'},404);
}
// Server-side draft helper; deliberately unreachable from /api/checkout until operating rules exist.
export async function createStripeSession(env:ServerConfig,order:{id:string;items:{name:string;size:string;price:number;quantity:number}[]},email:string){
 if(env.LIVE_CHECKOUT!=='true'||env.RETAIL_OPERATIONS_APPROVED!=='true'||!env.STRIPE_SECRET_KEY||!env.APP_ORIGIN)throw new Error('Checkout unavailable');
 const body=new URLSearchParams({mode:'payment','payment_method_types[0]':'card',customer_email:email,client_reference_id:order.id,'metadata[order_id]':order.id,success_url:env.APP_ORIGIN+'/checkout/success?session_id={CHECKOUT_SESSION_ID}',cancel_url:env.APP_ORIGIN+'/checkout/cancel',expires_at:String(Math.floor(Date.now()/1000)+1800)});
 order.items.forEach((item,i)=>{body.set(`line_items[${i}][price_data][currency]`,'usd');body.set(`line_items[${i}][price_data][product_data][name]`,`${item.name} — ${item.size}`);body.set(`line_items[${i}][price_data][unit_amount]`,String(item.price));body.set(`line_items[${i}][quantity]`,String(item.quantity));});
 const result=await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{Authorization:`Bearer ${env.STRIPE_SECRET_KEY}`,'Content-Type':'application/x-www-form-urlencoded','Idempotency-Key':`checkout-${order.id}`},body,signal:AbortSignal.timeout(15000)});
 if(!result.ok)throw new Error('Payment provider unavailable');return result.json() as Promise<{id:string;url:string}>;
}
export async function runMaintenance(env:ServerConfig){const client=db(env);const {error}=await client.rpc('release_expired_reservations');if(error)throw new Error('Reservation cleanup failed');if(!emailEnabled(env))return;
 for(let count=0;count<10;count++){
  const {data:jobs,error:claimError}=await client.rpc('claim_notification');if(claimError)throw new Error('Notification claim failed');const job=jobs?.[0];if(!job)return;
  try{
   const isInquiry=!!job.inquiry_id;const {data:record,error:readError}=await client.from(isInquiry?'inquiries':'orders').select('*').eq('id',isInquiry?job.inquiry_id:job.order_id).single();if(readError||!record)throw new Error('Record unavailable');
   const recipient=job.kind.endsWith('_admin')?env.ADMIN_EMAIL:(isInquiry?record.email:record.customer_email);if(!recipient)throw new Error('Recipient unavailable');
   const subject=isInquiry?'Sandy Creates inquiry received':'Sandy Creates order update';const text=isInquiry?`Inquiry reference: ${record.id}. ${job.kind.endsWith('_admin')?'Review the protected admin workspace.':'Your inquiry was saved for review. No response time is promised.'}`:`Order reference: ${record.id}. Payment: ${record.payment_status}. Fulfillment: ${record.fulfillment_status}. Payment and fulfillment are separate.`;
   const result=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':job.id},body:JSON.stringify({from:env.EMAIL_FROM,to:[recipient],subject,text}),signal:AbortSignal.timeout(10000)});
   if(!result.ok)throw new Error('Email provider did not accept notification');
   const {error:saveError}=await client.from('notification_jobs').update({status:'sent',last_error:null,locked_until:null}).eq('id',job.id);if(saveError)throw new Error('Notification acceptance could not be recorded');
  }catch{await client.from('notification_jobs').update({status:'failed',last_error:'Notification was not confirmed. Review provider and retry.',locked_until:null}).eq('id',job.id);}
 }
}
