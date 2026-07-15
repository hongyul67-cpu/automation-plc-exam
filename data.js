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
    { sym: 'S3', fn: '비금속 감지' },
    { sym: 'S4', fn: '금속 감지' },
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
  delay2:    { t: '2초 지연',          act: 'delay', sec: 2 }
};

/* 재질 판별 이후는 모든 문제 공통 구조(분기 방향만 다름) */
window.BRANCH_BLOCKS = {
  ej_fwd:   { t: '배출실린더 전진', act: 'cyl', dev: 'ej', to: 1, ls: 'LS8', sol: 'SOL5' },
  ej_box:   { t: '배출박스 저장',   act: 'store', box: 'eject' },
  ej_bwd:   { t: '배출실린더 후진', act: 'cyl', dev: 'ej', to: 0, ls: 'LS7', sol: 'SOL5' },
  keep_box: { t: '저장박스 저장',   act: 'store', box: 'keep' }
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
      add3: '비상정지를 누르면 현재 상태로 정지(실린더는 진행 중인 행정을 마치고 정지, 가공모터·컨베이어 정지), 녹색·황색램프 소등, 적색램프 점멸(0.5초). 해제하면 2초 뒤 시스템 초기화.'
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
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(1초 ON/1초 OFF). 해제하면 시스템 초기화.'
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
      add3: '비상정지를 누르면 현재 상태로 정지, 녹색·황색램프 소등, 적색램프 점멸(0.5초). 해제하면 적색램프 소등하고 남은 동작을 이어서 동작.'
    }
  }
];
