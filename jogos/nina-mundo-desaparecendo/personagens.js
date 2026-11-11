'use strict';

const Characters = (() => {
  const paths = new Map();
  const ink = '#392c3b';
  function shape(g,d,color,outline='',width=1) {
    if (!paths.has(d)) paths.set(d,new Path2D(d));
    const path = paths.get(d);
    if (color) { g.fillStyle=color; g.fill(path); }
    if (outline) { g.strokeStyle=outline; g.lineWidth=width; g.stroke(path); }
  }

  function oval(g,x,y,rx,ry,color,edge='',width=1) {
    g.beginPath();
    g.ellipse(x,y,rx,ry,0,0,Math.PI*2);
    if (color) {g.fillStyle=color;g.fill();}
    if (edge) {g.strokeStyle=edge;g.lineWidth=width;g.stroke();}
  }

  function line(g,points,color,w) {
    g.beginPath();
    g.moveTo(...points[0]);
    for (const point of points.slice(1)) g.lineTo(...point);
    g.strokeStyle=color;
    g.lineWidth=w;
    g.lineCap='round';
    g.lineJoin='round';
    g.stroke();
  }

  function pencil(g,x,y,angle,shine) {
    g.save();
    g.translate(x,y);
    g.rotate(angle);
    if (shine) {g.shadowBlur=13;g.shadowColor='#ffcf80';}
    shape(g,'M-3 8V-14q3-4 6 0V8L0 15Z','#efb259','#663e4a',1.05);
    g.shadowBlur=0;
    shape(g,'M-2 -12h2v20h-2Z','#ffe4a4');
    shape(g,'M-3 8h6l-3 7Z','#f7d798');
    shape(g,'M-1.2 12h2.4L0 15Z','#564051');
    g.restore();
  }

  function nina(g,x,y,pose={},time=0) {
    const {face=1,stride=0,vx=0,vy=0,on=true,land=0,drawing=false,cheer=false,emotion=''} = pose;
    const run = on ? Math.min(Math.abs(vx)/245,1) : 0;
    const swing = Math.sin(stride)*run;
    const bend = land*22;
    const lift = on ? -Math.abs(Math.sin(stride))*run*2.3 : 0;
    g.save();
    g.translate(x,y);
    g.scale(face,1);
    g.translate(0,lift+bend);
    g.lineCap='round';
    g.lineJoin='round';
    if (on) oval(g,0,1,19,4,'#14283362');

    const leg = (sx,step,near) => {
      const kx=sx+step*.5+(on?0:3);
      const ky=on?-12:-15;
      const fx=sx+step+(on?0:near?5:-8);
      const fy=on?-3-Math.max(0,-step)*.29-bend:-6+(near?0:-4);
      line(g,[[sx,-25],[kx,ky],[fx,fy]],ink,8);
      line(g,[[sx,-25],[kx,ky],[fx,fy]],near?'#695367':'#4f425b',5.4);
      g.save(); g.translate(fx,fy);
      shape(g,'M-4 -3q4-2 7 0l4 2q4 2 1 5H-4q-2-2 0-7Z',near?'#af5c59':'#844c56',ink,1.1);
      line(g,[[-3,3],[7,3]],'#e8af80',1.1);
      g.restore();
    };

    leg(-4,swing*12,false);
    leg(4,-swing*12,true);
    shape(g,'M-9 -44q-15-3-16 10v13q5 6 14 3l8-17Z','#497f78',ink,1.45);
    shape(g,'M-23 -31q6 0 12 3l-2 8q-8 3-10-2Z','#77a48b','#344e58',1);
    line(g,[[-20,-27],[-14,-26]],'#dfc481',1.1);
    shape(g,'M-11 -42q7-5 17-3 6 1 9 7l-2 15q-13 7-27 0l1-14Z','#dfa84f',ink,1.4);
    shape(g,'M-9 -41q2 10-1 17l6 3q2-12-1-21Z','#f5cc71');
    shape(g,'M-9 -32q7 5 19 1l1 8q-9 7-23 0Z','#615066',ink,1);
    line(g,[[-5,-38],[-3,-29]],'#47716c',2);
    oval(g,-3,-30,1.6,1.6,'#f8d084');
    shape(g,'M-3 -46v7q4 3 8-1v-9Z','#b87559',ink,1);

    const elbow = drawing ? [17,-28] : cheer ? [14,-42] : [9+swing*4,-31];
    const hand = drawing ? [29,-38] : cheer ? [19,-53] : [10+swing*9,-24];
    line(g,[[7,-39],elbow,hand],ink,8);
    line(g,[[7,-39],elbow,hand],'#f0bd61',5.8);
    oval(g,...hand,3.3,3.3,'#c88a64',ink,1);
    const penX=hand[0]+(drawing ? Math.sin(time*20)*3 : 2);
    pencil(g,penX,hand[1]-4,drawing ? -.91+Math.sin(time*14)*.22 : .32,drawing||cheer);

    g.save();
    g.translate(on?0:vy>0?1:0,-1);
    const curl='#362837', curlLight='#594050';
    oval(g,-15,-64,9,10,curl,ink,1.3);
    oval(g,7,-67,9,9,curl,ink,1.3);
    shape(g,'M-21 -62q-2-6 3-8m19 0q4-4 10-1','',curlLight,1.5);
    shape(g,'M-17 -56q-2-13 10-16 9-3 18 4l4 15-14 8-14-3Z',curl,ink,1.15);
    oval(g,-11,-51,4,4.4,'#b87559',ink,1);
    shape(g,'M-10 -57q3-6 9-5 5 5 13 4 4 5 4 9-3 10-13 10-12 0-15-9Z','#cc916b',ink,1.2);
    shape(g,'M-12 -56q2-12 12-11 9 1 12 6-5 3-12-1-4 5-12 6Z',curl);
    shape(g,'M-11 -62q6-6 12-5m-15 4 3-3','',curlLight,1.25);
    const blink=time%4.7>4.58;
    const wide=drawing||emotion==='surprise'||(!on&&vy>95);
    const ey=wide?2.9:2.1;
    if (blink) {
      line(g,[[1,-52],[4,-52]],ink,1.3); line(g,[[10,-52],[13,-52]],ink,1.2);
    } else {
      oval(g,2,-52,1.65,ey,'#322a39');
      oval(g,10.9,-52,1.5,ey,'#322a39');
      oval(g,2.6,-53,.5,.6,'#fff2c7');
      oval(g,11.4,-53,.45,.55,'#fff2c7');
    }
    shape(g,emotion==='worry'?'M0 -56l4-2m6 1 3 2':'M0 -56q2-2 5-1m5 0 2 1','',ink,.9);
    oval(g,-1,-47,2.6,1.3,'#db866d');
    shape(g,'M7 -51l2 4-3 1','', '#915950',.75);
    if (cheer||emotion==='happy') shape(g,'M4 -45q3 1 7-1-1 6-5 5Z','#714451');
    else if (wide) oval(g,7,-44.6,1.7,1.5,'#754653');
    else shape(g,emotion==='worry'?'M4 -43q3-3 6-1':'M4 -44q3 2 6-1','', '#754653',1);
    g.restore();
    g.restore();
  }

  function dobri(g,x,y,time,mode='follow',face=1) {
    g.save();
    g.translate(x,y+(mode==='still'?0:Math.sin(time*5)*2.4));
    g.scale(face,1);
    g.rotate(mode==='celebrate' ? Math.sin(time*11)*.14 : -.06);
    const wing = Math.cos(time*(mode==='celebrate'?21:12));
    g.save();g.scale(1,.72+wing*.23);
    shape(g,'M-9 4-25-13-3-6 1 4Z','#d38b87','#604957',1.2);
    g.restore();
    shape(g,'M-20 4 0-11 10-16 14-7 23-3 14 0 6 12-5 12Z','#f8dfad','#665164',1.2);
    shape(g,'M-20 4-5 6 6 12-5 12Z','#cba98f');
    shape(g,'M0-11 6 3 14 0 10-16Z','#fff1c8');
    g.save();g.scale(1,.77-wing*.26);
    shape(g,'M-6 5-19-14 5-5 8 4Z','#f2c4ac','#715264',1);
    shape(g,'M-19-14-4-8-10-4Z','#be777f');
    g.restore();
    oval(g,10,-6,1.55,mode==='worry'?2.3:1.65,'#3c3549');
    if (mode==='celebrate') shape(g,'M12-2q3 3 5 0','','#8c5560',1);
    g.restore();
  }

  function blot(g,x,y,time,calm=false) {
    g.save();g.translate(x,y+Math.sin(time*3)*3);
    oval(g,0,2,28,5,'#241e4566');
    shape(g,'M-30 -8q-9-9 2-17-8-16 7-24 0-17 15-17 12-13 23 1 16 2 19 16 11 9 4 19 10 12-3 22-17 10-29 1-12 10-25 1-8 1-13-3Z',calm?'#6e5685':'#4f436d','#2d2948',2);
    shape(g,'M-26 -26q-5-14 6-20 0-13 14-14 7-8 14-4-12 6-13 17-12 3-13 14Z','#a87da176');
    oval(g,-9,-39,4.4,calm?4:6,'#ffe0a2');
    oval(g,10,-39,4.4,calm?4:6,'#ffe0a2');
    oval(g,-8,-39,1.8,2.4,'#3c344f');
    oval(g,11,-39,1.8,2.4,'#3c344f');
    shape(g,calm?'M-5-27q6 6 13-1':'M-5-25q6-6 13 0','', '#d8a2af',1.6);
    g.restore();
  }

  function cora(g,x,y,time) {
    g.save();g.translate(x,y);
    oval(g,0,0,23,5,'#15283661');
    shape(g,'M-14 -36q11-8 26-1 11 13 14 35-26 7-50 0 4-18 10-34Z','#b16c78','#4f4054',1.7);
    shape(g,'M-10 -29q9 6 18-1l8 23q-14 5-30 0Z','#ead4a1');
    oval(g,0,-43,15,15,'#ddb28c','#544051',1.3);
    shape(g,'M-17 -44q-10-4-7-11l8-2 4-9 14-3 11 8 12 4q7 6-6 11-17-6-36 2Z','#639482','#3b5557',1.3);
    shape(g,'M-14 -54q15-5 29 0','', '#d3be89',2);
    oval(g,-4,-43,1.6,2,'#483746');
    oval(g,6,-43,1.6,2,'#483746');
    shape(g,'M-3 -37q5 5 9 0','', '#875459',1);
    g.restore();
  }

  function firefly(g,x,y,time) {
    g.save();g.translate(x,y+Math.sin(time*7)*3);
    g.shadowBlur=14;g.shadowColor='#ffc86c';
    oval(g,0,0,10,12,'#ffd77d');
    g.shadowBlur=0;
    const flap=4+Math.abs(Math.sin(time*18))*4;
    oval(g,-9,-4,flap,5,'#eadfa5b8','#a17a7c',.8);
    oval(g,9,-4,flap,5,'#eadfa5b8','#a17a7c',.8);
    oval(g,-3,-2,1.2,1.7,'#614355');
    oval(g,3,-2,1.2,1.7,'#614355');
    shape(g,'M-2 3q2 3 4 0','', '#96545d',1);
    g.restore();
  }

  function tickDobri(pet,p,solids,dt,celebrate,hint) {
    const distance=Math.hypot(pet.x-p.x,pet.y-p.y);
    if (distance > 540 || pet.y > p.y+270) {
      pet.mode='rejoin';
      pet.x=p.x-p.face*58;
      pet.y=p.y-37;
      pet.vx=0;pet.vy=0;
      return;
    }
    const scout=celebrate>0;
    const goalX=p.x+(scout?p.face*52:-p.face*(hint?47:67));
    let goalY=p.y-(scout?49:30);
    const blocked=solids.find(s=>!s.oneWay && pet.y>s.y-14 && pet.y<s.y+s.h && Math.min(pet.x,goalX)<s.x+s.w && Math.max(pet.x,goalX)>s.x);
    if (blocked) goalY=Math.min(goalY,blocked.y-24);
    pet.mode=scout?'celebrate':blocked?'avoid':hint?'hint':distance<81?'hover':'follow';
    const desiredX=Physics.clamp((goalX-pet.x)*6,-358,358);
    const desiredY=Physics.clamp((goalY-pet.y)*6,-380,380);
    pet.vx=Physics.toward(pet.vx,desiredX,dt*1350);
    pet.vy=Physics.toward(pet.vy,desiredY,dt*1450);
    pet.x+=pet.vx*dt;
    pet.y+=pet.vy*dt;
  }

  function portrait(canvas,name) {
    const g=canvas.getContext('2d');
    g.clearRect(0,0,104,104);
    g.fillStyle='#344d52';g.fillRect(0,0,104,104);
    oval(g,73,24,15,15,'#f6d38c40');
    if (name==='Nina') {g.save();g.translate(-15,0);g.scale(1.3,1.3);nina(g,53,81,{emotion:'happy'});g.restore();}
    else if (name==='Cora') cora(g,52,88,0);
    else if (name==='Borrão') blot(g,52,87,0,true);
    else if (name==='Fagulha') {g.save();g.scale(2,2);firefly(g,26,26,0);g.restore();}
    else {g.save();g.scale(1.65,1.65);dobri(g,31.5,30,0,'still');g.restore();}
  }

  return {shape,oval,line,nina,dobri,blot,cora,firefly,tickDobri,portrait,pencil};
})();

