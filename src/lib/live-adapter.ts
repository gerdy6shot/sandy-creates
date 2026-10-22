// Prepared adapter, not enabled by the shipped demo. RLS remains the authorization boundary.
import { createClient } from '@supabase/supabase-js';
export function createLiveClient(url:string,publishableKey:string){
 if(!/^https:\/\//.test(url)||!publishableKey)throw new Error('Live services are not configured.');
 return createClient(url,publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
}
export async function adminSignIn(client:ReturnType<typeof createLiveClient>,email:string,password:string){
 const {data,error}=await client.auth.signInWithPassword({email,password});
 if(error)throw error;
 // Authorization is checked by the server/database, never inferred from a successful login.
 const {data:authorized,error:permissionError}=await client.rpc('is_authorized_admin');
 if(permissionError || authorized !== true){await client.auth.signOut();throw new Error('Administrator access is not available.');}
 return data.session;
}
export async function submitLiveInquiry(payload:unknown,turnstileToken:string){
 const response=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({payload,turnstileToken})});
 const result=await response.json();
 if(!response.ok||!result.saved)throw new Error('Your inquiry was not saved. Please try again later.');
 return result as {saved:true;reference:string};
}
