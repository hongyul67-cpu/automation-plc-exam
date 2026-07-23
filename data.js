/* 자동화설비기능사 [시험2] PLC제어작업 - 공개문제 데이터
   출처: 한국산업인력공단 공개문제 「자동화설비기능사(공개문제)_시험2_PLC제어작업」
   공정순서도(7-4쪽)를 그대로 옮긴 것. 문제 추가 시 이 배열에만 항목을 넣으면 됨. */

/* 설비 I/O 할당표 (7-7쪽 [표 1]) — 주소는 수험자가 배정하는 항목이라 비워 둠 */
window.IO_TABLE = {
  in: [
    { sym: 'LS1', fn: '공급실린더 후진' },
    { sym: 'LS2', fn: '공급실린더 전진' },
    { sym: 'LS3', fn: '가공실린더 상승' },
    { sym: 'LS4', fn: '가공실린더 하강' },
    { sym: 'LS5', fn: '송출실린더 후진' },
    { sym: 'LS6', fn: '송출실린더 전진' },
    { sym: 'LS7', fn: '배출실린더 후진' },
    { sym: 'LS8', fn: '배출실린더 전진' },
    { sym: 'S1', fn: '매거진 적재 감지' },
    { sym: 'S2', fn: '이송 감지' },
    /* 공개문제 표기는 S3 '비금속 감지' / S4 '금속 감지'지만, 실제 센서는
       S3=유도형(금속만), S4=정전용량형(전부)이라 아래처럼 쓴다. 배우기에서 이 차이를 짚는다. */
    { sym: 'S3', fn: '금속 감지 (유도형)' },
    { sym: 'S4', fn: '공작물 감지 (정전용량형 · 재질 무관)' },
    { sym: 'SW1', fn: 'PB1 스위치' },
    { sym: 'SW2', fn: 'PB2 스위치' },
    { sym: 'SW3', fn: 'PB3 스위치' },
    { sym: 'SW4', fn: '비상정지 스위치' }
  ],
  out: [
    { sym: 'SOL1', fn: '공급실린더 전진' },
    { sym: 'SOL2', fn: '공급실린더 후진' },
    { sym: 'SOL3', fn: '가공실린더 동작' },
    { sym: 'SOL4', fn: '송출실린더 동작' },
    { sym: 'SOL5', fn: '배출실린더 동작' },
    { sym: 'M1', fn: '드릴' },
    { sym: 'M2', fn: '컨베이어' },
    { sym: 'PL1', fn: '적색 램프' },
    { sym: 'PL2', fn: '황색 램프' },
    { sym: 'PL3', fn: '녹색 램프' }
  ]
};

/* 공정 블록 사전: key -> 표시명 + 시뮬레이터 동작
   act: 시뮬레이터가 해석하는 동작 코드
   ls : 그 동작이 끝났음을 알려주는 리밋스위치(스텝 전환 조건) */
window.BLOCKS = {
  sup_fwd:   { t: '공급실린더 전진',   act: 'cyl', dev: 'sup',  to: 1, ls: 'LS2', sol: 'SOL1' },
  sup_bwd:   { t: '공급실린더 후진',   act: 'cyl', dev: 'sup',  to: 0, ls: 'LS1', sol: 'SOL2' },
  drill_run: { t: '가공모터 회전',     act: 'motor', dev: 'drill', on: 1, sol: 'M1' },
  drill_stop:{ t: '가공모터 정지',     act: 'motor', dev: 'drill', on: 0, sol: 'M1' },
  mach_down: { t: '가공실린더 하강',   act: 'cyl', dev: 'mach', to: 1, ls: 'LS4', sol: 'SOL3' },
  mach_up:   { t: '가공실린더 상승',   act: 'cyl', dev: 'mach', to: 0, ls: 'LS3', sol: 'SOL3' },
  push_fwd:  { t: '송출실린더 전진',   act: 'cyl', dev: 'push', to: 1, ls: 'LS6', sol: 'SOL4' },
  push_bwd:  { t: '송출실린더 후진',   act: 'cyl', dev: 'push', to: 0, ls: 'LS5', sol: 'SOL4' },
  conv_run:  { t: '컨베이어 구동',     act: 'motor', dev: 'conv', on: 1, sol: 'M2' },
  delay1:    { t: '1초 지연',          act: 'delay', sec: 1 },
  delay2:    { t: '2초 지연',          act: 'delay', sec: 2 },
  /* 한 순서도에 같은 지연이 두 번 나오는 문제가 있다(4번: 가공 전·송출 후).
     키는 달라야 하지만 학생에게는 똑같이 보이므로 채점은 표시명으로 한다. */
  delay1b:   { t: '1초 지연',          act: 'delay', sec: 1 },
  delay2b:   { t: '2초 지연',          act: 'delay', sec: 2 },
  delay3:    { t: '3초 지연',          act: 'delay', sec: 3 },
  delay3b:   { t: '3초 지연',          act: 'delay', sec: 3 }
};

/* 재질 판별 이후는 모든 문제 공통 구조(분기 방향만 다름) */
window.BRANCH_BLOCKS = {
  ej_fwd:   { t: '배출실린더 전진', act: 'cyl', dev: 'ej', to: 1, ls: 'LS8', sol: 'SOL5' },
  ej_box:   { t: '배출박스 저장',   act: 'store', box: 'eject' },
  ej_bwd:   { t: '배출실린더 후진', act: 'cyl', dev: 'ej', to: 0, ls: 'LS7', sol: 'SOL5' },
  keep_box: { t: '저장박스 저장',   act: 'store', box: 'keep' }
};

/* 기기별로 묶은 I/O — 표를 통째로 외우는 게 아니라 옆에 두고 보라고 만든 것.
   (공개문제 [표 1]은 입력/출력으로만 나뉘어 있어 기기별로 다시 묶었다) */
window.IO_GROUPS = [
  { g:'CYL1 공급실린더', note:'양솔 — 전진·후진을 각각 명령',
    rows:[['LS1','후진 완료'],['LS2','전진 완료'],['SOL1','전진'],['SOL2','후진']] },
  { g:'CYL2 가공실린더 + 드릴', note:'편솔 — SOL3을 끊으면 상승',
    rows:[['LS3','상승 완료'],['LS4','하강 완료'],['SOL3','하강'],['M1','드릴']] },
  { g:'CYL3 송출실린더', note:'편솔 — SOL4를 끊으면 후진',
    rows:[['LS5','후진 완료'],['LS6','전진 완료'],['SOL4','전진']] },
  { g:'CYL4 배출실린더', note:'편솔 — SOL5를 끊으면 후진',
    rows:[['LS7','후진 완료'],['LS8','전진 완료'],['SOL5','전진']] },
  /* S3·S4는 공개문제 표기(S3 비금속·S4 금속)와 실제 동작이 다르다.
     S3은 유도형이라 금속만 잡고, S4는 정전용량형이라 재질 상관없이 전부 잡는다.
     그래서 금속 = S3, 비금속 = S4·S3̄ 로 판별하고, 개수 세기는 S4로 한다. */
  { g:'센서', note:'금속 = S3 / 비금속 = S4·S3̄',
    rows:[['S1','매거진 공작물'],['S2','이송 감지'],['S3','금속만 (유도형)'],['S4','전부 (정전용량형)']] },
  { g:'스위치', note:'',
    rows:[['SW1','PB1'],['SW2','PB2'],['SW3','PB3'],['SW4','비상정지']] },
  { g:'그 외 출력', note:'',
    rows:[['M2','컨베이어'],['PL1','적색 램프'],['PL2','황색 램프'],['PL3','녹색 램프']] }
];

/* 스텝 전환조건으로 고를 수 있는 신호 (3단계 래더 변환) */
window.SIGNALS = {
  'PB1':  '테스트동작 시작 스위치',
  'PB2':  '단속동작 시작 스위치',
  'S1':   '매거진 공작물 감지',
  'S3':   '금속 감지 (유도형)',
  'S4':   '공작물 감지 (재질 무관)',
  'LS1':  '공급실린더 후진 완료',
  'LS2':  '공급실린더 전진 완료',
  'LS3':  '가공실린더 상승 완료',
  'LS4':  '가공실린더 하강 완료',
  'LS5':  '송출실린더 후진 완료',
  'LS6':  '송출실린더 전진 완료',
  'LS7':  '배출실린더 후진 완료',
  'LS8':  '배출실린더 전진 완료',
  'T1.Q': '타이머 T1 경과',
  'T2.Q': '타이머 T2 경과',
  'T3.Q': '타이머 T3 경과'
};

/* 스텝 시퀀스 (선생님 노션 방식)
   규칙: (전환조건 + An) · A(n-1) → An   /  마지막 스텝이 A1을 끊어 연쇄 정지
   ※ 문제1의 A1~A7은 선생님 노션 래더와 대조하여 확인함.
     문제2·3은 공정순서도에서 같은 규칙으로 유도한 것이라 검수 필요.
   cond  : 전환조건(2개면 직렬 AND)
   drive : 이 스텝이 구동하는 것(구동부) — 편솔은 스텝이 끊기면 스프링으로 복귀
   timer : 이 스텝이 起動하는 타이머
   flow  : 이 스텝이 담당하는 공정순서도 블록(3단계 참고 패널에서 '지금 여기' 표시용) */
window.STEPS = {
  1: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['M1 가공모터 회전'], timer:{name:'T2', pt:'T#1S'}, flow:['drill_run','delay1'] },
    { id:'A3',  cond:['T2.Q'],     drive:['SOL3 가공실린더 하강'], flow:['mach_down'] },
    { id:'A4',  cond:['LS4'],      drive:[], timer:{name:'T3', pt:'T#2S'}, flow:['delay2'] },
    { id:'A5',  cond:['T3.Q'],     drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A6',  cond:['LS3'],      drive:['M1 정지','SOL2 공급실린더 후진'], flow:['drill_stop','sup_bwd'] },
    { id:'A7',  cond:['LS1'],      drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:['M2 컨베이어 구동'], flow:['conv_run'] },
    /* 금속 = S3 (유도형이 잡음) */
    { id:'A10', cond:['S3'],       drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  2: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:[], timer:{name:'T2', pt:'T#1S'}, flow:['delay1'] },
    { id:'A3',  cond:['T2.Q'],     drive:['M1 가공모터 회전','SOL3 가공실린더 하강'], flow:['drill_run','mach_down'] },
    { id:'A4',  cond:['LS4'],      drive:[], timer:{name:'T3', pt:'T#2S'}, flow:['delay2'] },
    { id:'A5',  cond:['T3.Q'],     drive:['M1 정지','SOL2 공급실린더 후진'], flow:['drill_stop','sup_bwd'] },
    { id:'A6',  cond:['LS1'],      drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A7',  cond:['LS3'],      drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:['M2 컨베이어 구동'], flow:['conv_run'] },
    /* 금속 = S3. 노션 A1 rung이 A12̄로 끊는 것에 맞춰 배출후진(A11)과 컨베이어 정지(A12)를 나눔 */
    { id:'A10', cond:['S3'],       drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  3: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['SOL2 공급실린더 후진'], flow:['sup_bwd'] },
    { id:'A3',  cond:['LS1'],      drive:['M1 가공모터 회전','SOL3 가공실린더 하강'], flow:['drill_run','mach_down'] },
    { id:'A4',  cond:['LS4'],      drive:[], timer:{name:'T2', pt:'T#1S'}, flow:['delay1'] },
    { id:'A5',  cond:['T2.Q'],     drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A6',  cond:['LS3'],      drive:['M1 정지'], timer:{name:'T3', pt:'T#2S'}, flow:['drill_stop','delay2'] },
    { id:'A7',  cond:['T3.Q'],     drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:['M2 컨베이어 구동'], flow:['conv_run'] },
    /* 3번은 비금속을 배출박스로 보낸다 → 비금속 = S4·S3̄ (전부 잡히는데 금속은 아님) */
    { id:'A10', cond:['S4','!S3'], drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  4: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['M1 가공모터 회전'], timer:{name:'T2', pt:'T#2S'}, flow:['drill_run','delay2'] },
    { id:'A3',  cond:['T2.Q'],     drive:['SOL3 가공실린더 하강'], flow:['mach_down'] },
    /* 하강 완료 즉시 상승 — 사이에 지연이 없다 */
    { id:'A4',  cond:['LS4'],      drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A5',  cond:['LS3'],      drive:['M1 정지','SOL2 공급실린더 후진'], flow:['drill_stop','sup_bwd'] },
    { id:'A6',  cond:['LS1'],      drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A7',  cond:['LS6'],      drive:[], timer:{name:'T3', pt:'T#2S'}, flow:['delay2b'] },
    { id:'A8',  cond:['T3.Q'],     drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:['M2 컨베이어 구동'], flow:['conv_run'] },
    { id:'A10', cond:['S4','!S3'], drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  5: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['SOL2 공급실린더 후진'], flow:['sup_bwd'] },
    /* 5번은 가공실린더가 먼저 내려가고 그다음 드릴이 돈다 */
    { id:'A3',  cond:['LS1'],      drive:['SOL3 가공실린더 하강'], flow:['mach_down'] },
    { id:'A4',  cond:['LS4'],      drive:['M1 가공모터 회전'], timer:{name:'T2', pt:'T#2S'}, flow:['drill_run','delay2'] },
    { id:'A5',  cond:['T2.Q'],     drive:['M1 정지'], timer:{name:'T3', pt:'T#2S'}, flow:['drill_stop','delay2b'] },
    { id:'A6',  cond:['T3.Q'],     drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A7',  cond:['LS3'],      drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:['M2 컨베이어 구동'], flow:['conv_run'] },
    { id:'A10', cond:['S4','!S3'], drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  6: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['M1 가공모터 회전'], timer:{name:'T2', pt:'T#2S'}, flow:['drill_run','delay2'] },
    { id:'A3',  cond:['T2.Q'],     drive:['SOL3 가공실린더 하강'], flow:['mach_down'] },
    { id:'A4',  cond:['LS4'],      drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A5',  cond:['LS3'],      drive:['M1 정지','SOL2 공급실린더 후진'], flow:['drill_stop','sup_bwd'] },
    { id:'A6',  cond:['LS1'],      drive:[], timer:{name:'T3', pt:'T#2S'}, flow:['delay2b'] },
    { id:'A7',  cond:['T3.Q'],     drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:['M2 컨베이어 구동'], flow:['conv_run'] },
    { id:'A10', cond:['S3'],       drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  7: [
    /* 7번은 가공모터가 맨 먼저 돈다 — 공급실린더 전진과 사이에 조건이 없어 한 스텝이 둘을 맡는다 */
    { id:'A1',  cond:['PB2','S1'], drive:['M1 가공모터 회전','SOL1 공급실린더 전진'], flow:['drill_run','sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:[], timer:{name:'T2', pt:'T#1S'}, flow:['delay1'] },
    { id:'A3',  cond:['T2.Q'],     drive:['SOL3 가공실린더 하강'], flow:['mach_down'] },
    { id:'A4',  cond:['LS4'],      drive:[], timer:{name:'T3', pt:'T#3S'}, flow:['delay3'] },
    { id:'A5',  cond:['T3.Q'],     drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A6',  cond:['LS3'],      drive:['M1 정지','SOL2 공급실린더 후진'], flow:['drill_stop','sup_bwd'] },
    { id:'A7',  cond:['LS1'],      drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:['M2 컨베이어 구동'], flow:['conv_run'] },
    { id:'A10', cond:['S3'],       drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  /* 8번은 컨베이어가 송출실린더보다 먼저 돈다(A6). 노션이 A12 체인임을 확인해 줌 */
  8: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['SOL2 공급실린더 후진'], flow:['sup_bwd'] },
    { id:'A3',  cond:['LS1'],      drive:['M1 가공모터 구동','SOL3 가공실린더 하강'], flow:['drill_run','mach_down'] },
    { id:'A4',  cond:['LS4'],      drive:[], timer:{name:'T2', pt:'T#3S'}, flow:['delay3'] },
    { id:'A5',  cond:['T2.Q'],     drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A6',  cond:['LS3'],      drive:['M1 정지','M2 컨베이어 구동'], timer:{name:'T3', pt:'T#2S'}, flow:['drill_stop','conv_run','delay2'] },
    { id:'A7',  cond:['T3.Q'],     drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    /* 컨베이어는 이미 돌고 있으므로 이 스텝은 송출 후진만 확인하고 판별을 기다린다 */
    { id:'A9',  cond:['LS5'],      drive:[], flow:[] },
    { id:'A10', cond:['S4','!S3'], drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  /* 9번도 컨베이어가 송출보다 먼저 돈다(A7). 부가1이 가공모터~가공상승 2회 반복 */
  9: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['SOL2 공급실린더 후진'], flow:['sup_bwd'] },
    { id:'A3',  cond:['LS1'],      drive:[], timer:{name:'T2', pt:'T#2S'}, flow:['delay2'] },
    { id:'A4',  cond:['T2.Q'],     drive:['M1 가공모터 회전','SOL3 가공실린더 하강'], flow:['drill_run','mach_down'] },
    { id:'A5',  cond:['LS4'],      drive:[], timer:{name:'T3', pt:'T#3S'}, flow:['delay3'] },
    { id:'A6',  cond:['T3.Q'],     drive:['M1 정지','SOL3 OFF → 가공실린더 상승'], flow:['drill_stop','mach_up'] },
    { id:'A7',  cond:['LS3'],      drive:['M2 컨베이어 구동','SOL4 송출실린더 전진'], flow:['conv_run','push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:[], flow:[] },
    { id:'A10', cond:['S3'],       drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  10: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:[], timer:{name:'T2', pt:'T#1S'}, flow:['delay1'] },
    { id:'A3',  cond:['T2.Q'],     drive:['SOL2 공급실린더 후진'], flow:['sup_bwd'] },
    { id:'A4',  cond:['LS1'],      drive:['M1 가공모터 회전','SOL3 가공실린더 하강'], flow:['drill_run','mach_down'] },
    { id:'A5',  cond:['LS4'],      drive:[], timer:{name:'T3', pt:'T#3S'}, flow:['delay3'] },
    { id:'A6',  cond:['T3.Q'],     drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A7',  cond:['LS3'],      drive:['M1 정지','M2 컨베이어 구동','SOL4 송출실린더 전진'], flow:['drill_stop','conv_run','push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:[], flow:[] },
    { id:'A10', cond:['S3'],       drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  /* 11번은 컨베이어가 송출 전진 뒤·후진 앞에 들어간다(A7) */
  11: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['M1 가공모터 회전','SOL3 가공실린더 하강'], flow:['drill_run','mach_down'] },
    { id:'A3',  cond:['LS4'],      drive:[], timer:{name:'T2', pt:'T#3S'}, flow:['delay3'] },
    { id:'A4',  cond:['T2.Q'],     drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A5',  cond:['LS3'],      drive:['M1 정지','SOL2 공급실린더 후진'], flow:['drill_stop','sup_bwd'] },
    { id:'A6',  cond:['LS1'],      drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A7',  cond:['LS6'],      drive:['M2 컨베이어 구동'], timer:{name:'T3', pt:'T#1S'}, flow:['conv_run','delay1'] },
    { id:'A8',  cond:['T3.Q'],     drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:[], flow:[] },
    { id:'A10', cond:['S3'],       drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  12: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['M1 가공모터 회전','SOL3 가공실린더 하강'], flow:['drill_run','mach_down'] },
    { id:'A3',  cond:['LS4'],      drive:[], timer:{name:'T2', pt:'T#3S'}, flow:['delay3'] },
    { id:'A4',  cond:['T2.Q'],     drive:['M1 정지','SOL3 OFF → 가공실린더 상승'], flow:['drill_stop','mach_up'] },
    { id:'A5',  cond:['LS3'],      drive:['SOL2 공급실린더 후진'], flow:['sup_bwd'] },
    { id:'A6',  cond:['LS1'],      drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A7',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A8',  cond:['LS5'],      drive:[], timer:{name:'T3', pt:'T#2S'}, flow:['delay2'] },
    { id:'A9',  cond:['T3.Q'],     drive:['M2 컨베이어 구동'], flow:['conv_run'] },
    { id:'A10', cond:['S3'],       drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  /* 14번 A체인은 순서도상 1번과 동일 구조(반복만 없음) */
  14: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['M1 가공모터 회전'], timer:{name:'T2', pt:'T#1S'}, flow:['drill_run','delay1'] },
    { id:'A3',  cond:['T2.Q'],     drive:['SOL3 가공실린더 하강'], flow:['mach_down'] },
    { id:'A4',  cond:['LS4'],      drive:[], timer:{name:'T3', pt:'T#2S'}, flow:['delay2'] },
    { id:'A5',  cond:['T3.Q'],     drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A6',  cond:['LS3'],      drive:['M1 정지','SOL2 공급실린더 후진'], flow:['drill_stop','sup_bwd'] },
    { id:'A7',  cond:['LS1'],      drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:['M2 컨베이어 구동'], flow:['conv_run'] },
    { id:'A10', cond:['S3'],       drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  /* 15번 A체인도 1번과 동일 구조 */
  15: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['M1 가공모터 회전'], timer:{name:'T2', pt:'T#1S'}, flow:['drill_run','delay1'] },
    { id:'A3',  cond:['T2.Q'],     drive:['SOL3 가공실린더 하강'], flow:['mach_down'] },
    { id:'A4',  cond:['LS4'],      drive:[], timer:{name:'T3', pt:'T#2S'}, flow:['delay2'] },
    { id:'A5',  cond:['T3.Q'],     drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A6',  cond:['LS3'],      drive:['M1 정지','SOL2 공급실린더 후진'], flow:['drill_stop','sup_bwd'] },
    { id:'A7',  cond:['LS1'],      drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:['M2 컨베이어 구동'], flow:['conv_run'] },
    { id:'A10', cond:['S3'],       drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  16: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:[], timer:{name:'T2', pt:'T#2S'}, flow:['delay2'] },
    { id:'A3',  cond:['T2.Q'],     drive:['SOL2 공급실린더 후진'], flow:['sup_bwd'] },
    { id:'A4',  cond:['LS1'],      drive:['M1 가공모터 회전','SOL3 가공실린더 하강'], flow:['drill_run','mach_down'] },
    { id:'A5',  cond:['LS4'],      drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A6',  cond:['LS3'],      drive:['M1 정지'], timer:{name:'T3', pt:'T#2S'}, flow:['drill_stop','delay2b'] },
    { id:'A7',  cond:['T3.Q'],     drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:['M2 컨베이어 구동'], flow:['conv_run'] },
    { id:'A10', cond:['S4','!S3'], drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  /* 17번은 가공하강과 가공모터회전이 한 스텝(A4) — 눌러 내리며 드릴 회전 */
  17: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['SOL2 공급실린더 후진'], flow:['sup_bwd'] },
    { id:'A3',  cond:['LS1'],      drive:[], timer:{name:'T2', pt:'T#2S'}, flow:['delay2'] },
    { id:'A4',  cond:['T2.Q'],     drive:['SOL3 가공실린더 하강','M1 가공모터 회전'], flow:['mach_down','drill_run'] },
    { id:'A5',  cond:['LS4'],      drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A6',  cond:['LS3'],      drive:['M1 정지','SOL4 송출실린더 전진'], flow:['drill_stop','push_fwd'] },
    { id:'A7',  cond:['LS6'],      drive:[], timer:{name:'T3', pt:'T#2S'}, flow:['delay2b'] },
    { id:'A8',  cond:['T3.Q'],     drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:['M2 컨베이어 구동'], flow:['conv_run'] },
    { id:'A10', cond:['S3'],       drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  /* 18번은 컨베이어가 맨 처음 돈다(A1) — 사이클 내내 구동, A12에서 정지 */
  18: [
    { id:'A1',  cond:['PB2','S1'], drive:['M2 컨베이어 구동','SOL1 공급실린더 전진'], flow:['conv_run','sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:[], timer:{name:'T2', pt:'T#1S'}, flow:['delay1'] },
    { id:'A3',  cond:['T2.Q'],     drive:['M1 가공모터 회전','SOL3 가공실린더 하강'], flow:['drill_run','mach_down'] },
    { id:'A4',  cond:['LS4'],      drive:[], timer:{name:'T3', pt:'T#2S'}, flow:['delay2'] },
    { id:'A5',  cond:['T3.Q'],     drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A6',  cond:['LS3'],      drive:['M1 정지','SOL2 공급실린더 후진'], flow:['drill_stop','sup_bwd'] },
    { id:'A7',  cond:['LS1'],      drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:[], flow:[] },
    { id:'A10', cond:['S4','!S3'], drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  /* 19번도 컨베이어가 맨 처음(A1). 안쪽 2초 지연이 기본 포함이라 A12 — 노션이 A5→A6로 확인 */
  19: [
    { id:'A1',  cond:['PB2','S1'], drive:['M2 컨베이어 구동','SOL1 공급실린더 전진'], flow:['conv_run','sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['M1 가공모터 회전'], timer:{name:'T2', pt:'T#2S'}, flow:['drill_run','delay2'] },
    { id:'A3',  cond:['T2.Q'],     drive:['SOL3 가공실린더 하강'], flow:['mach_down'] },
    { id:'A4',  cond:['LS4'],      drive:[], timer:{name:'T3', pt:'T#2S'}, flow:['delay2b'] },
    { id:'A5',  cond:['T3.Q'],     drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A6',  cond:['LS3'],      drive:['M1 정지','SOL2 공급실린더 후진'], flow:['drill_stop','sup_bwd'] },
    { id:'A7',  cond:['LS1'],      drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:[], flow:[] },
    { id:'A10', cond:['S4','!S3'], drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  /* 20번: 가공을 먼저 하고 컨베이어는 공급후진 뒤에 켠다(A7). 안쪽 3초가 기본 포함이라 A12 */
  20: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['M1 가공모터 회전'], timer:{name:'T2', pt:'T#1S'}, flow:['drill_run','delay1'] },
    { id:'A3',  cond:['T2.Q'],     drive:['SOL3 가공실린더 하강'], flow:['mach_down'] },
    { id:'A4',  cond:['LS4'],      drive:[], timer:{name:'T3', pt:'T#3S'}, flow:['delay3'] },
    { id:'A5',  cond:['T3.Q'],     drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A6',  cond:['LS3'],      drive:['M1 정지','SOL2 공급실린더 후진'], flow:['drill_stop','sup_bwd'] },
    { id:'A7',  cond:['LS1'],      drive:['M2 컨베이어 구동','SOL4 송출실린더 전진'], flow:['conv_run','push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:[], flow:[] },
    { id:'A10', cond:['S3'],       drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ],
  /* 13번도 다른 반복 문제(1·9·11·19·20번)와 같은 A12 구조 — 원본 순서도의
     "3회 반복(부가조건2)" 점선박스 안에 하강→2초지연→상승이 있다(지연이 순서도 자체에 있음). */
  13: [
    { id:'A1',  cond:['PB2','S1'], drive:['SOL1 공급실린더 전진'], flow:['sup_fwd'] },
    { id:'A2',  cond:['LS2'],      drive:['M1 가공모터 회전','SOL3 가공실린더 하강'], flow:['drill_run','mach_down'] },
    { id:'A3',  cond:['LS4'],      drive:[], timer:{name:'T2', pt:'T#2S'}, flow:['delay2b'] },
    { id:'A4',  cond:['T2.Q'],     drive:['SOL3 OFF → 가공실린더 상승'], flow:['mach_up'] },
    { id:'A5',  cond:['LS3'],      drive:['M1 정지'], timer:{name:'T3', pt:'T#2S'}, flow:['drill_stop','delay2'] },
    { id:'A6',  cond:['T3.Q'],     drive:['SOL2 공급실린더 후진'], flow:['sup_bwd'] },
    { id:'A7',  cond:['LS1'],      drive:['SOL4 송출실린더 전진'], flow:['push_fwd'] },
    { id:'A8',  cond:['LS6'],      drive:['SOL4 OFF → 송출실린더 후진'], flow:['push_bwd'] },
    { id:'A9',  cond:['LS5'],      drive:['M2 컨베이어 구동'], flow:['conv_run'] },
    { id:'A10', cond:['S3'],       drive:['SOL5 배출실린더 전진'], flow:[] },
    { id:'A11', cond:['LS8'],      drive:['SOL5 OFF → 배출실린더 후진'], flow:[] },
    { id:'A12', cond:['LS7'],      drive:['M2 정지'], flow:[] }
  ]
};

/* ── 테스트동작 ────────────────────────────────────────────────
   변위단계선도(공개문제 7-2쪽)와 B1~B9 스텝.
   테스트동작이 되지 않는 작품은 실격이라, 시험장에서 가장 먼저 만드는 부분.

   DISP: 선도 그림 데이터.  e:[[at,to]] = at단계에서 to(0/1)로 넘어가기 시작(at+1에 도달)
         lamp 행의 on:[[a,b]] = a단계부터 b단계까지 점등
   ※ 문제1의 B체인은 선생님 노션 래더와 변위단계선도 양쪽에서 확인함(완전 일치).
     문제2·3은 선도에서 같은 규칙으로 유도한 것이라 검수 필요. */
window.DISP = {
  1: { rows:[
    { n:'공급실린더', e:[[7,1],[8,0]] },
    { n:'가공실린더', e:[[1,1],[6,0]] },
    { n:'송출실린더', e:[[3,1],[5,0]], note:{at:4, t:'2초'} },
    { n:'배출실린더', e:[[2,1],[5,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[7,9]] },
    { n:'녹색램프', lamp:1, on:[[4,5]] }
  ]},
  2: { rows:[
    { n:'공급실린더', e:[[2,1],[4,0]], note:{at:3, t:'3초'} },
    { n:'가공실린더', e:[[5,1],[7,0]] },
    { n:'송출실린더', e:[[1,1],[8,0]] },
    { n:'배출실린더', e:[[6,1],[7,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[5,8]] },
    { n:'녹색램프', lamp:1, on:[[3,4]] }
  ]},
  3: { rows:[
    { n:'공급실린더', e:[[1,1],[8,0]] },
    { n:'가공실린더', e:[[6,1],[8,0]] },
    { n:'송출실린더', e:[[2,1],[4,0]], note:{at:3, t:'3초'} },
    { n:'배출실린더', e:[[5,1],[7,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[3,4]] },
    { n:'녹색램프', lamp:1, on:[[5,8]] }
  ]},
  4: { rows:[
    { n:'공급실린더', e:[[1,1],[2,0]] },
    { n:'가공실린더', e:[[2,1],[6,0]] },
    { n:'송출실린더', e:[[3,1],[5,0]], note:{at:4, t:'2초'} },
    { n:'배출실린더', e:[[7,1],[8,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[4,5]] },
    { n:'녹색램프', lamp:1, on:[[1,3]] }
  ]},
  5: { rows:[
    { n:'공급실린더', e:[[1,1],[4,0]] },
    { n:'가공실린더', e:[[3,1],[4,0]] },
    { n:'송출실린더', e:[[2,1],[8,0]] },
    { n:'배출실린더', e:[[5,1],[7,0]], note:{at:6, t:'3초'} },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[3,5]] },
    { n:'녹색램프', lamp:1, on:[[6,7]] }
  ]},
  6: { rows:[
    { n:'공급실린더', e:[[7,1],[8,0]] },
    { n:'가공실린더', e:[[5,1],[7,0]] },
    { n:'송출실린더', e:[[4,1],[6,0]] },
    { n:'배출실린더', e:[[1,1],[3,0]], note:{at:2, t:'3초'} },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[2,3]] },
    { n:'녹색램프', lamp:1, on:[[5,8]] }
  ]},
  7: { rows:[
    { n:'공급실린더', e:[[1,1],[8,0]] },
    { n:'가공실린더', e:[[3,1],[7,0]], note:{at:4, t:'2초'} },
    { n:'송출실린더', e:[[2,1],[6,0]] },
    { n:'배출실린더', e:[[2,1],[5,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[2,6]] },
    { n:'녹색램프', lamp:1, on:[[4,5]] }
  ]},
  8: { rows:[
    { n:'공급실린더', e:[[1,1],[7,0]] },
    { n:'가공실린더', e:[[4,1],[6,0]], note:{at:5, t:'2초'} },
    { n:'송출실린더', e:[[2,1],[3,0]] },
    { n:'배출실린더', e:[[2,1],[8,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[5,6]] },
    { n:'녹색램프', lamp:1, on:[[2,4]] }
  ]},
  9: { rows:[
    { n:'공급실린더', e:[[1,1],[3,0]], note:{at:2, t:'3초'} },
    { n:'가공실린더', e:[[4,1],[5,0]] },
    { n:'송출실린더', e:[[1,1],[6,0]] },
    { n:'배출실린더', e:[[7,1],[8,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[4,6]] },
    { n:'녹색램프', lamp:1, on:[[2,3]] }
  ]},
  10: { rows:[
    { n:'공급실린더', e:[[3,1],[6,0]], note:{at:5, t:'2초'} },
    { n:'가공실린더', e:[[2,1],[4,0]] },
    { n:'송출실린더', e:[[4,1],[7,0]] },
    { n:'배출실린더', e:[[1,1],[8,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[5,6]] },
    { n:'녹색램프', lamp:1, on:[[3,7]] }
  ]},
  11: { rows:[
    { n:'공급실린더', e:[[1,1],[2,0]] },
    { n:'가공실린더', e:[[3,1],[4,0]] },
    { n:'송출실린더', e:[[1,1],[8,0]] },
    { n:'배출실린더', e:[[5,1],[7,0]], note:{at:6, t:'2초'} },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[6,7]] },
    { n:'녹색램프', lamp:1, on:[[3,5]] }
  ]},
  12: { rows:[
    { n:'공급실린더', e:[[1,1],[8,0]], note:{at:6, t:'3초'} },
    { n:'가공실린더', e:[[2,1],[7,0]] },
    { n:'송출실린더', e:[[3,1],[8,0]] },
    { n:'배출실린더', e:[[4,1],[5,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[6,7]] },
    { n:'녹색램프', lamp:1, on:[[2,8]] }
  ]},
  13: { rows:[
    { n:'공급실린더', e:[[1,1],[3,0]] },
    { n:'가공실린더', e:[[2,1],[4,0]] },
    { n:'송출실린더', e:[[5,1],[7,0]], note:{at:6, t:'2초'} },
    { n:'배출실린더', e:[[5,1],[8,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[6,7]] },
    { n:'녹색램프', lamp:1, on:[[1,4]] }
  ]},
  14: { rows:[
    { n:'공급실린더', e:[[1,1],[3,0]] },
    { n:'가공실린더', e:[[2,1],[4,0]] },
    { n:'송출실린더', e:[[6,1],[8,0]], note:{at:7, t:'2초'} },
    { n:'배출실린더', e:[[7,1],[8,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[7,9]] },
    { n:'녹색램프', lamp:1, on:[[5,6]] }
  ]},
  15: { rows:[
    { n:'공급실린더', e:[[1,1],[2,0]] },
    { n:'가공실린더', e:[[5,1],[6,0]] },
    { n:'송출실린더', e:[[3,1],[4,0]] },
    { n:'배출실린더', e:[[7,1],[8,0]], note:{at:8, t:'2초'} },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[7,8]] },
    { n:'녹색램프', lamp:1, on:[[3,9]] }
  ]},
  16: { rows:[
    { n:'공급실린더', e:[[1,1],[5,0]], note:{at:4, t:'3초'} },
    { n:'가공실린더', e:[[2,1],[7,0]] },
    { n:'송출실린더', e:[[3,1],[6,0]] },
    { n:'배출실린더', e:[[1,1],[8,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[4,5]] },
    { n:'녹색램프', lamp:1, on:[[2,8]] }
  ]},
  17: { rows:[
    { n:'공급실린더', e:[[1,1],[2,0]] },
    { n:'가공실린더', e:[[3,1],[6,0]], note:{at:4, t:'2초'} },
    { n:'송출실린더', e:[[1,1],[5,0]] },
    { n:'배출실린더', e:[[7,1],[8,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[4,5]] },
    { n:'녹색램프', lamp:1, on:[[1,3]] }
  ]},
  18: { rows:[
    { n:'공급실린더', e:[[1,1],[7,0]] },
    { n:'가공실린더', e:[[4,1],[6,0]], note:{at:6, t:'2초'} },
    { n:'송출실린더', e:[[3,1],[4,0]] },
    { n:'배출실린더', e:[[2,1],[8,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[3,6]] },
    { n:'녹색램프', lamp:1, on:[[6,7]] }
  ]},
  19: { rows:[
    { n:'공급실린더', e:[[1,1],[4,0]] },
    { n:'가공실린더', e:[[3,1],[4,0]] },
    { n:'송출실린더', e:[[2,1],[7,0]] },
    { n:'배출실린더', e:[[5,1],[7,0]], note:{at:6, t:'3초'} },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[3,5]] },
    { n:'녹색램프', lamp:1, on:[[6,7]] }
  ]},
  20: { rows:[
    { n:'공급실린더', e:[[4,1],[5,0]] },
    { n:'가공실린더', e:[[1,1],[3,0]], note:{at:2, t:'2초'} },
    { n:'송출실린더', e:[[1,1],[6,0]] },
    { n:'배출실린더', e:[[7,1],[8,0]] },
    { n:'적색램프', lamp:1, on:[] },
    { n:'황색램프', lamp:1, on:[[4,9]] },
    { n:'녹색램프', lamp:1, on:[[2,3]] }
  ]}
};

window.BSTEPS = {
  1: [
    { id:'B1', cond:['PB1'],       drive:['SOL3 가공실린더 하강'] },
    { id:'B2', cond:['LS4'],       drive:['SOL5 배출실린더 전진'] },
    { id:'B3', cond:['LS8'],       drive:['SOL4 송출실린더 전진'] },
    { id:'B4', cond:['LS6'],       drive:['PL3 녹색램프 점등'], timer:{name:'T1', pt:'T#2S'} },
    { id:'B5', cond:['T1.Q'],      drive:['SOL4 OFF → 송출실린더 후진','SOL5 OFF → 배출실린더 후진','PL3 소등'] },
    { id:'B6', cond:['LS5','LS7'], drive:['SOL3 OFF → 가공실린더 상승'] },
    { id:'B7', cond:['LS3'],       drive:['SOL1 공급실린더 전진','PL2 황색램프 점등'] },
    { id:'B8', cond:['LS2'],       drive:['SOL2 공급실린더 후진'] },
    { id:'B9', cond:['LS1'],       drive:['PL2 소등'] }
  ],
  2: [
    { id:'B1', cond:['PB1'],       drive:['SOL4 송출실린더 전진'] },
    { id:'B2', cond:['LS6'],       drive:['SOL1 공급실린더 전진'] },
    { id:'B3', cond:['LS2'],       drive:['PL3 녹색램프 점등'], timer:{name:'T1', pt:'T#3S'} },
    { id:'B4', cond:['T1.Q'],      drive:['SOL2 공급실린더 후진','PL3 소등'] },
    { id:'B5', cond:['LS1'],       drive:['SOL3 가공실린더 하강','PL2 황색램프 점등'] },
    { id:'B6', cond:['LS4'],       drive:['SOL5 배출실린더 전진'] },
    { id:'B7', cond:['LS8'],       drive:['SOL3 OFF → 가공실린더 상승','SOL5 OFF → 배출실린더 후진'] },
    { id:'B8', cond:['LS3','LS7'], drive:['SOL4 OFF → 송출실린더 후진','PL2 소등'] },
    { id:'B9', cond:['LS5'],       drive:[] }
  ],
  3: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진'] },
    { id:'B2', cond:['LS2'],       drive:['SOL4 송출실린더 전진'] },
    { id:'B3', cond:['LS6'],       drive:['PL2 황색램프 점등'], timer:{name:'T1', pt:'T#3S'} },
    { id:'B4', cond:['T1.Q'],      drive:['SOL4 OFF → 송출실린더 후진','PL2 소등'] },
    { id:'B5', cond:['LS5'],       drive:['SOL5 배출실린더 전진','PL3 녹색램프 점등'] },
    { id:'B6', cond:['LS8'],       drive:['SOL3 가공실린더 하강'] },
    { id:'B7', cond:['LS4'],       drive:['SOL5 OFF → 배출실린더 후진'] },
    { id:'B8', cond:['LS7'],       drive:['SOL2 공급실린더 후진','SOL3 OFF → 가공실린더 상승','PL3 소등'] },
    { id:'B9', cond:['LS1','LS3'], drive:[] }
  ],
  /* 노션 확인: YL = (B4·B5̄) + 금속 + 비금속·_T1S  /  GL = (B1·B3̄) + S1 */
  4: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진','PL3 녹색램프 점등'] },
    { id:'B2', cond:['LS2'],       drive:['SOL2 공급실린더 후진','SOL3 가공실린더 하강'] },
    { id:'B3', cond:['LS1','LS4'], drive:['SOL4 송출실린더 전진','PL3 소등'] },
    { id:'B4', cond:['LS6'],       drive:['PL2 황색램프 점등'], timer:{name:'T1', pt:'T#2S'} },
    { id:'B5', cond:['T1.Q'],      drive:['SOL4 OFF → 송출실린더 후진','PL2 소등'] },
    { id:'B6', cond:['LS5'],       drive:['SOL3 OFF → 가공실린더 상승'] },
    { id:'B7', cond:['LS3'],       drive:['SOL5 배출실린더 전진'] },
    { id:'B8', cond:['LS8'],       drive:['SOL5 OFF → 배출실린더 후진'] },
    { id:'B9', cond:['LS7'],       drive:[] }
  ],
  /* 노션 확인: GL = (B6·B7̄) + 금속·_T2S + 비금속  /  YL = (B3·B5̄) + S1̄ */
  5: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진'] },
    { id:'B2', cond:['LS2'],       drive:['SOL4 송출실린더 전진'] },
    { id:'B3', cond:['LS6'],       drive:['SOL3 가공실린더 하강','PL2 황색램프 점등'] },
    { id:'B4', cond:['LS4'],       drive:['SOL2 공급실린더 후진','SOL3 OFF → 가공실린더 상승'] },
    { id:'B5', cond:['LS1','LS3'], drive:['SOL5 배출실린더 전진','PL2 소등'] },
    { id:'B6', cond:['LS8'],       drive:['PL3 녹색램프 점등'], timer:{name:'T1', pt:'T#3S'} },
    { id:'B7', cond:['T1.Q'],      drive:['SOL5 OFF → 배출실린더 후진','PL3 소등'] },
    { id:'B8', cond:['LS7'],       drive:['SOL4 OFF → 송출실린더 후진'] },
    { id:'B9', cond:['LS5'],       drive:[] }
  ],
  /* 노션 확인: GL = (B5·B8̄) + 금속·_T2S + 비금속  /  YL = (B2·B3̄) + C2.Q·_T2S */
  6: [
    { id:'B1', cond:['PB1'],       drive:['SOL5 배출실린더 전진'] },
    { id:'B2', cond:['LS8'],       drive:['PL2 황색램프 점등'], timer:{name:'T1', pt:'T#3S'} },
    { id:'B3', cond:['T1.Q'],      drive:['SOL5 OFF → 배출실린더 후진','PL2 소등'] },
    { id:'B4', cond:['LS7'],       drive:['SOL4 송출실린더 전진'] },
    { id:'B5', cond:['LS6'],       drive:['SOL3 가공실린더 하강','PL3 녹색램프 점등'] },
    { id:'B6', cond:['LS4'],       drive:['SOL4 OFF → 송출실린더 후진'] },
    { id:'B7', cond:['LS5'],       drive:['SOL1 공급실린더 전진','SOL3 OFF → 가공실린더 상승'] },
    { id:'B8', cond:['LS2','LS3'], drive:['SOL2 공급실린더 후진','PL3 소등'] },
    { id:'B9', cond:['LS1'],       drive:[] }
  ],
  /* 노션 확인: YL = (B2·B6̄) + 부가1  /  GL = (B4·B5̄) + CM·_T1S */
  7: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진'] },
    { id:'B2', cond:['LS2'],       drive:['SOL4 송출실린더 전진','SOL5 배출실린더 전진','PL2 황색램프 점등'] },
    { id:'B3', cond:['LS6','LS8'], drive:['SOL3 가공실린더 하강'] },
    { id:'B4', cond:['LS4'],       drive:['PL3 녹색램프 점등'], timer:{name:'T1', pt:'T#2S'} },
    { id:'B5', cond:['T1.Q'],      drive:['SOL5 OFF → 배출실린더 후진','PL3 소등'] },
    { id:'B6', cond:['LS7'],       drive:['SOL4 OFF → 송출실린더 후진','PL2 소등'] },
    { id:'B7', cond:['LS5'],       drive:['SOL3 OFF → 가공실린더 상승'] },
    { id:'B8', cond:['LS3'],       drive:['SOL2 공급실린더 후진'] },
    { id:'B9', cond:['LS1'],       drive:[] }
  ],
  /* 노션 확인: GL = (B2·B4̄) + S1  /  YL = (B5·B6̄) + 부가2 */
  8: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진'] },
    { id:'B2', cond:['LS2'],       drive:['SOL4 송출실린더 전진','SOL5 배출실린더 전진','PL3 녹색램프 점등'] },
    { id:'B3', cond:['LS6','LS8'], drive:['SOL4 OFF → 송출실린더 후진'] },
    { id:'B4', cond:['LS5'],       drive:['SOL3 가공실린더 하강','PL3 소등'] },
    { id:'B5', cond:['LS4'],       drive:['PL2 황색램프 점등'], timer:{name:'T1', pt:'T#2S'} },
    { id:'B6', cond:['T1.Q'],      drive:['SOL3 OFF → 가공실린더 상승','PL2 소등'] },
    { id:'B7', cond:['LS3'],       drive:['SOL2 공급실린더 후진'] },
    { id:'B8', cond:['LS1'],       drive:['SOL5 OFF → 배출실린더 후진'] },
    { id:'B9', cond:['LS7'],       drive:[] }
  ],
  9: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진','SOL4 송출실린더 전진'] },
    { id:'B2', cond:['LS2','LS6'], drive:['PL3 녹색램프 점등'], timer:{name:'T1', pt:'T#3S'} },
    { id:'B3', cond:['T1.Q'],      drive:['SOL2 공급실린더 후진','PL3 소등'] },
    { id:'B4', cond:['LS1'],       drive:['SOL3 가공실린더 하강','PL2 황색램프 점등'] },
    { id:'B5', cond:['LS4'],       drive:['SOL3 OFF → 가공실린더 상승'] },
    { id:'B6', cond:['LS3'],       drive:['SOL4 OFF → 송출실린더 후진','PL2 소등'] },
    { id:'B7', cond:['LS5'],       drive:['SOL5 배출실린더 전진'] },
    { id:'B8', cond:['LS8'],       drive:['SOL5 OFF → 배출실린더 후진'] },
    { id:'B9', cond:['LS7'],       drive:[] }
  ],
  /* 노션 확인: YL = (B5·B6̄) + 금속 + 비금속·_T1S  /  SOL5 = (B1·B8̄) + (A10·A11̄) + (D2·D3̄) */
  10: [
    { id:'B1', cond:['PB1'],       drive:['SOL5 배출실린더 전진'] },
    { id:'B2', cond:['LS8'],       drive:['SOL3 가공실린더 하강'] },
    { id:'B3', cond:['LS4'],       drive:['SOL1 공급실린더 전진','PL3 녹색램프 점등'] },
    { id:'B4', cond:['LS2'],       drive:['SOL3 OFF → 가공실린더 상승','SOL4 송출실린더 전진'] },
    { id:'B5', cond:['LS3','LS6'], drive:['PL2 황색램프 점등'], timer:{name:'T1', pt:'T#2S'} },
    { id:'B6', cond:['T1.Q'],      drive:['SOL2 공급실린더 후진','PL2 소등'] },
    { id:'B7', cond:['LS1'],       drive:['SOL4 OFF → 송출실린더 후진','PL3 소등'] },
    { id:'B8', cond:['LS5'],       drive:['SOL5 OFF → 배출실린더 후진'] },
    { id:'B9', cond:['LS7'],       drive:[] }
  ],
  /* 노션 확인: GL = (B3·B5̄) + S1  /  A1 = (RST·S1 + A1 + 연속)·A12̄ */
  11: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진','SOL4 송출실린더 전진'] },
    { id:'B2', cond:['LS2','LS6'], drive:['SOL2 공급실린더 후진'] },
    { id:'B3', cond:['LS1'],       drive:['SOL3 가공실린더 하강','PL3 녹색램프 점등'] },
    { id:'B4', cond:['LS4'],       drive:['SOL3 OFF → 가공실린더 상승'] },
    { id:'B5', cond:['LS3'],       drive:['SOL5 배출실린더 전진','PL3 소등'] },
    { id:'B6', cond:['LS8'],       drive:['PL2 황색램프 점등'], timer:{name:'T1', pt:'T#2S'} },
    { id:'B7', cond:['T1.Q'],      drive:['SOL5 OFF → 배출실린더 후진','PL2 소등'] },
    { id:'B8', cond:['LS7'],       drive:['SOL4 OFF → 송출실린더 후진'] },
    { id:'B9', cond:['LS5'],       drive:[] }
  ],
  /* 노션 확인: YL = (B6·B7̄) + 금속 + 비금속·_T1S  /  GL = (B2·B8̄) + S1 */
  12: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진'] },
    { id:'B2', cond:['LS2'],       drive:['SOL3 가공실린더 하강','PL3 녹색램프 점등'] },
    { id:'B3', cond:['LS4'],       drive:['SOL4 송출실린더 전진'] },
    { id:'B4', cond:['LS6'],       drive:['SOL5 배출실린더 전진'] },
    { id:'B5', cond:['LS8'],       drive:['SOL5 OFF → 배출실린더 후진'] },
    { id:'B6', cond:['LS7'],       drive:['PL2 황색램프 점등'], timer:{name:'T1', pt:'T#3S'} },
    { id:'B7', cond:['T1.Q'],      drive:['SOL3 OFF → 가공실린더 상승','PL2 소등'] },
    { id:'B8', cond:['LS3'],       drive:['SOL2 공급실린더 후진','SOL4 OFF → 송출실린더 후진','PL3 소등'] },
    { id:'B9', cond:['LS1','LS5'], drive:[] }
  ],
  13: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진','PL3 녹색램프 점등'] },
    { id:'B2', cond:['LS2'],       drive:['SOL3 가공실린더 하강'] },
    { id:'B3', cond:['LS4'],       drive:['SOL2 공급실린더 후진'] },
    { id:'B4', cond:['LS1'],       drive:['SOL3 OFF → 가공실린더 상승','PL3 소등'] },
    { id:'B5', cond:['LS3'],       drive:['SOL4 송출실린더 전진','SOL5 배출실린더 전진'] },
    { id:'B6', cond:['LS6','LS8'], drive:['PL2 황색램프 점등'], timer:{name:'T1', pt:'T#2S'} },
    { id:'B7', cond:['T1.Q'],      drive:['SOL4 OFF → 송출실린더 후진','PL2 소등'] },
    { id:'B8', cond:['LS5'],       drive:['SOL5 OFF → 배출실린더 후진'] },
    { id:'B9', cond:['LS7'],       drive:[] }
  ],
  /* 노션 확인: YL = (B7·B8̄) + 금속·_T2S + 비금속. 5→6 구간은 2초 dwell(녹색 점등) */
  14: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진'] },
    { id:'B2', cond:['LS2'],       drive:['SOL3 가공실린더 하강'] },
    { id:'B3', cond:['LS4'],       drive:['SOL2 공급실린더 후진'] },
    { id:'B4', cond:['LS1'],       drive:['SOL3 OFF → 가공실린더 상승'] },
    { id:'B5', cond:['LS3'],       drive:['PL3 녹색램프 점등'], timer:{name:'T1', pt:'T#2S'} },
    { id:'B6', cond:['T1.Q'],      drive:['SOL4 송출실린더 전진','PL3 소등'] },
    { id:'B7', cond:['LS6'],       drive:['SOL5 배출실린더 전진','PL2 황색램프 점등'] },
    { id:'B8', cond:['LS8'],       drive:['SOL4 OFF → 송출실린더 후진','SOL5 OFF → 배출실린더 후진','PL2 소등'] },
    { id:'B9', cond:['LS5','LS7'], drive:[] }
  ],
  /* 노션 확인: YL = (B7·B8̄) + 금속·_T1S + 비금속. 녹색은 3~9단계 계속 점등 */
  15: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진'] },
    { id:'B2', cond:['LS2'],       drive:['SOL2 공급실린더 후진'] },
    { id:'B3', cond:['LS1'],       drive:['SOL4 송출실린더 전진','PL3 녹색램프 점등'] },
    { id:'B4', cond:['LS6'],       drive:['SOL4 OFF → 송출실린더 후진'] },
    { id:'B5', cond:['LS5'],       drive:['SOL3 가공실린더 하강'] },
    { id:'B6', cond:['LS4'],       drive:['SOL3 OFF → 가공실린더 상승'] },
    { id:'B7', cond:['LS3'],       drive:['SOL5 배출실린더 전진','PL2 황색램프 점등'], timer:{name:'T1', pt:'T#2S'} },
    { id:'B8', cond:['T1.Q'],      drive:['SOL5 OFF → 배출실린더 후진','PL2 소등'] },
    { id:'B9', cond:['LS7'],       drive:['PL3 소등'] }
  ],
  /* 노션 확인: YL = (B4·B5̄) + 금속·_T1S + 비금속. B1이 공급·배출을 동시 전진 */
  16: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진','SOL5 배출실린더 전진'] },
    { id:'B2', cond:['LS2','LS8'], drive:['SOL3 가공실린더 하강','PL3 녹색램프 점등'] },
    { id:'B3', cond:['LS4'],       drive:['SOL4 송출실린더 전진'] },
    { id:'B4', cond:['LS6'],       drive:['PL2 황색램프 점등'], timer:{name:'T1', pt:'T#3S'} },
    { id:'B5', cond:['T1.Q'],      drive:['SOL2 공급실린더 후진','PL2 소등'] },
    { id:'B6', cond:['LS1'],       drive:['SOL4 OFF → 송출실린더 후진'] },
    { id:'B7', cond:['LS5'],       drive:['SOL3 OFF → 가공실린더 상승'] },
    { id:'B8', cond:['LS3'],       drive:['SOL5 OFF → 배출실린더 후진','PL3 소등'] },
    { id:'B9', cond:['LS7'],       drive:[] }
  ],
  /* 노션 확인: GL = (B1·B3̄) + C2.Q·_T2S + C3.Q. B1이 공급·송출 동시 전진 */
  17: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진','SOL4 송출실린더 전진','PL3 녹색램프 점등'] },
    { id:'B2', cond:['LS2','LS6'], drive:['SOL2 공급실린더 후진'] },
    { id:'B3', cond:['LS1'],       drive:['SOL3 가공실린더 하강','PL3 소등'] },
    { id:'B4', cond:['LS4'],       drive:['PL2 황색램프 점등'], timer:{name:'T1', pt:'T#2S'} },
    { id:'B5', cond:['T1.Q'],      drive:['SOL4 OFF → 송출실린더 후진','PL2 소등'] },
    { id:'B6', cond:['LS5'],       drive:['SOL3 OFF → 가공실린더 상승'] },
    { id:'B7', cond:['LS3'],       drive:['SOL5 배출실린더 전진'] },
    { id:'B8', cond:['LS8'],       drive:['SOL5 OFF → 배출실린더 후진'] },
    { id:'B9', cond:['LS7'],       drive:[] }
  ],
  /* 노션 확인: YL = (B3·B6̄) + C1.Q·C2.Q̄ + C2.Q·_T1S. B4가 가공하강·송출후진 동시 */
  18: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진'] },
    { id:'B2', cond:['LS2'],       drive:['SOL5 배출실린더 전진'] },
    { id:'B3', cond:['LS8'],       drive:['SOL4 송출실린더 전진','PL2 황색램프 점등'] },
    { id:'B4', cond:['LS6'],       drive:['SOL3 가공실린더 하강','SOL4 OFF → 송출실린더 후진'] },
    { id:'B5', cond:['LS4','LS5'], drive:[], timer:{name:'T1', pt:'T#2S'} },
    { id:'B6', cond:['T1.Q'],      drive:['SOL3 OFF → 가공실린더 상승','PL2 소등','PL3 녹색램프 점등'] },
    { id:'B7', cond:['LS3'],       drive:['SOL2 공급실린더 후진','PL3 소등'] },
    { id:'B8', cond:['LS1'],       drive:['SOL5 OFF → 배출실린더 후진'] },
    { id:'B9', cond:['LS7'],       drive:[] }
  ],
  /* 노션 확인: YL = (B3·B5̄) + 금속·_T1S + 비금속. B4가 공급후진·가공상승 동시, B7이 송출·배출 동시 후진 */
  19: [
    { id:'B1', cond:['PB1'],       drive:['SOL1 공급실린더 전진'] },
    { id:'B2', cond:['LS2'],       drive:['SOL4 송출실린더 전진'] },
    { id:'B3', cond:['LS6'],       drive:['SOL3 가공실린더 하강','PL2 황색램프 점등'] },
    { id:'B4', cond:['LS4'],       drive:['SOL2 공급실린더 후진','SOL3 OFF → 가공실린더 상승'] },
    { id:'B5', cond:['LS1','LS3'], drive:['SOL5 배출실린더 전진','PL2 소등'] },
    { id:'B6', cond:['LS8'],       drive:['PL3 녹색램프 점등'], timer:{name:'T1', pt:'T#3S'} },
    { id:'B7', cond:['T1.Q'],      drive:['SOL4 OFF → 송출실린더 후진','SOL5 OFF → 배출실린더 후진','PL3 소등'] },
    { id:'B8', cond:['LS5','LS7'], drive:[] }
  ],
  /* 노션 확인: GL = (B2·B3̄) + S1 + S1̄·_T1S  /  YL = (B4·B9̄) + 금속 + 비금속·_T1S */
  20: [
    { id:'B1', cond:['PB1'],       drive:['SOL3 가공실린더 하강','SOL4 송출실린더 전진'] },
    { id:'B2', cond:['LS4','LS6'], drive:['PL3 녹색램프 점등'], timer:{name:'T1', pt:'T#2S'} },
    { id:'B3', cond:['T1.Q'],      drive:['SOL3 OFF → 가공실린더 상승','PL3 소등'] },
    { id:'B4', cond:['LS3'],       drive:['SOL1 공급실린더 전진','PL2 황색램프 점등'] },
    { id:'B5', cond:['LS2'],       drive:['SOL2 공급실린더 후진'] },
    { id:'B6', cond:['LS1'],       drive:['SOL4 OFF → 송출실린더 후진'] },
    { id:'B7', cond:['LS5'],       drive:['SOL5 배출실린더 전진'] },
    { id:'B8', cond:['LS8'],       drive:['SOL5 OFF → 배출실린더 후진'] },
    { id:'B9', cond:['LS7'],       drive:['PL2 소등'] }
  ]
};

window.PROBLEMS = [
  {
    id: 1,
    name: '공개문제 1',
    /* 7-4쪽 공정순서도: 시작 → 공작물 유무 → (아래 순서) → 재질 판별 → 컨베이어 정지 */
    seq: ['sup_fwd', 'drill_run', 'delay1', 'mach_down', 'delay2', 'mach_up',
          'drill_stop', 'sup_bwd', 'push_fwd', 'push_bwd', 'conv_run'],
    /* 부가조건2: 가공실린더 하강~상승을 지연시간 포함 2회 반복 */
    repeat: { from: 'mach_down', to: 'mach_up', times: 2, note: '2회 반복(부가조건2)' },
    /* 배출실린더로 밀어내는 재질 (나머지 재질은 컨베이어 끝 저장박스행) */
    ejectMaterial: '금속',
    minWork: 3,
    cond: {
      add1: '매거진에 공작물이 있으면 녹색램프 점등, 없으면 소등. 재질을 판별하여 금속이면 황색램프 점등, 비금속이면 점멸(0.5초 ON/0.5초 OFF). (해당 사이클 종료 시 소등)',
      add2: '연속동작 중 가공실린더 하강·상승 동작을 지연시간을 포함하여 2회 반복.',
      add3: '비상정지를 누르면 현재 상태로 정지(실린더는 진행 중인 행정을 마치고 정지, 가공모터·컨베이어 정지), 녹색·황색램프 소등, 적색램프 점멸(0.5초). 해제하면 2초 뒤 시스템 초기화.',
      estopRelease: '2초 뒤 시스템이 초기화합니다.'
    }
  },
  {
    id: 2,
    name: '공개문제 2',
    /* 1번과 비교: 1초 지연이 가공모터 회전 앞으로, 가공실린더 상승이 공급실린더 후진 뒤로 */
    seq: ['sup_fwd', 'delay1', 'drill_run', 'mach_down', 'delay2', 'drill_stop',
          'sup_bwd', 'mach_up', 'push_fwd', 'push_bwd', 'conv_run'],
    repeat: null,
    ejectMaterial: '금속',
    minWork: 4,
    cond: {
      add1: '재질에 상관없이 판별 순서에 따라 램프 점등 — 1개: 모두 소등 / 2개: 황색 / 3개: 녹색 / 4개 이상: 녹색+황색. (연속동작 종료 시 소등)',
      add2: '재질을 판별하기 전 PB3를 누르면 금속은 저장박스에, 비금속은 배출박스에 저장. (해당 사이클에만 적용)',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(1초 ON/1초 OFF). 해제하면 시스템 초기화.',
      estopRelease: '시스템이 초기화합니다.'
    }
  },
  {
    id: 3,
    name: '공개문제 3',
    /* 공급실린더가 곧바로 후진하고, 지연 위치가 또 다름 */
    seq: ['sup_fwd', 'sup_bwd', 'drill_run', 'mach_down', 'delay1', 'mach_up',
          'drill_stop', 'delay2', 'push_fwd', 'push_bwd', 'conv_run'],
    repeat: null,
    /* 1·2번과 반대! 비금속을 배출박스로 밀어낸다 */
    ejectMaterial: '비금속',
    minWork: 3,
    cond: {
      add1: '재질을 판별하여 금속이면 황색램프 점멸(0.5초 ON/0.5초 OFF), 비금속이면 황색램프 점등. (해당 사이클 종료 시 소등)',
      add2: '재질을 판별하기 전 PB3를 누르면 녹색램프가 점등하며 금속은 배출박스에, 비금속은 저장박스에 저장. (해당 사이클에만 적용)',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(0.5초). 해제하면 적색램프 소등하고 남은 동작을 이어서 동작.',
      estopRelease: '적색램프는 소등하고 남은 동작을 이어서 동작합니다.'
    }
  },
  {
    id: 4,
    name: '공개문제 4',
    /* 2초 지연이 두 번 나온다(가공모터 회전 뒤, 송출 전진 뒤). 하강→상승 사이엔 지연이 없다 */
    seq: ['sup_fwd', 'drill_run', 'delay2', 'mach_down', 'mach_up', 'drill_stop',
          'sup_bwd', 'push_fwd', 'delay2b', 'push_bwd', 'conv_run'],
    repeat: null,
    ejectMaterial: '비금속',
    minWork: 3,
    /* 이 문제만 연속동작이 '소진까지'가 아니라 3사이클로 끝난다 */
    contCycles: 3,
    cond: {
      add1: '컨베이어에 공작물을 공급 후 재질이 금속이면 황색램프 점등, 비금속이면 점멸(0.5초 ON/0.5초 OFF). 매거진에 공작물이 있으면 녹색램프 점등, 없으면 소등.',
      add2: '연속동작 중 PB3 스위치를 누르면 재질에 관계없이 배출박스에 배출. (해당 사이클에만 적용)',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(0.5초). 해제하면 시스템이 초기화합니다.',
      estopRelease: '시스템이 초기화합니다.'
    }
  },
  {
    id: 5,
    name: '공개문제 5',
    /* 가공실린더가 먼저 하강한 뒤 드릴이 돈다 — 1~4번과 반대 */
    seq: ['sup_fwd', 'sup_bwd', 'mach_down', 'drill_run', 'delay2', 'drill_stop',
          'delay2b', 'mach_up', 'push_fwd', 'push_bwd', 'conv_run'],
    repeat: null,
    ejectMaterial: '비금속',
    minWork: 3,
    contCycles: 3,
    cond: {
      add1: '컨베이어에 공작물을 공급 후 재질이 금속이면 녹색램프 점멸(1초 ON/1초 OFF), 비금속이면 녹색램프 점등. (해당 사이클 종료 시 소등)',
      add2: '연속동작 중 매거진에 공작물이 없으면 황색램프 점등, 공작물 재투입 시 황색램프 소등.',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(1초 ON/1초 OFF). 해제하면 적색램프 소등하고 남은 동작을 이어서 동작.',
      estopRelease: '적색램프는 소등하고 남은 동작을 이어서 동작합니다.'
    }
  },
  {
    id: 6,
    name: '공개문제 6',
    seq: ['sup_fwd', 'drill_run', 'delay2', 'mach_down', 'mach_up', 'drill_stop',
          'sup_bwd', 'delay2b', 'push_fwd', 'push_bwd', 'conv_run'],
    repeat: null,
    ejectMaterial: '금속',
    minWork: 4,
    minNote: '비금속 2개 이상 포함',
    contCycles: 3,
    cond: {
      add1: '공작물 재질을 판별하여 금속이면 녹색램프 점멸(1초 ON/1초 OFF), 비금속이면 녹색램프 점등. (해당 사이클 종료 시 소등)',
      add2: '연속동작 중 저장박스에 저장된 비금속이 2개 이상이면 황색램프 점멸(1초 ON/1초 OFF).',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(1초 ON/1초 OFF). 해제하면 시스템이 초기화합니다.',
      estopRelease: '시스템이 초기화합니다.'
    }
  },
  {
    id: 7,
    name: '공개문제 7',
    /* 7번은 가공모터 회전이 공급실린더 전진보다 먼저 나온다 */
    seq: ['drill_run', 'sup_fwd', 'delay1', 'mach_down', 'delay3', 'mach_up',
          'drill_stop', 'sup_bwd', 'push_fwd', 'push_bwd', 'conv_run'],
    repeat: null,
    ejectMaterial: '금속',
    minWork: 3,
    minNote: '금속 2개 이상 포함',
    cond: {
      add1: '연속동작 중 배출박스에 저장된 금속이 2개 이상이면 황색램프 점등. (연속동작이 종료되면 소등)',
      add2: '컨베이어 구동 시 녹색램프 점멸(0.5초 ON/0.5초 OFF).',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(1초 ON/1초 OFF). 해제하면 시스템이 초기화합니다.',
      estopRelease: '시스템이 초기화합니다.'
    }
  },
  {
    id: 8,
    name: '공개문제 8',
    /* 8번은 컨베이어 구동이 송출실린더 전진보다 먼저 나온다 */
    seq: ['sup_fwd', 'sup_bwd', 'drill_run', 'mach_down', 'delay3', 'mach_up',
          'drill_stop', 'conv_run', 'delay2', 'push_fwd', 'push_bwd'],
    repeat: null,
    ejectMaterial: '비금속',
    minWork: 3,
    minNote: '비금속 2개 이상 포함',
    /* 이 문제만 PB3를 2회 눌러야 연속동작이 시작된다 */
    contStart: 'PB3 스위치를 2회',
    cond: {
      add1: '매거진에 물품이 있으면 녹색램프 점등, 없으면 소등. 연속동작 중 공작물의 재질을 판별하여 비금속이 2개 감지되면 황색램프 점등. (연속동작이 종료되면 소등)',
      add2: '컨베이어 구동 시 적색램프 점등.',
      add3: '컨베이어 구동 중 비상정지를 누르면 컨베이어가 정지하고 적색램프 점멸(0.5초 ON/0.5초 OFF). (컨베이어 구동 시에만 비상정지가 작동) 해제하면 적색램프 점멸을 종료하고 남은 동작을 이어서 동작.',
      estopRelease: '적색램프는 점멸을 종료하고 남은 동작을 이어서 동작합니다.'
    }
  },
  {
    id: 9,
    name: '공개문제 9',
    seq: ['sup_fwd', 'sup_bwd', 'delay2', 'drill_run', 'mach_down', 'delay3',
          'drill_stop', 'mach_up', 'conv_run', 'push_fwd', 'push_bwd'],
    /* 9번은 반복이 부가조건1이고, 범위가 가공모터 회전~가공실린더 상승으로 넓다 */
    repeat: { from: 'drill_run', to: 'mach_up', times: 2, note: '2회 반복(부가조건1)' },
    ejectMaterial: '금속',
    minWork: 3,
    /* 이 문제만 PB3를 2회 눌러야 연속동작이 시작된다 */
    contStart: 'PB3 스위치를 2회',
    cond: {
      add1: '"가공모터 구동"부터 "가공실린더 상승"까지의 동작이 2회 반복되도록 시스템을 구성합니다.',
      add2: '컨베이어 구동 시 황색램프 점멸(0.5초 ON/0.5초 OFF).',
      add3: '"가공모터 구동 및 가공실린더 하강 시" 비상정지를 누르면 현 상태에서 일시정지(가공모터 정지, 가공실린더가 하강상태이면 하강 유지). (그때만 작동) 해제하면 남은 동작을 이어서 동작.',
      estopRelease: '남은 동작을 이어서 동작합니다.'
    }
  },
  {
    id: 10,
    name: '공개문제 10',
    seq: ['sup_fwd', 'delay1', 'sup_bwd', 'drill_run', 'mach_down', 'delay3',
          'mach_up', 'drill_stop', 'conv_run', 'push_fwd', 'push_bwd'],
    repeat: null,
    ejectMaterial: '금속',
    minWork: 3,
    minNote: '금속 2개 이상 포함',
    /* 사이클 수도 소진도 아닌 새 종료조건 — 금속을 2개 저장하면 끝난다 */
    contUntil: '금속 공작물 2개가 저장될 때까지',
    cond: {
      add1: '매거진에 공작물이 있으면 녹색램프 점등, 없으면 점멸(0.5초 ON/0.5초 OFF).',
      add2: '공작물의 재질을 판별하여 금속이면 황색램프 점등, 비금속이면 황색램프 점멸(0.5초 ON/0.5초 OFF). (해당 사이클 종료 시 소등)',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(0.5초 ON/0.5초 OFF). 해제하면 적색램프 소등하고 남은 동작을 이어서 동작.',
      estopRelease: '적색램프는 소등하고 남은 동작을 이어서 동작합니다.'
    }
  },
  {
    id: 11,
    name: '공개문제 11',
    seq: ['sup_fwd', 'drill_run', 'mach_down', 'delay3', 'mach_up', 'drill_stop',
          'sup_bwd', 'push_fwd', 'conv_run', 'delay1', 'push_bwd'],
    repeat: { from: 'mach_down', to: 'mach_up', times: 2, note: '2회 반복(부가조건2)' },
    ejectMaterial: '금속',
    minWork: 3,
    minNote: '금속 2개 이상 포함',
    contUntil: '금속 공작물 2개가 저장될 때까지',
    cond: {
      add1: '매거진에 공작물이 있으면 녹색램프 점등, 없으면 소등. 연속동작 중 재질을 판별하여 금속 공작물 2개가 저장되면 황색램프 점등. (연속동작이 종료되면 3초 후 소등)',
      add2: '연속동작 중 가공실린더 하강부터 가공실린더 상승까지의 동작이 2회 반복합니다.',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(0.5초 ON/0.5초 OFF). 해제하면 시스템이 초기화합니다.',
      estopRelease: '시스템이 초기화합니다.'
    }
  },
  {
    id: 12,
    name: '공개문제 12',
    seq: ['sup_fwd', 'drill_run', 'mach_down', 'delay3', 'drill_stop', 'mach_up',
          'sup_bwd', 'push_fwd', 'push_bwd', 'delay2', 'conv_run'],
    repeat: null,
    ejectMaterial: '금속',
    minWork: 3,
    minNote: '금속 2개 이상 포함',
    contStart: 'PB3 스위치를 2회',
    contUntil: '금속 공작물 2개가 저장될 때까지',
    cond: {
      add1: '매거진에 공작물이 있으면 녹색램프 점등, 없으면 소등. 재질을 판별하여 금속이면 황색램프 점등, 비금속이면 황색램프 점멸(0.5초 ON/0.5초 OFF). (해당 사이클 종료 시 소등)',
      add2: '금속 공작물이 2개 적재되면 적색램프를 3초 동안 점멸(0.5초 ON/0.5초 OFF). (연속동작이 종료되면 3초 후 소등)',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(0.5초 ON/0.5초 OFF). 해제하면 시스템이 초기화합니다.',
      estopRelease: '시스템이 초기화합니다.'
    }
  },
  {
    id: 13,
    name: '공개문제 13',
    /* 원본 순서도의 "3회 반복(부가조건2)" 점선박스 안에 하강→2초지연→상승이 있다 —
       1번 등과 같은 패턴. delay2b가 그 안쪽 지연, delay2는 정지 뒤 별도의 지연. */
    seq: ['sup_fwd', 'drill_run', 'mach_down', 'delay2b', 'mach_up', 'drill_stop', 'delay2',
          'sup_bwd', 'push_fwd', 'push_bwd', 'conv_run'],
    repeat: { from: 'mach_down', to: 'mach_up', times: 3, note: '3회 반복(부가조건2)' },
    ejectMaterial: '금속',
    minWork: 3,
    cond: {
      add1: '매거진에 공작물이 있으면 녹색램프 점등, 없으면 소등. 재질을 판별하여 금속이면 황색램프 점등, 비금속이면 황색램프 점멸(0.5초 ON/0.5초 OFF). (해당 사이클 종료 시 소등)',
      add2: '연속동작 중 가공실린더 하강·상승 동작을 지연시간(2초) 포함하여 3회 반복합니다.',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(0.5초 ON/0.5초 OFF). 해제하면 시스템이 초기화합니다.',
      estopRelease: '시스템이 초기화합니다.'
    }
  },
  {
    id: 14,
    name: '공개문제 14',
    /* 순서도는 1번과 같은 구조(반복 없음) */
    seq: ['sup_fwd', 'drill_run', 'delay1', 'mach_down', 'delay2', 'mach_up',
          'drill_stop', 'sup_bwd', 'push_fwd', 'push_bwd', 'conv_run'],
    repeat: null,
    ejectMaterial: '금속',
    minWork: 3,
    /* 연속동작 시작이 PB3를 1초 동안 누르고 있어야 한다 */
    contStart: 'PB3 스위치를 1초 동안',
    cond: {
      add1: '매거진에 공작물이 있으면 녹색램프 점등, 없으면 소등. 재질을 판별하여 금속이면 황색램프 점멸(1초 ON/1초 OFF), 비금속이면 황색램프 점등. (해당 사이클 종료 시 소등)',
      add2: '공작물 재질을 판별하기 전 PB3를 두 번 연속으로 누르면 재질에 상관없이 배출실린더로 배출박스에 저장. (해당 사이클에만 적용)',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(0.5초 ON/0.5초 OFF). 해제하면 시스템이 초기화합니다.',
      estopRelease: '시스템이 초기화합니다.'
    }
  },
  {
    id: 15,
    name: '공개문제 15',
    /* 순서도는 1번과 같은 구조(반복 없음) */
    seq: ['sup_fwd', 'drill_run', 'delay1', 'mach_down', 'delay2', 'mach_up',
          'drill_stop', 'sup_bwd', 'push_fwd', 'push_bwd', 'conv_run'],
    repeat: null,
    ejectMaterial: '금속',
    minWork: 3,
    cond: {
      add1: '재질을 판별하여 금속이면 황색램프 점멸(0.5초 ON/0.5초 OFF), 비금속이면 황색램프 점등. (해당 사이클 종료 후 소등)',
      add2: '연속동작 중 한 사이클이 종료되고 2초 후 다음 사이클이 동작. (매거진에 공작물이 없으면 종료) 판별 전 PB3를 누르면 녹색램프 점등하며 재질에 상관없이 배출박스에 저장. (저장 후 소등, 해당 사이클에만 적용)',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(0.5초 ON/0.5초 OFF). 해제하면 시스템이 초기화합니다.',
      estopRelease: '시스템이 초기화합니다.'
    }
  },
  {
    id: 16,
    name: '공개문제 16',
    seq: ['sup_fwd', 'delay2', 'sup_bwd', 'drill_run', 'mach_down', 'mach_up',
          'drill_stop', 'delay2b', 'push_fwd', 'push_bwd', 'conv_run'],
    repeat: null,
    ejectMaterial: '비금속',
    minWork: 3,
    contCycles: 3,
    cond: {
      add1: '컨베이어 위에 공작물이 있을 때만 녹색램프 점등. 금속이면 황색램프 점멸(0.5초 ON/0.5초 OFF), 비금속이면 황색램프 점등. (해당 사이클 종료 시 소등)',
      add2: '연속동작 중 PB3를 한 번 더 누르면 재질에 관계없이 저장박스에 저장. (해당 사이클에만 적용)',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점등. 해제하면 적색램프 소등하고 남은 동작을 이어서 동작.',
      estopRelease: '적색램프는 소등하고 남은 동작을 이어서 동작합니다.'
    }
  },
  {
    id: 17,
    name: '공개문제 17',
    /* 가공실린더 하강 뒤 가공모터 회전(하강+회전이 한 스텝) — 순서도상 별도 블록 */
    seq: ['sup_fwd', 'sup_bwd', 'delay2', 'mach_down', 'drill_run', 'mach_up',
          'drill_stop', 'push_fwd', 'delay2b', 'push_bwd', 'conv_run'],
    repeat: null,
    ejectMaterial: '금속',
    minWork: 3,
    contCycles: 3,
    cond: {
      add1: '연속동작 중 비금속 공작물 저장 개수에 따라 — 비금속 1개: 녹색램프 점멸(1초 ON/1초 OFF) / 비금속 2개 이상: 녹색램프 점등. (연속동작이 종료되면 소등)',
      add2: '연속동작 중 PB3를 누르면 황색램프 점멸(0.5초 ON/0.5초 OFF)하고, 재질에 관계없이 배출박스 저장 후 연속동작을 종료. (남은 사이클이 있어도 즉시 종료, 저장 후 황색램프 소등)',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점등. 해제하면 시스템이 초기화합니다.',
      estopRelease: '시스템이 초기화합니다.'
    }
  },
  {
    id: 18,
    name: '공개문제 18',
    /* 컨베이어 구동이 맨 처음(공급실린더보다 먼저) — 사이클 내내 돈다 */
    seq: ['conv_run', 'sup_fwd', 'delay1', 'drill_run', 'mach_down', 'delay2',
          'mach_up', 'drill_stop', 'sup_bwd', 'push_fwd', 'push_bwd'],
    repeat: null,
    ejectMaterial: '비금속',
    minWork: 3,
    cond: {
      add1: '연속동작 중 비금속 저장 개수에 따라 — 비금속 1개: 황색램프 점등 / 비금속 2개: 황색램프 점멸(0.5초 ON/0.5초 OFF). 금속 1개 이상: 녹색램프 점멸(1초 ON/1초 OFF). (연속동작 종료 시 소등)',
      add2: '연속동작 중 PB3를 누르면 매거진에 물품이 남아 있어도 현재 사이클 동작이 완료된 후 종료.',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(0.5초 ON/0.5초 OFF). 해제하면 시스템이 초기화합니다.',
      estopRelease: '시스템이 초기화합니다.'
    }
  },
  {
    id: 19,
    name: '공개문제 19',
    /* 컨베이어가 맨 처음. 가공하강~상승 사이 2초 지연이 기본 포함(A12) */
    seq: ['conv_run', 'sup_fwd', 'drill_run', 'delay2', 'mach_down', 'delay2b',
          'mach_up', 'drill_stop', 'sup_bwd', 'push_fwd', 'push_bwd'],
    repeat: { from: 'mach_down', to: 'mach_up', times: 2, note: '2회 반복(부가조건2)' },
    ejectMaterial: '비금속',
    minWork: 3,
    cond: {
      add1: '가공모터가 회전하는 중에는 녹색램프 점등. 재질을 판별하여 비금속이면 황색램프 점등, 금속이면 황색램프 점멸(0.5초 ON/0.5초 OFF). (해당 사이클 종료 시 소등)',
      add2: '가공실린더 하강 전 PB3를 누르면 가공실린더 하강·상승을 지연시간 포함하여 2회 반복. (해당 사이클에만 적용)',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(0.5초 ON/0.5초 OFF). 해제하면 2초 뒤 시스템이 초기화합니다.',
      estopRelease: '2초 뒤 시스템이 초기화합니다.'
    }
  },
  {
    id: 20,
    name: '공개문제 20',
    /* 가공을 먼저 하고, 컨베이어는 공급후진 뒤에 켠다. 안쪽 3초 지연이 기본 포함(A12) */
    seq: ['sup_fwd', 'drill_run', 'delay1', 'mach_down', 'delay3', 'mach_up',
          'drill_stop', 'sup_bwd', 'conv_run', 'push_fwd', 'push_bwd'],
    repeat: { from: 'mach_down', to: 'mach_up', times: 2, note: '2회 반복(부가조건2)' },
    ejectMaterial: '금속',
    minWork: 3,
    cond: {
      add1: '매거진에 공작물이 있으면 녹색램프 점등, 없으면 점멸(0.5초 ON/0.5초 OFF). 금속이면 황색램프 점등, 비금속이면 황색램프 점멸(0.5초 ON/0.5초 OFF). (해당 사이클 종료 후 소등)',
      add2: '연속동작에서 가공실린더 하강~상승까지의 동작이 2회 반복.',
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(0.5초 ON/0.5초 OFF). 해제하면 시스템이 초기화합니다.',
      estopRelease: '시스템이 초기화합니다.'
    }
  }
];
