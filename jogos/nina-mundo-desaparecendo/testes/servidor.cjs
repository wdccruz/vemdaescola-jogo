'use strict';

const {createServer}=require('node:http');
const {readFile}=require('node:fs/promises');
const path=require('node:path');

const prefix='/vemdaescola-jogo/jogos/nina-mundo-desaparecendo/';
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.svg':'image/svg+xml','.woff2':'font/woff2','.webp':'image/webp'};

function server(){
  return createServer(async(req,res)=>{
    const {pathname}=new URL(req.url,'http://localhost');
    if(pathname==='/iframe.html') {
      res.writeHead(200,{'Content-Type':types['.html']});
      res.end(`<!doctype html><meta name="viewport" content="width=device-width"><iframe title="Nina" src="${prefix}" style="width:100%;height:88vh;border:0"></iframe>`);
      return;
    }
    if(!pathname.startsWith(prefix)){res.writeHead(404).end();return;}
    const relative=pathname.slice(prefix.length)||'index.html';
    const file=path.resolve(root,relative);
    const mime=types[path.extname(file)];
    if(!file.startsWith(root+path.sep)||!mime){res.writeHead(404).end();return;}
    try{
      const bytes=await readFile(file);
      res.writeHead(200,{'Content-Type':mime});
      res.end(bytes);
    } catch(error){
      res.writeHead(error.code==='ENOENT'?404:500).end();
    }
  });
}

if(require.main===module){
  const app=server();
  app.listen(Number(process.env.NINA_PORT||8766),'127.0.0.1',()=>{
    console.log('http://127.0.0.1:'+app.address().port+prefix);
  });
}

module.exports={server,prefix,root};

