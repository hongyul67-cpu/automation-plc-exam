/* ══════════════════════════════════════════════════════════════
   자동화설비 실기 PLC제어작업 — 그림 모음 (그림08 · 2026-09-30)
   공용 그리기 도우미 links/fig.js 를 쓴다. index.html(배우기) · lesson.js(수업 슬라이드)가 함께 부른다.

   한 칸의 모양
     키: { cap:'캡션 한 줄', learn:['배우기 쪽 제목'…], draw:function(){ … } }
       learn — index.html 의 buildLearn() 이 만드는 쪽 제목(H2)과 **똑같이**. 그 쪽 맨 위에 그림이 나온다.
               문제마다 이름이 바뀌는 쪽(「공개문제 1 · 부가조건 3 (비상정지)」)은 앞글자를 뺀 끝부분으로 적는다.
       슬라이드는 lesson.js 의 fig:'키' 로 같은 그림을 부른다.

   그림 내용의 근거
     · 설비 배치 · I/O — 공개문제 「시험2 PLC제어작업」 7-6쪽 [그림1] 컨베이어 시스템 간략도 · [그림2] 공기압 회로도
       · 7-7쪽 [표1] I/O 할당표. 간략도를 따라 그리지 않고 평면 배치로 새로 짰다(6단계 시운전 화면과 같은 배치).
     · S3·S4 — 공개문제 표기(S3 비금속 · S4 금속)가 아니라 이 도구의 약속(S3 유도형=금속만 · S4 정전용량형=전부).
     · 비상정지 해제 세 갈래 — data.js 의 20문제 estopRelease 를 센 것.
     · 스텝 공식 · 타이머 표기(T#2S · T3.Q) — 선생님 노션 래더(XGI 방식). 수치는 슬라이드 본문에 있는 것만.
   ══════════════════════════════════════════════════════════════ */
var FIGS = (function () {
  var F = window.FIG;
  if (!F) return {};
  var C = F.C;
  var t = F.t, box = F.box, line = F.line, arrow = F.arrow, callout = F.callout;

  /* ── 래더 조각 ─────────────────────────── */
  /* 접점: 세로 막대 둘. b:true 면 b접점(사선) */
  function contact(x, y, label, o) {
    o = o || {};
    var c = o.c || C.ink;
    return line(x - 9, y - 13, x - 9, y + 13, { c: c, w: 2.4 }) + line(x + 9, y - 13, x + 9, y + 13, { c: c, w: 2.4 }) +
      (o.b ? line(x - 7, y + 12, x + 7, y - 12, { c: c, w: 1.8 }) : '') +
      (label ? t(x, y - 24, label, { a: 'm', b: 1, size: o.size || 15, c: o.lc || c }) : '');
  }
  /* 코일: 동그라미 */
  function coil(x, y, label, o) {
    o = o || {};
    return F.circle(x, y, 13, { fill: C.paper, c: o.c || C.ink, w: 2 }) +
      (label ? t(x, y - 26, label, { a: 'm', b: 1, size: o.size || 15, c: o.lc || C.ink }) : '');
  }
  function wire(x1, y1, x2, y2, c) { return line(x1, y1, x2, y2, { c: c || C.ink, w: 1.6 }); }
  function rails(xl, xr, y1, y2) { return line(xl, y1, xl, y2, { w: 2.6 }) + line(xr, y1, xr, y2, { w: 2.6 }); }
  function divider(x, y1, y2) { return line(x, y1, x, y2, { c: C.grayM, w: 1.4, dash: '6 5' }); }

  /* ── 설비 조각 ─────────────────────────── */
  /* 실린더(가로): 몸통 왼쪽 끝 x, 중심 y, 몸통 길이 bl, 로드 길이 rl(나와 있는 만큼) */
  function cylH(x, y, bl, rl, o) {
    o = o || {};
    var c = o.c || C.ink, fill = o.fill || C.grayL;
    return box(x, y - 10, bl, 20, { fill: fill, c: c, r: 3, w: 1.6 }) +
      box(x + bl - 4, y - 3, rl + 4, 6, { fill: C.grayM, c: c, r: 1, w: 1.2 }) +
      box(x + bl + rl - 2, y - 8, 5, 16, { fill: C.grayM, c: c, r: 1, w: 1.2 });
  }
  /* 실린더(세로, 아래로 민다) */
  function cylV(x, y, bl, rl, o) {
    o = o || {};
    var c = o.c || C.ink, fill = o.fill || C.grayL;
    return box(x - 10, y, 20, bl, { fill: fill, c: c, r: 3, w: 1.6 }) +
      box(x - 3, y + bl - 4, 6, rl + 4, { fill: C.grayM, c: c, r: 1, w: 1.2 }) +
      box(x - 8, y + bl + rl - 2, 16, 5, { fill: C.grayM, c: c, r: 1, w: 1.2 });
  }
  /* 리밋스위치 표시: 작은 네모 + 이름. on 이면 초록 */
  function lsMark(x, y, name, on, o) {
    o = o || {};
    var c = on ? C.green : C.sub;
    return box(x - 7, y - 7, 14, 14, { fill: on ? C.green : C.paper, c: c, r: 3, w: 1.6 }) +
      t(x, y + (o.up ? -19 : 20), name, { a: 'm', b: 1, size: 14, c: on ? C.green : C.ink });
  }
  function work(x, y, metal, r) {
    return F.circle(x, y, r || 11, { fill: metal ? C.grayM : C.purpleL, c: metal ? C.ink : C.purple, w: 1.6 });
  }
  /* 5/2 방향제어밸브 기호(간략): 두 칸 + 왼쪽 솔레노이드 + 오른쪽 (스프링 | 솔레노이드) */
  function valve(x, y, right, lname, rname) {
    var s = box(x, y, 44, 30, { fill: C.paper, r: 0, w: 1.6 }) + box(x + 44, y, 44, 30, { fill: C.paper, r: 0, w: 1.6 });
    s += arrow(x + 8, y + 24, x + 36, y + 6, { w: 1.3, head: 7 }) + arrow(x + 80, y + 24, x + 52, y + 6, { w: 1.3, head: 7 });
    /* 왼쪽 솔레노이드 */
    s += box(x - 22, y + 4, 22, 22, { fill: C.blueL, c: C.blue, r: 0, w: 1.6 }) + line(x - 22, y + 26, x, y + 4, { c: C.blue, w: 1.4 });
    s += t(x - 11, y + 44, lname, { a: 'm', b: 1, size: 14, c: C.blue });
    if (right === 'spring') {
      s += F.poly([[x + 88, y + 15], [x + 92, y + 6], [x + 97, y + 24], [x + 102, y + 6], [x + 107, y + 24], [x + 111, y + 15]], { c: C.orange, w: 1.8 });
      s += t(x + 100, y + 44, rname, { a: 'm', b: 1, size: 14, c: C.orange });
    } else {
      s += box(x + 88, y + 4, 22, 22, { fill: C.purpleL, c: C.purple, r: 0, w: 1.6 }) + line(x + 88, y + 26, x + 110, y + 4, { c: C.purple, w: 1.4 });
      s += t(x + 99, y + 44, rname, { a: 'm', b: 1, size: 14, c: C.purple });
    }
    return s;
  }

  return {

  /* ─────────── 1단계 · 설비와 I/O ─────────── */
  plant: { learn: ['이 설비가 하는 일'],
    cap: '설비를 위에서 본 배치 — 매거진 → 공급 → 가공 → 송출 → 컨베이어 → 판별 → 배출 또는 저장',
    draw: function () {
      var s = '';
      /* 가공 위치 P, 매거진 M */
      var P = [196, 112], M = [118, 112];
      /* CYL1 공급 → 매거진 맨 아래 공작물을 가공 위치로 */
      s += cylH(22, P[1], 44, 18) + t(46, P[1] + 26, 'CYL1 공급', { a: 'm', b: 1, size: 14 });
      s += F.circle(M[0], M[1], 20, { fill: C.paper, c: C.ink, w: 1.6 }) + work(M[0], M[1], true, 12);
      s += t(M[0], M[1] - 32, '매거진 S1', { a: 'm', b: 1, size: 14 });
      s += arrow(M[0] + 22, P[1], P[0] - 24, P[1], { c: C.blue, w: 2 }) + F.num(157, P[1] - 18, 1, { r: 10, size: 12 });
      /* 가공 위치 + 드릴 */
      s += box(P[0] - 22, P[1] - 22, 44, 44, { fill: C.grayL, r: 4, w: 1.4 });
      s += F.circle(P[0], P[1], 13, { fill: C.orangeL, c: C.orange, w: 2 }) + t(P[0], P[1], 'M1', { a: 'm', b: 1, size: 12, c: C.orange, halo: false });
      s += t(P[0] + 30, P[1] - 6, 'CYL2 가공', { b: 1, size: 14 }) + t(P[0] + 30, P[1] + 12, '+ 드릴 M1', { size: 13, c: C.sub });
      s += F.num(P[0] + 36, P[1] + 34, 2, { r: 10, size: 12 });
      /* CYL3 송출 — 위에서 아래(컨베이어)로 민다 */
      s += cylV(P[0], 18, 40, 22) + t(P[0] + 16, 34, 'CYL3 송출', { b: 1, size: 14 });
      /* 컨베이어 */
      var by = 200, bx0 = 176, bx1 = 396;
      s += box(bx0, by - 16, bx1 - bx0, 32, { fill: C.blueL, c: C.blue, r: 6, w: 1.6 });
      for (var x = bx0 + 18; x < bx1 - 8; x += 22) s += line(x, by - 16, x, by + 16, { c: C.blue, w: 0.8 });
      s += t(bx0 + 4, by + 30, '컨베이어 M2', { b: 1, size: 14, c: C.blue });
      s += arrow(P[0], P[1] + 26, P[0], by - 4, { c: C.blue, w: 2 }) + F.num(P[0] - 16, 158, 3, { r: 10, size: 12 });
      s += arrow(236, by, 296, by, { c: C.blue, w: 2, head: 9 }) + F.num(266, by - 30, 4, { r: 10, size: 12 });
      /* 센서 */
      s += F.circle(222, by - 26, 5, { fill: C.sub, c: C.sub, w: 1 }) + t(222, by - 40, 'S2', { a: 'm', b: 1, size: 13 });
      s += F.circle(314, by - 26, 5, { fill: C.ink, c: C.ink, w: 1 }) + F.circle(332, by - 26, 5, { fill: C.purple, c: C.purple, w: 1 });
      s += t(323, by - 42, 'S3·S4', { a: 'm', b: 1, size: 13 }) + F.num(292, by - 42, 5, { r: 10, size: 12 });
      /* CYL4 배출 — 컨베이어 위에서 아래 상자로 민다 */
      s += cylV(368, 118, 34, 20) + t(382, 128, 'CYL4 배출', { b: 1, size: 14 });
      s += box(342, 238, 52, 40, { fill: C.paper, c: C.ink, r: 3, w: 1.6 }) + t(368, 290, '배출상자', { a: 'm', b: 1, size: 13 });
      s += arrow(368, by + 18, 368, 248, { c: C.red, w: 2, head: 9 }) + F.num(342, 224, 6, { r: 10, size: 12, c: C.red });
      /* 저장상자 — 컨베이어 끝까지 가면 */
      s += F.route([[bx1 + 2, by], [440, by], [440, 236]], { c: C.green, w: 2, head: 9 });
      s += box(414, 238, 52, 40, { fill: C.paper, c: C.ink, r: 3, w: 1.6 }) + t(440, 290, '저장상자', { a: 'm', b: 1, size: 13 });
      /* 타워램프 */
      s += box(440, 20, 26, 74, { fill: C.grayL, r: 5, w: 1.4 });
      s += F.circle(453, 36, 8, { fill: C.redL, c: C.red, w: 1.6 }) + F.circle(453, 57, 8, { fill: C.yellowL, c: C.orange, w: 1.6 }) +
        F.circle(453, 78, 8, { fill: C.greenL, c: C.green, w: 1.6 });
      s += t(434, 36, 'PL1', { a: 'e', size: 12, c: C.sub }) + t(434, 57, 'PL2', { a: 'e', size: 12, c: C.sub }) + t(434, 78, 'PL3', { a: 'e', size: 12, c: C.sub });
      return F.svg(480, 300, s);
    } },

  lsw: { learn: ['리밋스위치 LS — "다 갔다"를 알려주는 것'],
    cap: '실린더 양 끝의 리밋스위치 — 홀수(LS1·3·5·7)는 돌아온 쪽, 짝수(LS2·4·6·8)는 나간 쪽',
    draw: function () {
      var xa = 208, xb = 278;
      var s = t(xa, 20, '돌아온 쪽', { a: 'm', size: 14, c: C.sub }) + t(xa, 40, '홀수', { a: 'm', b: 1, size: 16, c: C.blue }) +
        t(xb, 20, '나간 쪽', { a: 'm', size: 14, c: C.sub }) + t(xb, 40, '짝수', { a: 'm', b: 1, size: 16, c: C.orange });
      var rows = [['CYL1 공급', 'LS1', 'LS2', '후진 / 전진'], ['CYL2 가공', 'LS3', 'LS4', '상승 / 하강'],
        ['CYL3 송출', 'LS5', 'LS6', '후진 / 전진'], ['CYL4 배출', 'LS7', 'LS8', '후진 / 전진']];
      for (var i = 0; i < 4; i++) {
        var y = 92 + i * 54, r = rows[i];
        s += t(94, y, r[0], { a: 'e', b: 1, size: 15 });
        s += cylH(104, y, 96, 70);
        s += lsMark(xa, y - 22, '', false) + t(xa + 11, y - 22, r[1], { b: 1, size: 14 });
        s += lsMark(xb, y - 22, '', false) + t(xb + 11, y - 22, r[2], { b: 1, size: 14 });
        s += t(336, y - 4, r[3], { size: 14, c: C.sub });
      }
      s += t(240, 282, '로드가 끝까지 가면 그쪽 LS 가 켜진다 → 다음 스텝의 전환조건', { a: 'm', b: 1, size: 14, c: C.blue });
      return F.svg(480, 302, s);
    } },

  sensors: { learn: ['센서 S와 스위치 SW'],
    cap: 'S3 유도형은 금속에만, S4 정전용량형은 재질과 상관없이 켜진다 → 비금속 = S4 · S3̄',
    draw: function () {
      var s = '';
      var cx = [250, 390];
      s += t(cx[0], 26, 'S3 유도형', { a: 'm', b: 1, size: 16, c: C.blue }) + t(cx[1], 26, 'S4 정전용량형', { a: 'm', b: 1, size: 16, c: C.purple });
      var rowY = [80, 150], name = ['금속', '비금속'];
      for (var r = 0; r < 2; r++) {
        var y = rowY[r];
        s += work(46, y, r === 0, 16) + t(72, y, name[r], { b: 1, size: 16 });
        for (var k = 0; k < 2; k++) {
          var on = !(k === 0 && r === 1);
          s += box(cx[k] - 46, y - 20, 92, 40, { fill: on ? C.greenL : C.grayL, c: on ? C.green : C.line, r: 20, w: 1.8,
            label: on ? 'ON' : 'OFF', lc: on ? C.green : C.sub, size: 17 });
        }
      }
      s += line(20, 115, 460, 115, { c: C.edge, w: 1.4 });
      s += box(60, 192, 360, 44, { fill: C.orangeL, c: C.orange, r: 8, w: 1.6 });
      s += t(240, 214, '비금속 = S4 켜짐 · S3 꺼짐 (S4 · S3̄)', { a: 'm', b: 1, size: 16, c: C.ink, halo: false });
      return F.svg(480, 254, s);
    } },

  valves: { learn: ['출력 — 실린더를 움직이는 SOL'],
    cap: '편솔은 SOL 을 끊으면 스프링이 되돌리고, 양솔은 SOL1(전진)·SOL2(후진)를 따로 명령한다',
    draw: function () {
      var s = t(120, 24, '편솔 (SOL 하나)', { a: 'm', b: 1, size: 16, c: C.blue }) + t(360, 24, '양솔 (SOL 둘)', { a: 'm', b: 1, size: 16, c: C.purple });
      s += divider(240, 14, 250);
      s += valve(76, 52, 'spring', 'SOL3', '스프링');
      s += valve(316, 52, 'sol', 'SOL1', 'SOL2');
      s += t(120, 136, 'SOL ON → 전진(하강)', { a: 'm', size: 14 });
      s += t(120, 160, 'SOL OFF → 스프링이 되돌림', { a: 'm', size: 14, b: 1, c: C.orange });
      s += t(120, 196, '가공 · 송출 · 배출', { a: 'm', size: 14, b: 1 }) + t(120, 216, '(SOL3 · SOL4 · SOL5)', { a: 'm', size: 13, c: C.sub });
      s += t(360, 136, 'SOL1 ON → 전진', { a: 'm', size: 14 });
      s += t(360, 160, 'SOL2 ON → 후진', { a: 'm', size: 14, b: 1, c: C.purple });
      s += t(360, 196, '공급실린더만', { a: 'm', size: 14, b: 1 }) + t(360, 216, '(둘 다 꺼지면 그 자리)', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 240, s);
    } },

  addr: { learn: ['주소는 내가 정한다'],
    cap: '주소는 수험자가 정한다 — 정한 주소로 결선하고, 프로그램에도 같은 주소를 쓴다 (X0 은 예시)',
    draw: function () {
      var s = '';
      /* 기기 */
      s += box(16, 58, 104, 64, { fill: C.grayL, r: 8 }) + t(68, 80, 'LS1', { a: 'm', b: 1, size: 17, halo: false }) +
        t(68, 102, '공급 후진', { a: 'm', size: 13, c: C.sub, halo: false });
      s += t(68, 40, '① 기기', { a: 'm', b: 1, size: 14, c: C.sub });
      /* PLC 입력 단자 */
      s += box(176, 44, 120, 92, { fill: C.blueL, c: C.blue, r: 8 });
      s += t(236, 64, 'PLC 입력', { a: 'm', b: 1, size: 14, c: C.blue, halo: false });
      s += box(206, 80, 60, 36, { fill: C.paper, c: C.blue, r: 4, w: 2, label: 'X0', lc: C.blue, size: 17 });
      s += t(236, 30, '② 결선', { a: 'm', b: 1, size: 14, c: C.sub });
      s += line(120, 98, 206, 98, { w: 2 }) + F.circle(206, 98, 3, { fill: C.ink, c: C.ink, w: 1 });
      /* 프로그램 */
      s += box(338, 44, 128, 92, { fill: C.paper, c: C.ink, r: 8 });
      s += t(402, 30, '③ 프로그램', { a: 'm', b: 1, size: 14, c: C.sub });
      s += line(350, 60, 350, 124, { w: 2 }) + wire(350, 102, 387, 102) + contact(402, 102, 'X0', { c: C.blue }) + wire(411, 102, 454, 102);
      /* 같은 주소 */
      s += F.route([[236, 136], [236, 164], [402, 164], [402, 142]], { c: C.green, w: 2 });
      s += t(319, 182, '같은 주소여야 한다', { a: 'm', b: 1, size: 15, c: C.green });
      s += t(240, 216, '공개문제 I/O 표의 주소 칸은 비어 있다 — 내가 채운다', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 236, s);
    } },

  /* ─────────── 시험 순서 ─────────── */
  order: { learn: ['테스트동작부터 만드는 이유', '부가조건을 먼저 알아둘 것'],
    cap: '시험장에서 만드는 순서 — 테스트동작이 안 되면 실격, 부가조건은 연속동작이 될 때만 채점',
    draw: function () {
      var s = '', w = 84, g = 10, x0 = 10, y = 60, h = 62;
      var a = ['I/O\n배선', '테스트\n동작 (B)', '단속\nPB2 (A)', '연속\nPB3 (A)', '부가\n조건 1·2·3'];
      var fill = [C.grayL, C.redL, C.blueL, C.blueL, C.greenL], cl = [C.ink, C.red, C.blue, C.blue, C.green];
      for (var i = 0; i < 5; i++) {
        var x = x0 + i * (w + g);
        s += box(x, y, w, h, { fill: fill[i], c: cl[i] }) + F.num(x + 12, y, i + 1, { c: cl[i], r: 10, size: 12 });
        s += t(x + w / 2, y + h / 2 + 2, a[i], { a: 'm', b: 1, size: 14, halo: false });
        if (i < 4) s += arrow(x + w + 1, y + h / 2, x + w + g - 1, y + h / 2, { head: 7, w: 1.6 });
      }
      s += t(240, 30, '먼저 만드는 것 → 나중에 만드는 것', { a: 'm', b: 1, size: 15 });
      /* 실격 */
      var x2 = x0 + (w + g);
      s += arrow(x2 + w / 2, y + h + 4, x2 + w / 2, 150, { c: C.red, w: 1.6, head: 8 });
      s += t(x2 + w / 2, 166, '안 되면 실격', { a: 'm', b: 1, size: 14, c: C.red });
      s += t(x2 + w / 2, 186, '(채점을 안 한다)', { a: 'm', size: 13, c: C.sub });
      /* 부가조건 채점 조건 */
      var x4 = x0 + 3 * (w + g), x5 = x0 + 4 * (w + g);
      s += F.route([[x4 + w / 2, y + h + 4], [x4 + w / 2, 140], [x5 + w / 2, 140], [x5 + w / 2, y + h + 6]], { c: C.green, w: 1.6, head: 8 });
      s += t((x4 + x5 + w) / 2, 162, '④가 돼야', { a: 'm', b: 1, size: 14, c: C.green });
      s += t((x4 + x5 + w) / 2, 182, '⑤를 채점', { a: 'm', b: 1, size: 14, c: C.green });
      return F.svg(480, 206, s);
    } },

  /* ─────────── 스텝 제어 ─────────── */
  stepchain: { learn: ['스텝 방식이란?'],
    cap: '스텝은 도미노처럼 차례로 넘어가고, 마지막 스텝이 A1을 끊으면 체인 전체가 한꺼번에 꺼진다',
    draw: function () {
      var s = t(240, 26, '앞 스텝이 켜져 있고 + 그 동작이 끝나면 → 다음 스텝', { a: 'm', b: 1, size: 15 });
      var xs = [16, 100, 184, 268], y = 64;
      for (var i = 0; i < 4; i++) {
        s += box(xs[i], y, 64, 46, { fill: i === 0 ? C.orangeL : C.blueL, c: i === 0 ? C.orange : C.blue, label: 'A' + (i + 1), size: 17 });
        if (i < 3) s += arrow(xs[i] + 66, y + 23, xs[i + 1] - 2, y + 23, { head: 8, w: 1.8 });
      }
      s += t(358, y + 23, '···', { a: 'm', b: 1, size: 18, c: C.sub });
      s += arrow(332, y + 23, 344, y + 23, { head: 7, w: 1.6 }) + arrow(372, y + 23, 386, y + 23, { head: 7, w: 1.6 });
      s += box(390, y, 74, 46, { fill: C.redL, c: C.red, label: 'A12', lc: C.red, size: 17 });
      s += F.route([[427, y + 48], [427, 150], [48, 150], [48, y + 50]], { c: C.red, w: 2 });
      s += t(238, 170, 'A12 의 b접점이 A1 을 끊는다', { a: 'm', b: 1, size: 15, c: C.red });
      s += t(238, 194, '→ 앞이 끊긴 스텝이 줄줄이 꺼져 처음으로', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 214, s);
    } },

  stepformula: { learn: ['스텝 하나의 모양'],
    cap: '(전환조건 + Aₙ) · Aₙ₋₁ → Aₙ — 자기유지는 전환조건만 감싸고, 직전 스텝은 분기 밖에 직렬',
    draw: function () {
      var s = t(240, 26, '(전환조건 + A2) · A1 → A2', { a: 'm', b: 1, size: 17, c: C.ink });
      var y = 92, yh = 146;
      s += rails(22, 458, 52, 172);
      s += wire(22, y, 101, y) + contact(110, y, 'LS2', { c: C.blue }) + wire(119, y, 200, y);
      /* 자기유지 분기 */
      s += wire(66, y, 66, yh) + wire(66, yh, 101, yh) + contact(110, yh, 'A2', { c: C.orange }) + wire(119, yh, 160, yh) + wire(160, yh, 160, y);
      s += wire(200, y, 261, y) + contact(270, y, 'A1', { c: C.green }) + wire(279, y, 367, y) + coil(380, y, 'A2') + wire(393, y, 458, y);
      s += F.route([[178, 44], [150, 44], [130, 64]], { c: C.blue, w: 1.2, head: 7 }) + t(184, 44, '전환조건', { size: 13, b: 1, c: C.blue });
      s += t(110, 190, '자기유지는', { a: 'm', size: 13, b: 1, c: C.orange }) + t(110, 208, '전환조건만 감싼다', { a: 'm', size: 13, b: 1, c: C.orange });
      s += t(270, 150, '직전 스텝은', { a: 'm', size: 13, b: 1, c: C.green }) + t(270, 168, '분기 밖 직렬', { a: 'm', size: 13, b: 1, c: C.green });
      s += t(380, 150, 'A1 이 꺼지면', { a: 'm', size: 13, c: C.sub }) + t(380, 168, 'A2 도 꺼진다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 222, s);
    } },

  abchain: { learn: ['테스트동작은 B, 단속·연속은 A'],
    cap: '테스트동작은 B 체인, 단속·연속동작은 A 체인 — 시작 버튼도 끊는 스텝도 따로 (스텝 수는 문제마다 조금 다르다)',
    draw: function () {
      var s = '';
      function chain(y, name, c, cl, start, last) {
        var out = t(16, y - 34, name, { b: 1, size: 15, c: c });
        out += box(16, y - 18, 80, 36, { fill: C.paper, c: c, w: 1.8, label: start, lc: c, size: 14 });
        out += arrow(98, y, 118, y, { c: c, head: 7, w: 1.6 });
        var xs = [120, 188, 256];
        for (var i = 0; i < 3; i++) {
          out += box(xs[i], y - 18, 56, 36, { fill: cl, c: c, label: name.charAt(0) + (i + 1), size: 16 });
          out += arrow(xs[i] + 57, y, xs[i] + 67, y, { c: c, head: 6, w: 1.4 });
        }
        out += t(342, y, '···', { a: 'm', b: 1, size: 16, c: C.sub }) + arrow(354, y, 372, y, { c: c, head: 6, w: 1.4 });
        out += box(374, y - 18, 64, 36, { fill: C.redL, c: C.red, label: last, lc: C.red, size: 16 });
        out += F.route([[406, y + 19], [406, y + 34], [148, y + 34], [148, y + 20]], { c: C.red, w: 1.4, head: 7 });
        return out;
      }
      s += chain(66, 'B 체인 — 테스트동작', C.red, C.redL, 'PB1', 'B9');
      s += line(16, 126, 464, 126, { c: C.edge, w: 1.4 });
      s += chain(182, 'A 체인 — 단속 · 연속', C.blue, C.blueL, 'PB2 · S1', 'A12');
      s += t(56, 226, '연속은 PB3', { a: 'm', size: 13, c: C.sub });
      s += t(290, 244, '한 프로그램 안에 있어도 서로 엉키지 않는다', { a: 'm', b: 1, size: 14 });
      return F.svg(480, 262, s);
    } },

  timer: { learn: ['타이머는 이렇게'],
    cap: 'TON — 입력이 켜진 뒤 설정시간(PT)이 지나야 T.Q 가 켜지고, 입력이 꺼지면 바로 꺼진다',
    draw: function () {
      var s = t(240, 24, 'TON 타이머 (PT = T#2S)', { a: 'm', b: 1, size: 16 });
      var x0 = 96, x1 = 170, x2 = 290, x3 = 390, xe = 462;
      s += t(84, 78, '입력', { a: 'e', b: 1, size: 15 }) + t(84, 98, '(A4)', { a: 'e', size: 13, c: C.sub });
      s += F.poly([[x0, 96], [x1, 96], [x1, 62], [x3, 62], [x3, 96], [xe, 96]], { w: 2.4, c: C.ink });
      s += t(84, 158, 'T3.Q', { a: 'e', b: 1, size: 15, c: C.orange }) + t(84, 178, '(A5 조건)', { a: 'e', size: 13, c: C.sub });
      s += F.poly([[x0, 176], [x2, 176], [x2, 142], [x3, 142], [x3, 176], [xe, 176]], { w: 2.6, c: C.orange });
      s += line(x1, 54, x1, 200, { c: C.grayM, w: 1.2, dash: '4 4' }) + line(x2, 54, x2, 200, { c: C.grayM, w: 1.2, dash: '4 4' }) +
        line(x3, 54, x3, 200, { c: C.grayM, w: 1.2, dash: '4 4' });
      s += arrow(x1 + 2, 210, x2 - 2, 210, { both: 1, w: 1.2, head: 8, c: C.blue });
      s += t((x1 + x2) / 2, 228, '2초 기다린다', { a: 'm', b: 1, size: 14, c: C.blue });
      s += t(468, 222, '입력이 꺼지면 바로 꺼짐', { a: 'e', size: 13, c: C.sub });
      return F.svg(480, 244, s);
    } },

  /* ─────────── 부가조건 ─────────── */
  estop: { learn: ['부가조건 3 (비상정지)'],
    cap: '비상정지 — 누를 때는 거의 같고, 해제한 뒤가 문제마다 다르다 (공개문제 20문제를 센 것)',
    draw: function () {
      var s = '';
      /* 누르면 */
      s += box(14, 40, 170, 150, { fill: C.redL, c: C.red, r: 10 });
      s += t(99, 24, '누르면 — 거의 같다', { a: 'm', b: 1, size: 15, c: C.red });
      s += t(28, 70, '· 현재 상태로 정지', { size: 14, halo: false }) + t(28, 98, '· 녹색·황색 소등', { size: 14, halo: false }) +
        t(28, 126, '· 적색 점멸', { size: 14, halo: false }) + t(28, 148, '  (16·17번은 점등)', { size: 13, c: C.sub, halo: false }) +
        t(28, 174, '8·9번은 조건부', { size: 13, c: C.sub, halo: false });
      s += arrow(186, 115, 222, 115, { w: 2, c: C.ink });
      s += t(342, 24, '해제하면 — 문제마다 다르다', { a: 'm', b: 1, size: 15 });
      var rows = [['시스템 초기화', '12문제', C.blue, C.blueL], ['2초 뒤 초기화', '1 · 19번', C.orange, C.orangeL],
        ['남은 동작 이어서', '3·5·8·9·10·16번', C.green, C.greenL]];
      for (var i = 0; i < 3; i++) {
        var y = 44 + i * 52;
        s += F.route([[222, 115], [236, 115], [236, y + 20], [250, y + 20]], { c: rows[i][2], w: 1.6, head: 7 });
        s += box(252, y, 214, 42, { fill: rows[i][3], c: rows[i][2], r: 8 });
        s += t(264, y + 14, rows[i][0], { b: 1, size: 15, halo: false }) + t(264, y + 32, rows[i][1], { size: 13, c: C.sub, halo: false });
      }
      s += t(240, 216, '→ 문제지의 「해제하면」 한 줄을 꼭 확인한다', { a: 'm', b: 1, size: 14, c: C.red });
      return F.svg(480, 236, s);
    } },

  initstate: { learn: ['시스템 초기화 상태'],
    cap: '초기화 상태 — 실린더는 모두 돌아와 LS1·LS3·LS5·LS7 이 켜지고, 모터는 정지, 램프는 소등',
    draw: function () {
      var s = t(24, 24, '① 실린더 모두 후진(상승)', { b: 1, size: 15 });
      var rows = [['공급', 'LS1', 'LS2'], ['가공', 'LS3', 'LS4'], ['송출', 'LS5', 'LS6'], ['배출', 'LS7', 'LS8']];
      for (var i = 0; i < 4; i++) {
        var y = 66 + i * 46;
        s += t(62, y, rows[i][0], { a: 'e', b: 1, size: 14 });
        s += cylH(72, y, 90, 4);
        s += lsMark(184, y, '', true) + t(195, y, rows[i][1], { b: 1, size: 14, c: C.green });
        s += lsMark(240, y, '', false) + t(251, y, rows[i][2], { size: 14, c: C.sub });
      }
      s += divider(290, 40, 240);
      s += t(306, 60, '② 모터 정지', { b: 1, size: 15 });
      s += F.circle(326, 96, 14, { fill: C.grayL, c: C.sub, w: 1.6, label: 'M1', size: 12, lc: C.sub }) +
        F.circle(372, 96, 14, { fill: C.grayL, c: C.sub, w: 1.6, label: 'M2', size: 12, lc: C.sub });
      s += t(306, 150, '③ 램프 소등', { b: 1, size: 15 });
      for (var k = 0; k < 3; k++) s += F.circle(326 + k * 30, 186, 10, { fill: C.grayL, c: C.sub, w: 1.6 });
      s += t(306, 222, '(부가조건 1 은 반영)', { size: 13, c: C.sub });
      return F.svg(480, 252, s);
    } },

  /* ─────────── 수업 슬라이드만 쓰는 그림 (1~7단원) ─────────── */
  iochain: { cap: '자동화 설비는 입력 → 제어(PLC) → 출력, 세 덩어리로 나뉜다',
    draw: function () {
      var s = '', xs = [14, 170, 326], nm = ['입력', '제어', '출력'], sub = ['스위치 · 센서', 'PLC (판단)', '실린더 · 모터 · 램프'],
        ex = ['PB2 · LS1 · S3', '조건이 맞으면 켠다', 'SOL1 · M1 · PL2'], fl = [C.blueL, C.orangeL, C.greenL], cl = [C.blue, C.orange, C.green];
      for (var i = 0; i < 3; i++) {
        s += box(xs[i], 34, 140, 76, { fill: fl[i], c: cl[i] });
        s += t(xs[i] + 70, 62, nm[i], { a: 'm', b: 1, size: 18, c: cl[i], halo: false }) + t(xs[i] + 70, 88, sub[i], { a: 'm', size: 13, c: C.sub, halo: false });
        s += t(xs[i] + 70, 132, ex[i], { a: 'm', size: 14 });
        if (i < 2) s += arrow(xs[i] + 142, 72, xs[i + 1] - 2, 72, { w: 2 });
      }
      return F.svg(480, 152, s);
    } },

  contacts: { cap: 'a접점은 평소 열려 있다가 누르면 통하고, b접점은 평소 닫혀 있다가 누르면 끊긴다',
    draw: function () {
      var s = t(120, 26, 'a접점 (평상시 열림)', { a: 'm', b: 1, size: 16, c: C.blue }) + t(360, 26, 'b접점 (평상시 닫힘)', { a: 'm', b: 1, size: 16, c: C.red });
      s += divider(240, 14, 200);
      s += wire(40, 86, 111, 86) + contact(120, 86, 'PB', { c: C.blue }) + wire(129, 86, 200, 86);
      s += wire(280, 86, 351, 86) + contact(360, 86, 'PB', { c: C.red, b: 1 }) + wire(369, 86, 440, 86);
      s += t(120, 128, '누르면 → 통한다', { a: 'm', size: 15, b: 1 }) + t(120, 150, '평소엔 끊겨 있다', { a: 'm', size: 14, c: C.sub });
      s += t(360, 128, '누르면 → 끊긴다', { a: 'm', size: 15, b: 1 }) + t(360, 150, '평소엔 통해 있다', { a: 'm', size: 14, c: C.sub });
      s += t(120, 184, '시작 버튼 · "~이면"', { a: 'm', size: 14, b: 1, c: C.blue }) + t(360, 184, '정지 버튼 · "~아니면"', { a: 'm', size: 14, b: 1, c: C.red });
      return F.svg(480, 206, s);
    } },

  andor: { cap: '직렬로 이으면 "그리고(AND)", 병렬로 이으면 "또는(OR)"',
    draw: function () {
      var s = t(120, 26, '직렬 = 그리고 (AND)', { a: 'm', b: 1, size: 16, c: C.blue }) + t(360, 26, '병렬 = 또는 (OR)', { a: 'm', b: 1, size: 16, c: C.green });
      s += divider(240, 14, 210);
      s += wire(16, 90, 51, 90) + contact(60, 90, 'PB2', { c: C.blue }) + wire(69, 90, 111, 90) + contact(120, 90, 'S1', { c: C.blue }) +
        wire(129, 90, 177, 90) + coil(190, 90, 'A1') + wire(203, 90, 226, 90);
      s += t(120, 148, '둘 다 켜져야 켜진다', { a: 'm', size: 14, b: 1 });
      s += wire(254, 90, 291, 90) + contact(300, 90, 'PB2', { c: C.green }) + wire(309, 90, 350, 90) + coil(390, 90, 'A1') + wire(403, 90, 466, 90);
      s += wire(272, 90, 272, 140) + wire(272, 140, 291, 140) + contact(300, 140, 'A1', { c: C.green }) + wire(309, 140, 350, 140) + wire(350, 140, 350, 90);
      s += wire(350, 90, 377, 90);
      s += t(360, 182, '둘 중 하나만 켜져도 켜진다', { a: 'm', size: 14, b: 1 }) + t(360, 202, '자기유지가 바로 이 모양', { a: 'm', size: 13, c: C.green, b: 1 });
      s += t(120, 172, '"눌렀고 그리고 공작물이 있으면"', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 222, s);
    } },

  selfhold: { cap: '자기유지 — 코일의 자기 접점을 기동 버튼과 병렬로 붙여, 손을 떼도 계속 켜져 있게 한다',
    draw: function () {
      var y = 76, yh = 132, s = rails(20, 460, 44, 160);
      s += wire(20, y, 81, y) + contact(90, y, 'PB1', { c: C.blue }) + wire(99, y, 160, y);
      s += wire(50, y, 50, yh) + wire(50, yh, 81, yh) + contact(90, yh, 'M', { c: C.orange }) + wire(99, yh, 130, yh) + wire(130, yh, 130, y);
      s += wire(160, y, 251, y) + contact(260, y, 'PB2', { c: C.red, b: 1 }) + wire(269, y, 367, y) + coil(380, y, 'M') + wire(393, y, 460, y);
      s += t(40, 176, '↑ 자기가 자기를 붙잡는 접점', { size: 13, b: 1, c: C.orange });
      s += t(290, 110, '← 여기가 끊기면 꺼진다', { size: 13, b: 1, c: C.red });
      s += t(240, 208, 'PB1 을 눌렀다 떼도 M 이 계속 켜져 있다', { a: 'm', size: 15, b: 1 });
      return F.svg(480, 228, s);
    } },

  plcparts: { cap: 'PLC 의 구성 — 입력부가 받고, CPU 가 판단하고, 출력부가 움직인다',
    draw: function () {
      var s = t(240, 22, 'XGI (LS ELECTRIC)', { a: 'm', b: 1, size: 15, c: C.sub });
      s += box(12, 58, 110, 76, { fill: C.blueL, c: C.blue }) + t(67, 86, '입력부', { a: 'm', b: 1, size: 17, halo: false }) + t(67, 110, 'LS · S · PB', { a: 'm', size: 13, c: C.sub, halo: false });
      s += box(158, 42, 130, 108, { fill: C.orangeL, c: C.orange }) + t(223, 86, 'CPU', { a: 'm', b: 1, size: 18, halo: false }) + t(223, 112, '프로그램 실행', { a: 'm', size: 13, c: C.sub, halo: false });
      s += box(324, 58, 110, 76, { fill: C.greenL, c: C.green }) + t(379, 86, '출력부', { a: 'm', b: 1, size: 17, halo: false }) + t(379, 110, 'SOL · M · PL', { a: 'm', size: 13, c: C.sub, halo: false });
      s += arrow(124, 96, 156, 96, { w: 2 }) + arrow(290, 96, 322, 96, { w: 2 });
      s += box(158, 162, 130, 34, { fill: C.grayL, label: '전원부 DC 24V', size: 14 });
      s += t(67, 160, '신호를 받아', { a: 'm', size: 13, c: C.sub }) + t(379, 160, '기계를 움직인다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 212, s);
    } },

  scan: { cap: '스캔 — 입력 읽기 → 연산 → 출력 내보내기, 이 한 바퀴(1스캔)를 계속 반복한다',
    draw: function () {
      var s = '', xs = [12, 170, 328], nm = ['① 입력 읽기', '② 연산', '③ 출력'], sub = ['모든 입력을 한 번에', '래더를 위→아래로', '결과를 한 번에'],
        cl = [C.blue, C.orange, C.green], fl = [C.blueL, C.orangeL, C.greenL];
      for (var i = 0; i < 3; i++) {
        s += box(xs[i], 28, 140, 68, { fill: fl[i], c: cl[i] }) + t(xs[i] + 70, 52, nm[i], { a: 'm', b: 1, size: 16, halo: false }) +
          t(xs[i] + 70, 76, sub[i], { a: 'm', size: 13, c: C.sub, halo: false });
        if (i < 2) s += arrow(xs[i] + 142, 62, xs[i + 1] - 2, 62, { w: 2 });
      }
      s += F.route([[398, 98], [398, 126], [82, 126], [82, 100]], { c: C.orange, w: 2 });
      s += t(240, 146, '이 한 바퀴 = 1스캔 · 눈 깜짝할 사이에 계속 반복', { a: 'm', b: 1, size: 14 });
      return F.svg(480, 166, s);
    } },

  ladder: { cap: '래더 — 조건(접점)은 왼쪽, 결과(코일)는 오른쪽. 좌모선에서 오른쪽으로 읽는다',
    draw: function () {
      var y = 86, s = rails(40, 440, 48, 124);
      s += t(40, 34, '좌모선', { a: 'm', b: 1, size: 14, c: C.sub }) + t(440, 34, '우모선', { a: 'm', b: 1, size: 14, c: C.sub });
      s += wire(40, y, 121, y) + contact(130, y, 'LS2', { c: C.blue }) + wire(139, y, 211, y) + contact(220, y, 'S1', { c: C.blue }) +
        wire(229, y, 347, y) + coil(360, y, 'SOL1', { c: C.green }) + wire(373, y, 440, y);
      s += t(175, 142, '조건(접점)은 왼쪽', { a: 'm', b: 1, size: 14, c: C.blue }) + t(360, 142, '결과(코일)는 오른쪽', { a: 'm', b: 1, size: 14, c: C.green });
      s += arrow(80, 172, 400, 172, { c: C.orange, w: 2 }) + t(240, 192, '왼쪽에서 오른쪽으로 전기가 흐르듯 읽는다', { a: 'm', size: 14, b: 1 });
      return F.svg(480, 210, s);
    } },

  limitsw: { cap: '"동작이 끝났다"는 시간이 아니라 리밋스위치로 확인한다',
    draw: function () {
      var s = t(120, 26, '시간으로 센다', { a: 'm', b: 1, size: 16, c: C.red }) + t(360, 26, '리밋스위치로 확인', { a: 'm', b: 1, size: 16, c: C.green });
      s += divider(240, 14, 210);
      s += cylH(30, 86, 80, 26) + lsMark(190, 66, 'LS2', false, { up: 1 });
      s += F.circle(70, 132, 16, { fill: C.paper, c: C.red, w: 1.8 }) + line(70, 132, 70, 122, { c: C.red, w: 1.8 }) + line(70, 132, 78, 136, { c: C.red, w: 1.8 });
      s += t(94, 132, '2초 지났으니 끝났겠지', { size: 13, c: C.red });
      s += t(120, 172, '압력이 약하면 아직 덜 갔는데', { a: 'm', size: 13, c: C.sub }) + t(120, 192, '다음 동작 → 충돌', { a: 'm', size: 14, b: 1, c: C.red });
      s += cylH(270, 86, 80, 76) + lsMark(430, 66, 'LS2', true, { up: 1 });
      s += t(360, 132, '끝에 닿아 LS2 가 켜져야', { a: 'm', size: 13, c: C.green });
      s += t(360, 172, '실제로 도착했는지 확인', { a: 'm', size: 13, c: C.sub }) + t(360, 192, '그다음에 넘어간다', { a: 'm', size: 14, b: 1, c: C.green });
      return F.svg(480, 212, s);
    } },

  disp: { cap: '변위단계선도 — 가로는 단계(1~9), 세로는 실린더 위치(0=후진·상승, 1=전진·하강) · 예시 선도',
    draw: function () {
      var L = 110, R = 462, top = 40, rowH = 50, N = 9, s = '';
      function x(k) { return L + (k - 1) * ((R - L) / (N - 1)); }
      var rows = [{ n: '공급실린더', e: [[1, 1], [3, 0]] }, { n: '가공실린더', e: [[3, 1], [6, 0]] }, { n: '송출실린더', e: [[6, 1], [8, 0]] }];
      for (var k = 1; k <= N; k++) {
        s += line(x(k), top - 6, x(k), top + rows.length * rowH, { c: C.edge, w: 1.2 });
        s += t(x(k), top - 16, k === N ? '9=1' : String(k), { a: 'm', size: 13, c: C.sub });
      }
      rows.forEach(function (r, ri) {
        var y0 = top + ri * rowH + 38, y1 = top + ri * rowH + 10, cur = 0, pts = [[x(1), y0]];
        s += t(L - 22, (y0 + y1) / 2, r.n, { a: 'e', b: 1, size: 14 });
        s += t(L - 8, y1, '1', { a: 'e', size: 12, c: C.sub }) + t(L - 8, y0, '0', { a: 'e', size: 12, c: C.sub });
        r.e.forEach(function (e) { pts.push([x(e[0]), cur ? y1 : y0]); pts.push([x(e[0] + 1), e[1] ? y1 : y0]); cur = e[1]; });
        pts.push([x(N), cur ? y1 : y0]);
        s += F.poly(pts, { c: C.blue, w: 2.6 });
      });
      var yb = top + rows.length * rowH;
      s += t(286, yb + 24, '선이 올라가는 구간 = 전진(하강) · 내려가는 구간 = 후진(상승)', { a: 'm', b: 1, size: 13 });
      return F.svg(480, yb + 44, s);
    } }

  };
})();
