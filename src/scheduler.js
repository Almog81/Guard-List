export function timeToSlot(t) { return Math.round(t * 2); }
export function slotToTime(s) { return s / 2; }

export function buildDaySlots(settings) {
  const { eveningBridgeStart, eveningBridgeEnd, morningBridgeStart, morningBridgeEnd } = settings;
  const bridgeWindows = [
    [morningBridgeStart, morningBridgeEnd],
    [eveningBridgeStart, eveningBridgeEnd],
  ];
  function inBridge(t) {
    return bridgeWindows.some(([s, e]) => t >= s && t < e);
  }

  const startSlot = timeToSlot(morningBridgeStart);
  const rawSlots = [];
  for (let i = 0; i < 48; i++) {
    const slotIdx = (startSlot + i) % 48;
    const t = slotToTime(slotIdx);
    const tEnd = slotToTime(slotIdx + 1);
    const hour = Math.floor(t);
    const startMin = (t % 1 >= 0.5) ? 30 : 0;
    const endMin = (tEnd % 1 >= 0.5) ? 30 : 0;
    const endHour = Math.floor(tEnd) % 24;
    rawSlots.push({ t, hour, startMin, endMin, endHour, isBridge: inBridge(t) });
  }

  const shifts = [];
  let j = 0;
  while (j < rawSlots.length) {
    const s = rawSlots[j];
    if (s.isBridge) {
      let k = j;
      while (k < rawSlots.length && rawSlots[k].isBridge) k++;
      const bridgeFrom = s.t;
      const bridgeTo = rawSlots[k - 1].t + 0.5;
      const bridgeStartsHalf = (bridgeFrom % 1) !== 0;
      if (bridgeStartsHalf && shifts.length > 0 && shifts[shifts.length - 1].type === 'guard') {
        shifts[shifts.length - 1].pairRole = 'before';
      }
      shifts.push({ type: 'bridge', from: bridgeFrom, to: bridgeTo, t: bridgeFrom });
      const bridgeEndsHalf = (bridgeTo % 1) !== 0;
      j = k;
      if (bridgeEndsHalf && j < rawSlots.length && !rawSlots[j].isBridge) {
        const a = rawSlots[j];
        shifts.push({
          type: 'guard', hour: a.hour, startMin: a.startMin,
          endHour: a.endHour, endMin: a.endMin,
          duration: 0.5, t: a.t, pairRole: 'after',
        });
        j++;
      }
    } else {
      const next = rawSlots[j + 1];
      if (next && !next.isBridge && Math.floor(next.t) === Math.floor(s.t)) {
        shifts.push({
          type: 'guard', hour: s.hour, startMin: s.startMin,
          endHour: next.endHour, endMin: next.endMin,
          duration: 1, t: s.t,
        });
        j += 2;
      } else {
        shifts.push({
          type: 'guard', hour: s.hour, startMin: s.startMin,
          endHour: s.endHour, endMin: s.endMin,
          duration: 0.5, t: s.t,
        });
        j++;
      }
    }
  }
  return shifts;
}

function buildInterleavedOrder(teams) {
  const queues = teams.map(t => [...t.soldiers]);
  const result = [];
  let ti = 0;
  const total = teams.reduce((s, t) => s + t.soldiers.length, 0);
  while (result.length < total) {
    let tried = 0;
    while (queues[ti % teams.length].length === 0 && tried < teams.length) {
      ti++; tried++;
    }
    const q = queues[ti % teams.length];
    if (q.length > 0) result.push(q.shift());
    ti++;
  }
  return result;
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

// dateStrFn: function(offset) => "YYYY-MM-DD", injected for testability
export function generateSchedule(teams, settings, days, dateStrFn) {
  const allShifts = buildDaySlots(settings);
  const guardShifts = allShifts.filter(s => s.type === 'guard' && s.pairRole !== 'after');
  const A = guardShifts.length;
  const n = teams.reduce((s, t) => s + t.soldiers.length, 0);

  const baseOrder = buildInterleavedOrder(teams);
  const slotOrder = Array.from({ length: A }, (_, i) => baseOrder[i % n]);

  let STEP = Math.ceil(A / n);
  while (gcd(STEP, A) !== 1 && STEP < A) STEP++;
  if (STEP >= A) STEP = 1;

  const schedule = []; // [{ date, slots }]

  for (let d = 0; d < days; d++) {
    const date = dateStrFn(d);
    const offset = (d * STEP) % A;

    let guardIdx = 0;
    let lastBeforeSoldier = null;
    const daySlots = allShifts.map(slot => {
      if (slot.type === 'bridge') {
        return { ...slot, soldierId: null, soldierName: null, teamId: null, teamName: null, teamColor: null, isOverride: false };
      }
      if (slot.pairRole === 'after' && lastBeforeSoldier) {
        return {
          ...slot,
          soldierId: lastBeforeSoldier.id, soldierName: lastBeforeSoldier.name,
          teamId: lastBeforeSoldier.teamId, teamName: lastBeforeSoldier.teamName,
          teamColor: lastBeforeSoldier.teamColor, isOverride: false,
        };
      }
      const soldier = slotOrder[(guardIdx + offset) % A];
      guardIdx++;
      if (slot.pairRole === 'before') lastBeforeSoldier = soldier;
      return {
        ...slot,
        soldierId: soldier.id, soldierName: soldier.name,
        teamId: soldier.teamId, teamName: soldier.teamName,
        teamColor: soldier.teamColor, isOverride: false,
      };
    });

    schedule.push({ date, slots: daySlots });
  }
  return schedule;
}
