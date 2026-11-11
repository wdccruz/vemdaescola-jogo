'use strict';

const SceneArt=(()=>{
  const assets=new Map(),paths=new Map();
  const paper='#ffe8b5',ink='#243743',gold='#ffd68d';
  const rand=i=>{const x=Math.sin(i*127.1+31.7)*43758.54;return x-Math.floor(x);};
  function load(id){
    if(!assets.has(id)){
      const image=new Image();image.src='./assets/'+id+'.webp';assets.set(id,image);
    }
    return assets.get(id);
  }
  function shape(g,d,fill,stroke,width=1){
    if(!paths.has(d))paths.set(d,new Path2D(d));
    const p=paths.get(d);
    if(fill){g.fillStyle=fill;g.fill(p);}
    if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke(p);}
  }
  function oval(g,x,y,rx,ry,fill,stroke,width=1){
    g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);
    if(fill){g.fillStyle=fill;g.fill();}
    if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke();}
  }
  function line(g,points,color,width=1){
    g.beginPath();g.moveTo(...points[0]);for(let i=1;i<points.length;i++)g.lineTo(...points[i]);
    g.strokeStyle=color;g.lineWidth=width;g.lineJoin='round';g.lineCap='round';g.stroke();
  }
  function rect(g,x,y,w,h,r,fill,stroke,width=1){
    g.beginPath();g.roundRect(x,y,w,h,r);
    if(fill){g.fillStyle=fill;g.fill();}
    if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke();}
  }
  function text(g,value,x,y,size=17,color=paper,align='center'){
    g.font='800 '+size+'px Baloo, system-ui, sans-serif';g.textAlign=align;g.textBaseline='middle';
    g.fillStyle=color;g.fillText(value,x,y);
  }
  function star(g,x,y,r,color){
    g.beginPath();g.moveTo(x,y-r);g.quadraticCurveTo(x+1,y-1,x+r,y);g.quadraticCurveTo(x+1,y+1,x,y+r);
    g.quadraticCurveTo(x-1,y+1,x-r,y);g.quadraticCurveTo(x-1,y-1,x,y-r);g.fillStyle=color;g.fill();
  }
  const seen=(x,y,c,p=170)=>x>c.x-p&&x<c.x+c.w+p&&y>c.y-p&&y<c.y+c.h+p;

  function mila(g,p,t,cheer,carrying,climb){
    const y=p.y+p.h;
    const run=p.on?Math.min(Math.abs(p.vx)/240,1):0;
    const swing=climb?Math.sin(t*10)*5:Math.sin(p.stride)*run*11;
    g.save();g.translate(p.x+p.w/2,y);
    if(p.on)oval(g,0,2,20,4,'#0e273963');
    g.scale(p.face*1.2,1.2);
    g.translate(0,-run*Math.abs(Math.sin(p.stride))*2+p.land*24);
    const step=(x,s,dark)=>{
      const fy=p.on?-3-Math.max(0,s)*.2:climb?-10:-7;
      line(g,[[x,-26],[x+s*.52+(p.on?0:4),-13],[x+s,fy]],'#473746',8);
      line(g,[[x,-26],[x+s*.52+(p.on?0:4),-13],[x+s,fy]],dark?'#8d5051':'#b65e51',5.4);
      g.save();g.translate(x+s,fy);
      shape(g,'M-4-4q5-3 8 0l5 4v4H-4Z',dark?'#7e5945':'#a97650','#4c3e49',1.15);
      line(g,[[-3,3],[7,3]],'#f0b977',1.2);g.restore();
    };
    step(-4,swing,false);step(5,-swing,true);
    shape(g,'M-13-46q-15-4-16 10v15q8 9 17 0l8-20Z','#d6a65b','#463b49',1.7);
    shape(g,'M-27-32q7 3 13 2l-2 10q-8 4-11-1Z','#eec581','#74554f',1.1);
    oval(g,-20,-25,1.6,1.6,gold);
    shape(g,'M-13-43q10-7 20-3 8 3 8 11l-4 14q-13 5-25-1Z','#4e9b91','#403b4b',1.5);
    shape(g,'M-12-36q8 4 20 0l3 13q-10 6-24 1Z','#b85e50','#5f414b',1.1);
    line(g,[[-9,-41],[-6,-29]],'#e2b378',2.8);
    oval(g,-6,-29,1.55,1.55,'#ffe1a3');
    const hand=carrying?[27,-36]:cheer?[17,-52]:[11+swing*.64,-25];
    line(g,[[8,-40],[15,-32],hand],'#433846',8.2);
    line(g,[[8,-40],[15,-32],hand],'#67b2a1',5.7);
    oval(g,...hand,3.7,3.6,'#a6654f','#5f3d45',1.15);
    shape(g,'M-4-50v10q5 3 8-2v-9Z','#a96a52','#513841',1);
    shape(g,'M-16-59q-6-8 3-15-3-9 5-11 5-8 14-3 9-4 13 4 8 5 3 12 2 8-6 11Z','#302735','#442d3d',1.35);
    shape(g,'M-13-75q3-7 9-7m3-4q5-2 8 0m5 4q4 1 5 6','','#6a4856',1.45);
    shape(g,'M-15-64q13-7 29-3l3 5q-14-4-31 4Z','#66b2a5','#335d62',1.2);
    oval(g,-10,-53,4.5,4.8,'#9a5c4a','#503645',1);
    oval(g,-10,-50,1.8,1.8,gold);
    shape(g,'M-12-58q8-11 20-4l8 5q4 7-2 15-7 6-15 3-10-2-11-19Z','#ad6b52','#4b3543',1.3);
    shape(g,'M-13-58q-5-6 3-11 9-6 21 1l4 6q-12 3-17-1-4 6-11 5Z','#352938');
    const blink=t%4.9>4.78;
    oval(g,1,-53,1.65,blink?.55:2.35,'#2d2637');
    oval(g,11,-53,1.55,blink?.55:2.25,'#2d2637');
    if(!blink){oval(g,1.5,-54,.52,.62,'#fff2bf');oval(g,11.4,-54,.5,.6,'#fff2bf');}
    shape(g,'M5-52l3 5-4 1','', '#754746',.9);
    oval(g,-2,-47,2.75,1.45,'#c17d64');
    shape(g,cheer?'M2-43q5 1 9-2-1 8-7 6Z':'M3-43q4 3 8-1',cheer?'#673b46':'','#663942',1.1);
    g.restore();
  }
  function tuca(g,t,clock,reduced){
    const bob=reduced?0:Math.sin(clock*(t.mode==='cheer'?15:8))*Math.min(5,Math.abs(t.vx)*.027+1);
    g.save();g.translate(t.x,t.y+bob);
    g.scale(t.vx < -28 ? -1 : 1,1);
    oval(g,0,1,22,4,'#0b263c62');
    shape(g,'M-23-6q-5-9 0-21 7-11 23-11 18-2 23 10l6 14q-5 13-27 10Z','#b27e50','#503d48',1.6);
    shape(g,'M-21-22q1-11 19-12 12-1 17 6-20-1-36 6Z','#e2ae70');
    shape(g,'M-14-6v7h-8l1-7m24 1v6h9l-2-8','#735645','#493a46',1.1);
    oval(g,-5,-19,8.5,8.5,'#996c56','#f2c07b',1.4);
    star(g,-5,-19,5,t.mode==='cheer'?'#ffdb8e':'#8fd8bd');
    shape(g,'M8-31q-1-12 6-12 5 0 6 7 11 0 16 8l2 12q-3 8-17 5l-9-6Z','#d4a16c','#62464a',1.45);
    oval(g,23,-27,1.7,2.4,'#423343');oval(g,23.6,-28,.55,.75,'#fff0bb');
    oval(g,34,-19,2.1,1.35,'#644349');
    shape(g,'M25-16q4 3 9 0','', '#6c4649',1.25);
    g.restore();
  }

  function scenery(g,w,c,t,reduced){
    const l=w.level,[deep,teal]=l.theme;
    g.fillStyle=deep;g.fillRect(0,0,c.w,c.h);
    const im=load(l.id);
    if(im.complete&&im.naturalWidth){
      const ratio=im.naturalWidth/im.naturalHeight;
      const iw=Math.max(c.w*1.24,c.h*ratio),ih=iw/ratio;
      g.drawImage(im,-(iw-c.w)*(.08+.82*c.x/Math.max(1,l.width-c.w)),-(ih-c.h)*(.2+.57*c.y/Math.max(1,l.height-c.h)),iw,ih);
    }
    const haze=g.createLinearGradient(0,0,0,c.h);
    haze.addColorStop(0,'#1231420d');haze.addColorStop(.62,deep+'20');haze.addColorStop(1,deep+'cf');
    g.fillStyle=haze;g.fillRect(0,0,c.w,c.h);
    for(let i=0;i<34;i++){
      const x=(rand(i*3)*c.w-c.x*.13+c.w*6)%c.w,y=(rand(i*3+2)*c.h+Math.sin(t*.5+i)*9+c.h)%c.h;
      if(i%7===0)star(g,x,y,2.5,'#ffebb080');else oval(g,x,y,1+rand(i)*1.5,1,teal+'88');
    }
    if(!reduced&&w.fade){g.fillStyle='rgba(255,223,158,'+w.fade*.38+')';g.fillRect(0,0,c.w,c.h);}
  }

  function surface(g,s,l){
    const [dark,middle,edge]=l.theme,{x,y,w,h,style}=s;
    g.save();g.translate(x,y);
    const root=l.material==='wood', stone=l.material==='stone'||l.material==='star';
    if(style==='gate'){
      const fill=g.createLinearGradient(0,0,w,0);fill.addColorStop(0,dark);fill.addColorStop(.5,middle);fill.addColorStop(1,dark);
      rect(g,1,0,w-2,h,5,fill,edge,2);
      for(let yy=18;yy<h;yy+=29){line(g,[[3,yy],[w-3,yy]],paper+'65',1);oval(g,w*.5,yy-6,3,3,edge,gold,.6);}
      g.restore();return;
    }
    const active=style==='bridge'||style==='lift';
    const fill=g.createLinearGradient(0,0,0,h);
    fill.addColorStop(0,active?edge:middle);fill.addColorStop(1,dark);
    if(style==='bridge'){
      for(let i=0;i<3;i++){
        const left=i*w/3,right=(i+1)*w/3,mid=(left+right)/2;
        g.beginPath();g.moveTo(left,7);g.lineTo(left,root?43:63);
        g.quadraticCurveTo(mid,root?-6:0,right,root?43:63);g.lineTo(right,7);g.closePath();
        g.fillStyle=edge;g.fill();g.strokeStyle=dark;g.lineWidth=2;g.stroke();
        if(root)for(let j=1;j<5;j++)oval(g,left+j*(right-left)/5,28+(j%2)*8,6,3,'#adc68ba1');
      }
    }
    g.beginPath();g.moveTo(0,0);g.lineTo(w,0);g.lineTo(w-2,h-7);
    for(let i=Math.floor(w/24);i>0;i--)g.lineTo(i*24,h-4-rand(i+x)*11);
    g.lineTo(3,h-3);g.closePath();
    g.fillStyle=fill;g.fill();g.strokeStyle=dark;g.lineWidth=2;g.stroke();g.save();g.clip();
    for(let i=0;i<w/28;i++){
      const xx=i*28,yy=9+rand(i+x)*Math.min(h*.7,44);
      if(root)line(g,[[xx,8],[xx+14,11],[xx+32,5]],'#c0ce9e75',1.55);
      else if(stone)line(g,[[xx,4],[xx+4,16],[xx+22,16]],'#f8c99f75',1.3);
      else {
        line(g,[[xx,3],[xx+6,Math.min(19,h)]],dark+'bb',1.4);
        oval(g,xx+12,9,1.6,1.5,'#f8d898');
      }
      if(style==='ground'){
        line(g,[[xx,yy+17],[xx+10,yy+13],[xx+20,yy+15]],'#f2d59d34',1.15);
        if(i%3===1)oval(g,xx,yy+45,10,2.2,'#eee0a425');
      }
    }
    if(style==='ground'){
      for(let row=0;row<4;row++){
        const yy=22+row*31;
        const seam=root?'#253e4275':'#192f4590';
        for(let x=-26+row%2*33;x<w;x+=64){
          line(g,[[x,yy],[x+26,yy+2],[x+62,yy]],seam,1.6);
          line(g,[[x+15,yy+1],[x+13,yy+27]],seam,1.25);
          if((row+Math.round(x))%3===0)line(g,[[x+29,yy+6],[x+43,yy+5]],paper+'30',1.1);
        }
      }
    }
    g.restore();
    line(g,[[1,1.5],[w-1,1.5]],active?gold:root?'#abc898':l.color,style==='ground'?4.5:3.1);
    if(style==='ground'&&root)for(let i=1;i<w/37;i++){
      const xx=i*37;if(rand(i+x)>.42)line(g,[[xx,0],[xx-5,-7],[xx,0],[xx+6,-10]],'#b4c387',1.45);
    }
    if(style==='bridge'&&root)for(let i=1;i<w/26;i++){
      const xx=i*26;line(g,[[xx,5],[xx+8,17],[xx+17,6]],'#a5bf82',2);
    }
    if(style==='lift'){
      oval(g,w/2,h+3,7,5,edge,gold,1);star(g,w/2,8,4,'#fff2c5');
      line(g,[[6,-2],[18,-16],[w-18,-16],[w-6,-2]],edge,2.2);
    }
    g.restore();
  }

  function gear(g,x,y,r,t,color){
    g.save();g.translate(x,y);g.rotate(t);
    g.beginPath();
    for(let i=0;i<48;i++){
      const a=i*Math.PI/24,s=i%4<2?r:r*.81;
      const px=Math.cos(a)*s,py=Math.sin(a)*s;
      if(!i)g.moveTo(px,py);else g.lineTo(px,py);
    }
    g.closePath();g.fillStyle=color;g.fill();g.strokeStyle='#654b57';g.lineWidth=1.6;g.stroke();
    oval(g,0,0,r*.49,r*.49,'#284953','#e1bc83',1.5);
    for(let i=0;i<5;i++){
      const a=i*Math.PI*.4;line(g,[[0,0],[Math.cos(a)*r*.48,Math.sin(a)*r*.48]],'#dfb57e',2);
    }
    oval(g,0,0,r*.13,r*.13,'#fff0c0');g.restore();
  }

  function arch(g,x,y,w,h,fill,edge){
    g.beginPath();g.moveTo(x-w/2,y);g.lineTo(x-w/2,y-h+w/2);
    g.quadraticCurveTo(x-w/2,y-h,x,y-h);g.quadraticCurveTo(x+w/2,y-h,x+w/2,y-h+w/2);
    g.lineTo(x+w/2,y);g.closePath();g.fillStyle=fill;g.fill();g.strokeStyle=edge;g.lineWidth=2;g.stroke();
  }

  function decor(g,w,c,t,profile){
    const l=w.level,y=l.ground;
    if(w.index<0){
      for(const [i,x] of l.portals.entries()){
        if(!seen(x,y,c))continue;
        const active=i<=profile.lenses.length, color=Worlds[i].color;
        arch(g,x,y,108,153,'#263b50',color+'b3');
        const grd=g.createLinearGradient(x,y-120,x,y);grd.addColorStop(0,active?color:'#5d6e7d');grd.addColorStop(1,'#263b54');
        arch(g,x,y-6,80,126,grd,active?paper:'#87958d');
        star(g,x,y-82,active?18:9,active?paper:'#c8c8a9');
        for(let k=0;k<3;k++)oval(g,x-45+k*45,y-129,3,3,active?color:'#75928e');
        rect(g,x-61,y-37,122,25,7,'#183345f5',color,1);
        text(g,Worlds[i].short,x,y-24,15);
      }
      const x=l.beacon;
      if(seen(x,y-100,c,240)){
        g.save();g.translate(x,y);
        shape(g,'M-46 0-32-214H32L46 0Z','#ead6a9','#795c59',2);
        shape(g,'M-39-50h78l-3-22h-72zm4-75h71l-3-19h-65zm2-61h66l-2-21h-62Z','#b26f61');
        arch(g,0,-5,35,60,'#43565e','#a57c60');
        rect(g,-36,-256,72,45,8,'#455866','#d8a471',3);
        const lit=profile.lenses.length;
        rect(g,-29,-249,58,32,5,lit?'#e4b77c':'#607682',gold,1.6);
        shape(g,'M-41-257 0-284l41 27Z','#a16960','#fae0a6',1.8);
        for(let i=0;i<5;i++)oval(g,-28+i*14,-193,5,7,i<lit?Worlds[i].color:'#7d7777',paper,.85);
        if(lit){
          g.save();g.translate(0,-232);g.rotate(Math.sin(t*.6)*.09);
          const beam=g.createLinearGradient(0,0,310,0);beam.addColorStop(0,'#ffe9a7c4');beam.addColorStop(1,'#ffe9a700');
          shape(g,'M0-10 310-94V94L0 10Z',beam);star(g,0,0,8+lit*2,'#fff1be');g.restore();
        }
        g.restore();
      }
      return;
    }
    for(const [i,s] of l.sections.entries()){
      const x=s.x;
      if(!seen(x+160,y-115,c,470))continue;
      if(i===1){
        g.save();g.globalAlpha=.66;
        if(l.material==='wood'){
          arch(g,x+282,y,520,278,'#273f47b7','#9caf8b');
          for(let j=0;j<6;j++)line(g,[[x+54+j*83,y-175],[x+71+j*83,y-200],[x+84+j*83,y-208]],'#aac59a65',2);
        }else{
          arch(g,x+282,y,540,277,l.theme[0]+'aa',l.theme[2]);
          for(let j=0;j<5;j++)arch(g,x+65+j*110,y-8,75,171,l.theme[1]+'29',l.color+'63');
        }
        g.restore();
      }
      if(l.material==='brass'||l.material==='mill'){
        gear(g,x+97,y-112,43,w.state.solved[i]?t*.62:0,l.theme[2]);
        gear(g,x+151,y-82,23,w.state.solved[i]?-t:0,l.color);
        for(let j=0;j<10;j++)line(g,[[x+26+j*15,y-5],[x+30+j*15,y-1]],'#ead29b91',1.5);
        if(l.material==='mill'&&i===0){
          line(g,[[x+416,y],[x+418,y-185],[x+649,y-185],[x+656,y]],'#9e785c',3);
          for(let j=0;j<8;j++){
            g.save();g.translate(x+420+j*29,y-183);
            shape(g,'M0 0h29l8 20q-14 17-32 3Z',j%2?'#cb7a6a':'#f3d28f','#916d5e',.9);g.restore();
          }
        }
        if(l.material==='mill'&&i===1){
          gear(g,x+491,y-78,58,w.state.solved[i]?t*.55:0,'#bd8c69');
          line(g,[[x+419,y-54],[x+558,y-54],[x+582,y-6]],'#74c5c7a0',7);
        }
      }else if(l.material==='stone'){
        for(let j=0;j<5;j++){
          g.save();g.translate(x+50+j*19,y);g.rotate((j-2)*.16);
          shape(g,'M-9 0v-33l9-20 9 20v33Z',j%2?'#c486b69c':'#a8acd9ab',paper+'88',1.1);g.restore();
        }
      }else if(l.material==='wood'){
        for(let j=0;j<5;j++){
          const cx=x+72+j*16,cy=y-132-rand(j+i)*35;
          line(g,[[cx-8,cy-57],[cx,cy]],'#779884',2);
          oval(g,cx,cy,8,11,'#f2bc83b1',l.color,.8);
        }
      }else{
        g.save();g.translate(x+95,y-50);g.rotate(-.46+Math.sin(t*.5)*.055);
        rect(g,-39,-11,87,21,5,'#6e7296','#e8ba96',2);
        oval(g,46,0,7,14,'#a7c0ef',paper,1.2);g.restore();
        line(g,[[x+76,y],[x+96,y-39],[x+119,y]],'#d6a788',3);
      }
    }
    if(seen(1550,y,c,350)){
      const water=g.createLinearGradient(0,y,0,y+169);
      water.addColorStop(0,l.material==='wood'?'#8fd5c56e':'#82c8d477');water.addColorStop(1,l.theme[0]+'a4');
      g.fillStyle=water;g.fillRect(1410,y+6,312,170);
      for(let j=0;j<21;j++){
        const x=1418+(j*31+t*13)%295,yy=y+13+(j*23)%145;
        line(g,[[x,yy],[x+12+rand(j)*19,yy]],'#c0e8d66b',1.3);
      }
      if(l.material==='wood')for(let j=0;j<7;j++)line(g,[[1500+j*5,y-150],[1503+j*5,y+58+Math.sin(t+j)*9]],'#8bd5cf67',2.3);
    }
    const ladder=l.ladder;
    if(ladder&&seen(ladder.x,y,c,300)){
      line(g,[[ladder.x-17,y],[ladder.x-17,ladder.y]],'#b38a68',4);
      line(g,[[ladder.x+17,y],[ladder.x+17,ladder.y]],'#d6b17c',4);
      for(let yy=ladder.y+8;yy<y;yy+=16)line(g,[[ladder.x-16,yy],[ladder.x+16,yy]],'#dfb982',2.7);
    }
    for(const cp of l.checkpoints)if(seen(cp.x,cp.y,c)){
      line(g,[[cp.x,cp.y],[cp.x,cp.y-65]],paper,2.5);
      g.save();g.translate(cp.x,cp.y-64);
      shape(g,'M0 0q14 3 29-1l-7 9 7 10Q14 22 0 17Z',w.state.checkpoint>=cp.x?gold:'#9aaeb0','#6d5660',1.2);
      star(g,11,9,4,paper);g.restore();
    }
  }

  function glyph(g,item,x,y,scale=1,turned=false){
    g.save();g.translate(x,y);g.scale(scale,scale);
    const value=item.value;
    if(item.icon==='solid'){
      if(value==='cube')shape(g,'M-13-7 0-15 13-7V9L0 16-13 9Z','#d49fa6',paper,1.3);
      if(value==='cube')line(g,[[-13,-7],[0,0],[13,-7],[0,0],[0,16]],'#674d68',1);
      if(value==='cone')shape(g,'M-15 9 0-15 15 9q-15 14-30 0Z','#d8a57f',paper,1.3);
      if(value==='cylinder'){
        rect(g,-13,-9,26,20,4,'#81b8ae',paper,1.2);oval(g,0,-9,13,5,'#b3d6b8',paper,1.2);
      }
      if(value==='sphere')oval(g,0,0,13,13,'#a8a5d5',paper,1.2);
    }else if(item.icon==='net'){
      if(value==='cube')for(const [a,b] of [[0,0],[-1,0],[1,0],[2,0],[0,-1],[0,1]])rect(g,a*7-5,b*7-4,7,7,0,'#e4ae9e',paper,.7);
      else if(value==='cylinder'){
        rect(g,-12,-5,24,10,0,'#a6c5b2',paper,.8);oval(g,-5,-10,5,5,'#a6c5b2',paper,.8);oval(g,5,10,5,5,'#a6c5b2',paper,.8);
      } else shape(g,'M-6-6 0-15 6-6 15 0 6 6 0 15-6 6-15 0ZM-6-6H6V6H-6Z','#d29db6',paper,.8);
    }else if(item.icon==='outline'){
      if(turned&&value.endsWith('A'))g.rotate(Math.PI/2);
      const forms={triA:'M-15 10 0-11 15 10Z',triB:'M-9 10 0-15 9 10Z',rectA:'M-14-7h28v14h-28Z',rectB:'M-18-10h36v20h-36Z'};
      shape(g,forms[value],turned?'#d296a2':'#8d7a9e',paper,1.25);
    }else if(item.icon==='orb'){
      const color={azul:'#89c3e7',rosa:'#edabc2',ouro:'#f8ce79',verde:'#94cfad'}[value];
      oval(g,0,0,12,12,color,paper,1.3);oval(g,-4,-4,3,2,'#fff4cd');
    }else if(item.icon==='dots'){
      for(let i=0;i<value;i++)oval(g,(i%4-1.5)*7,(Math.floor(i/4)-.5)*8,2.6,2.6,gold);
    }else if(item.icon==='plank'){
      rect(g,-value*3,-4,value*6,9,2,'#d69a6c',paper,.9);
    }else if(item.icon==='base'){
      const count=value>=100?value/100:value>=10?value/10:value;
      const width=value>=100?8:value>=10?4:3;
      const height=value>=100?8:value>=10?12:3;
      for(let i=0;i<count;i++)rect(g,-17+i*(width+2),-height/2,width,height,1,'#dbbd83',paper,.55);
    }else text(g,item.label,0,1,item.label.length>4?13:21);
    g.restore();
  }

  function piece(g,item,x,y,active=false){
    g.save();g.translate(x,y);
    rect(g,-25,-28,50,33,6,active?'#52675e':'#294756',active?gold:'#dbc18a',1.45);
    const two=item.icon!=='number';
    glyph(g,item,0,two?-16:-12,two?.68:1,true);
    if(two)text(g,item.label,0,-1,item.label.length>14?7:10);
    g.restore();
  }

  function referenceObject(g,i,x,y){
    g.save();g.translate(x,y);
    if(i===0){
      rect(g,-13,-7,26,15,3,'#ad6b60',paper,1.1);oval(g,0,-7,13,4,'#e0bb88',paper,1);
      line(g,[[-10,-5],[-6,7],[0,-5],[6,7],[10,-5]],'#ffe0a4',.9);
    }else if(i===1){
      shape(g,'M-11 5-3-15l13 20Z','#a59bca',paper,1.1);oval(g,0,7,15,3,'#cda6b8',paper,1);
      star(g,-2,-1,3,gold);
    }else{
      rect(g,-10,-10,20,20,3,'#d8b5a7',paper,1.05);
      for(const [dx,dy] of [[-5,-5],[0,0],[5,5]])oval(g,dx,dy,1.7,1.7,ink);
    }
    g.restore();
  }

  function puzzleBoard(g,p,w,t){
    const done=w.state.solved[p.step];
    const slots=w.state.slots[p.id]??[],counts=w.state.counts[p.id]??[];
    const width=91+(p.order.length-1)*(p.kind==='slots'?71:76);
    const center=p.x+(width-91)/2;
    const hasData=p.sequence||p.chart||p.clock||p.urn||p.log||p.rule==='sum';
    g.save();
    const panelY=p.y-(hasData?195:153);
    rect(g,center-width/2,panelY,width,hasData?101:65,13,'#183644f2',done?'#b6e1a4':w.level.color,1.6);
    text(g,p.title,center,panelY+17,18);
    if(p.sequence)text(g,p.sequence.map(x=>x??'□').join('  →  '),center,panelY+53,19,gold);
    else if(p.clock){
      const x=center-66,y=panelY+61;
      oval(g,x,y,23,23,'#ecdcaa','#bc916f',2);
      for(let i=0;i<12;i++){
        const a=i*Math.PI/6;oval(g,x+Math.sin(a)*18,y-Math.cos(a)*18,1.1,1.1,ink);
      }
      for(const [label,dx,dy] of [['12',0,-16],['3',16,0],['6',0,16],['9',-16,0]])text(g,label,x+dx,y+dy,7,ink);
      const hour=(p.clock.hour%12+p.clock.minute/60)*Math.PI/6,minute=p.clock.minute*Math.PI/30;
      line(g,[[x,y],[x+Math.sin(hour)*10,y-Math.cos(hour)*10]],ink,2.6);
      line(g,[[x,y],[x+Math.sin(minute)*15,y-Math.cos(minute)*15]],'#a46165',1.8);
      text(g,'Início à tarde → '+p.clock.end,center+31,y,13,gold);
    }else if(p.urn){
      let i=0;
      for(const [label,n] of p.urn)for(let j=0;j<n;j++){
        const value={Azul:'azul',Rosa:'rosa',Ouro:'ouro'}[label];
        glyph(g,{icon:'orb',value},center-62+i*15,panelY+53,.5);i++;
      }
    }else if(p.log){
      p.log.forEach((label,i)=>glyph(g,{icon:'orb',value:{Azul:'azul',Rosa:'rosa',Ouro:'ouro'}[label]},center-69+i*15,panelY+46,.5));
      text(g,'Cada círculo é um sinal.',center,panelY+75,13,gold);
    }else if(p.chart){
      const y=panelY+83;
      for(let i=0;i<=7;i++)line(g,[[center-78,y-i*7],[center+74,y-i*7]],'#accccb40',1);
      for(const [i,[name,count]] of p.chart.entries()){
        rect(g,center-59+i*53,y-count*7,24,count*7,3,['#f1c081','#a9d0b5','#a8b6df'][i],null);
        text(g,name,center-47+i*53,y+8,10);
      }
      text(g,'0',center-84,y,9);text(g,'6',center-84,y-42,9);
    }else if(p.rule==='sum'){
      const start=center-63,y=panelY+57;
      for(let i=0;i<=7;i++)line(g,[[start+i*18,y-8],[start+i*18,y+9]],gold,1.2);
      line(g,[[start,y-8],[start+126,y-8]],gold,1.2);
      text(g,'0',start,y+19,12);text(g,'7 m',start+126,y+19,12);
      let filled=0;
      slots.forEach((id,i)=>{
        if(id===null)return;
        const length=p.objects[id].value*18;
        rect(g,start+filled,y-4,length,9,2,i?'#c194b5':'#c58761',paper,.8);
        filled+=length;
      });
    }else if(p.kind==='cash')text(g,MathGame.brl(MathGame.cents(counts,p.denominations))+' de '+MathGame.brl(p.target),center,panelY+43,18,gold);
    else if(p.kind==='bins')text(g,(p.total-MathGame.sum(counts))+' de '+p.total+' peças por distribuir',center,panelY+43,17,gold);
    else text(g,p.id==='motor-decimal'?'Meta: 243':p.id==='ponte-grupos'?'24 rebites · 4 trechos iguais':p.id==='igualdade'?'12 em cada canal':'Leve as peças aos encaixes',center,panelY+43,16,gold);
    for(const f of p.fixtures){
      const hot=w.near?.p?.id===p.id&&w.near?.index===f.index&&w.near?.kind!=='object';
      const color=done?'#b2d6a1':hot?gold:w.level.color;
      const slot=p.kind==='slots';
      const count=counts[f.index]??0;
      line(g,[[f.x,p.y-3],[f.x,p.y-38]],w.level.theme[2],8);
      rect(g,f.x-28,p.y-52,56,36,7,done?'#526f61':'#294757',color,1.55);
      if(slot){
        const index=slots[f.index];
        if(p.id==='sobreposicao') glyph(g,{icon:'outline',value:p.target[f.index]},f.x,p.y-34,.73);
        if(index!==null&&index!==undefined){
          if(p.id==='sobreposicao')g.globalAlpha=.57;
          glyph(g,p.objects[index],f.x,p.y-34,p.id==='sobreposicao'?.73:.85);
          g.globalAlpha=1;
        }
        else if(p.id==='solidos')referenceObject(g,f.index,f.x,p.y-34);
        else if(p.id!=='sobreposicao')text(g,'·',f.x,p.y-32,28);
      }else{
        if(p.rule==='frequencies'&&count)rect(g,f.x-13,p.y-58-count*6,26,count*6,3,['#83c2e6','#eaa6ba','#edc27e'][f.index],paper,.7);
        if(p.rule==='division')for(let j=0;j<count;j++)oval(g,f.x+(j%6-2.5)*6,p.y-59-Math.floor(j/6)*6,2.2,2.2,gold);
        text(g,String(count),f.x,p.y-33,22);
      }
      text(g,f.label,f.x,p.y-9,12);
      if(done)gear(g,f.x,p.y-71,11,t*(f.index%2?-.8:.8),color);
    }
    if(!done&&p.objects)for(const o of p.objects){
      if(!slots.includes(o.id)&&w.carry?.id!==o.id)piece(g,o,o.x,o.y-3,w.near?.kind==='object'&&w.near.id===o.id);
    }
    g.restore();
  }

  function render(g,w,c,scale,profile,reduced){
    const t=reduced?0:w.time;
    g.setTransform(scale,0,0,scale,0,0);
    scenery(g,w,c,t,reduced);
    g.save();g.translate(-c.x,-c.y);
    decor(g,w,c,t,profile);
    for(const s of w.solids)if(seen(s.x+s.w/2,s.y,c,s.w/2+s.h+50))surface(g,s,w.level);
    if(w.crate){
      const {x,y,w:width,h}=w.crate;
      rect(g,x,y,width,h,3,'#ad765e','#584553',2);
      rect(g,x+5,y+5,width-10,h-10,1,null,'#edbd86',1.7);
      line(g,[[x+7,y+h-7],[x+width-7,y+7]],'#e1b67f',4);
    }
    for(const p of w.level.stage??[])if(seen(p.x,p.y,c,340))puzzleBoard(g,p,w,t);
    const secret=w.level.secret;
    if(secret&&!profile.secrets.includes(w.index)&&seen(secret.x,secret.y,c)){
      oval(g,secret.x,secret.y,13,10,'#dca4a0',paper,1.4);
      line(g,[[secret.x,secret.y+7],[secret.x-7,secret.y-6],[secret.x,secret.y+7],[secret.x,secret.y-8],[secret.x,secret.y+7],[secret.x+7,secret.y-6]],'#794e65',1.1);
      star(g,secret.x+14,secret.y-11,5,paper);
    }
    if(w.index>=0&&w.state.solved.every(Boolean)){
      const {x,y}=w.level.lens;
      arch(g,x,y,92,116,'#2c4a5db8',w.level.color);
      oval(g,x,y-63,24,27,w.level.color,paper,2);
      oval(g,x,y-63,17,20,'#254d65',paper,1.3);
      star(g,x,y-62,12+Math.sin(t*2)*2,gold);
      text(g,'Lente',x,y-16,15);
    }
    tuca(g,w.pet,t,reduced);
    const p=w.player;
    mila(g,p,t,w.cheer>0,Boolean(w.carry),w.climbing);
    if(w.carry)piece(g,w.level.stage[w.carry.step].objects[w.carry.id],p.x+15+p.face*37,p.y+11,true);
    for(const v of w.particles){g.globalAlpha=Math.min(1,v.life*2);star(g,v.x,v.y,v.size,v.size%2?gold:'#bce6c1');}
    g.globalAlpha=1;
    g.restore();
  }
  return {load,render};
})();

