export async function readJson(request:Request,max=16384):Promise<unknown>{
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw new Error('Expected JSON');
 const raw=await readText(request,max);return JSON.parse(raw);
}
export async function readText(request:Request,max:number):Promise<string>{
 if(Number(request.headers.get('content-length'))>max)throw new Error('Payload too large');
 const reader=request.body?.getReader();if(!reader)throw new Error('Empty request');let total=0;const chunks:Uint8Array[]=[];
 for(;;){const {value,done}=await reader.read();if(done)break;total+=value.length;if(total>max){await reader.cancel();throw new Error('Payload too large');}chunks.push(value);}
 const all=new Uint8Array(total);let offset=0;for(const chunk of chunks){all.set(chunk,offset);offset+=chunk.length;}return new TextDecoder().decode(all);
}
export async function hmacHex(secret:string,message:string){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const signature=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(message));return [...new Uint8Array(signature)].map(v=>v.toString(16).padStart(2,'0')).join('');}
export async function verifyStripe(raw:string,header:string,secret:string,now=Date.now()):Promise<boolean>{
 const parts=header.split(',');const timestamp=parts.find(p=>p.startsWith('t='))?.slice(2);const signatures=parts.filter(p=>p.startsWith('v1=')).map(p=>p.slice(3));
 if(!timestamp||!/^\d+$/.test(timestamp)||Math.abs(now/1000-Number(timestamp))>300)return false;
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);
 for(const signature of signatures){if(!/^[0-9a-f]{64}$/i.test(signature))continue;const bytes=new Uint8Array(signature.match(/../g)!.map(s=>parseInt(s,16)));if(await crypto.subtle.verify('HMAC',key,bytes,new TextEncoder().encode(`${timestamp}.${raw}`)))return true;}return false;
}
export function response(body:unknown,status=200){return Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
