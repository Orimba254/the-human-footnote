import crypto from 'node:crypto';import {cookies} from 'next/headers';
const secret=process.env.SESSION_SECRET||'';const user=process.env.ADMIN_EMAIL||'';const pass=process.env.ADMIN_PASSWORD||'';
export function configured(){return Boolean(secret.length>=32&&user&&pass.length>=12)}
function mac(s:string){return crypto.createHmac('sha256',secret).update(s).digest('hex')}
export function validate(email:string,password:string){if(!configured())return false;const a=crypto.createHash('sha256').update(email.trim().toLowerCase()).digest();const b=crypto.createHash('sha256').update(user.trim().toLowerCase()).digest();const x=crypto.createHash('sha256').update(password).digest();const y=crypto.createHash('sha256').update(pass).digest();return crypto.timingSafeEqual(a,b)&&crypto.timingSafeEqual(x,y)}
export async function login(){const jar=await cookies();const payload=`${Date.now()+1000*60*60*12}:${crypto.randomBytes(16).toString('hex')}`;jar.set('hf_session',`${payload}.${mac(payload)}`,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*12});}
export async function authenticated(){if(!configured())return false;const raw=(await cookies()).get('hf_session')?.value||'';const i=raw.lastIndexOf('.');if(i<0)return false;const data=raw.slice(0,i),sig=raw.slice(i+1);if(sig.length!==64||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(mac(data))))return false;const until=Number(data.split(':')[0]);return Number.isFinite(until)&&until>Date.now();}
export async function logout(){(await cookies()).delete('hf_session')}
