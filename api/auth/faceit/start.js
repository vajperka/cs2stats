const crypto=require('node:crypto');
module.exports=(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET')return res.status(405).end();
 const {FACEIT_CLIENT_ID:id,FACEIT_REDIRECT_URI:redirect}=process.env;
 if(!id||!redirect)return res.status(503).send('Chybí FACEIT_CLIENT_ID nebo FACEIT_REDIRECT_URI');
 const state=crypto.randomBytes(32).toString('base64url'), verifier=crypto.randomBytes(48).toString('base64url');
 const challenge=crypto.createHash('sha256').update(verifier).digest('base64url');
 res.setHeader('Set-Cookie',`faceit_test=${state}.${verifier}; Path=/api/auth/faceit; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
 const url=new URL('https://accounts.faceit.com/accounts');
 url.search=new URLSearchParams({client_id:id,redirect_uri:redirect,response_type:'code',scope:'openid',state,code_challenge:challenge,code_challenge_method:'S256'}).toString();
 res.redirect(302,url.toString());
};
