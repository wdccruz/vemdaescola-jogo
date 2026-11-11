'use strict';

const Physics = (() => {
  const tuning = {speed:326, accel:2630, air:1850, brake:3340, gravity:1740, jump:716, coyote:.115, buffer:.135};
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const toward = (v, target, rate) => v + clamp(target - v, -rate, rate);
  const overlaps = (a,b) => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
  const sides = (a,b) => a.y+a.h > b.y+.4 && a.y < b.y+b.h-.4;
  const across = (a,b) => a.x+a.w > b.x+.3 && a.x < b.x+b.w-.3;

  function moveX(body, amount, solids) {
    const start = body.x;
    let target = start+amount;
    for (const block of solids) {
      if (block.oneWay || !sides(body,block)) continue;
      if (amount > 0 && start+body.w <= block.x+.5) target = Math.min(target,block.x-body.w);
      if (amount < 0 && start >= block.x+block.w-.5) target = Math.max(target,block.x+block.w);
    }
    body.x = target;
    return target-start;
  }

  function moveY(body, amount, solids) {
    const start = body.y;
    let target = start+amount;
    let floor = null;
    let head = false;
    for (const block of solids) {
      if (!across(body,block)) continue;
      if (amount >= 0 && start+body.h <= block.y+Math.max(.6,block.dy || 0) && target+body.h >= block.y) {
        target = block.y-body.h;
        floor = block;
      }
      if (amount < 0 && !block.oneWay && start >= block.y+block.h-.5 && target < block.y+block.h) {
        target = block.y+block.h;
        head = true;
      }
    }
    body.y = target;
    if (floor || head) body.vy = 0;
    return floor;
  }

  function body(x,y,w=30,h=54) {
    return {x,y,w,h,vx:0,vy:0,on:null,face:1,coyote:0,buffer:0,land:0,stride:0};
  }

  function tickCrate(crate,dt,solids) {
    crate.vy = Math.min(850,crate.vy+tuning.gravity*dt);
    crate.on = moveY(crate,crate.vy*dt,solids);
  }

  function tickPlayer(p,dt,dir,jumpDown,jumpPressed,jumpReleased,solids,crate) {
    const wasGrounded = Boolean(p.on);
    if (p.on?.moving) {
      moveX(p,p.on.dx,solids);
      p.y += p.on.dy;
    }
    p.coyote = wasGrounded ? tuning.coyote : Math.max(0,p.coyote-dt);
    p.buffer = jumpPressed ? tuning.buffer : Math.max(0,p.buffer-dt);
    p.land = Math.max(0,p.land-dt);
    if (p.coyote && p.buffer) {
      p.vy = -tuning.jump;
      p.coyote = 0;
      p.buffer = 0;
      p.on = null;
    }
    if ((jumpReleased || !jumpDown) && p.vy < -265) p.vy = -265;
    const rate = dir ? (wasGrounded ? tuning.accel : tuning.air) : (wasGrounded ? tuning.brake : tuning.air*.6);
    p.vx = toward(p.vx,dir*tuning.speed,dt*rate);
    if (dir) p.face = dir;

    const dx = p.vx*dt;
    if (crate && crate.on && wasGrounded && sides(p,crate) && dx) {
      const gap = dx > 0 ? crate.x-p.x-p.w : p.x-crate.x-crate.w;
      if (gap >= -.5 && gap <= Math.abs(dx)+.5) moveX(crate,dx*.82,solids);
    }
    const colliders = crate ? [...solids,crate] : solids;
    const travelled = moveX(p,dx,colliders);
    if (Math.abs(travelled-dx) > .01) p.vx = 0;

    p.vy = Math.min(1020,p.vy+tuning.gravity*dt);
    const impact = p.vy;
    p.on = moveY(p,p.vy*dt,colliders);
    if (p.on && !wasGrounded && impact > 185) p.land = .15;
    p.stride += Math.abs(travelled)*.067;
  }

  return {body,tickPlayer,tickCrate,clamp,toward,overlaps};
})();

