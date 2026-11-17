<script setup lang="ts">
import { useId } from 'vue'
// 学创 AI 的形象：一个漂浮的机器人娃娃(原创，纯代码画出来，不用图片)。
// 9 个动作，由外面传进来的 state 决定：
//   idle 待机     漂浮、眨眼、天线灯呼吸           —— 平时
//   wave 打招呼   挥右手、眼睛笑成弯月、冒星星     —— 第一次见面、鼠标移上来、刚睡醒
//   listen 倾听   歪头、耳朵灯一闪一闪             —— 读者正在输入
//   search 翻找   举放大镜、眼睛左右扫             —— 边打字边在网站里找
//   think 思考    屏幕变成三个跳动的点、冒思考泡泡 —— 等 AI 回答
//   talk 讲解     嘴巴一张一合、发出声波、手比划   —— 回答正在一个字一个字出来
//   cheer 开心    双手举起跳一下、冒爱心           —— 收到反馈、读者说"看懂了"、被戳了一下
//   confused 疑惑 歪头挠头、一只眼睛眯起、头顶问号 —— 没找到答案、出错
//   sleep 打盹    闭眼、天线灯熄灭、飘出 Zzz       —— 一分钟没人理它
export type XcState = 'idle' | 'wave' | 'listen' | 'search' | 'think' | 'talk' | 'cheer' | 'confused' | 'sleep'

withDefaults(defineProps<{ state?: XcState; size?: number }>(), { state: 'idle', size: 84 })

// 页面上可能同时有两个机器人(按钮上一个、对话框标题里一个)，渐变的 id 不能重复
const uid = 'xcb' + useId().replace(/[^a-zA-Z0-9-]/g, '')
</script>

<template>
  <svg
    class="xc-bot"
    :class="`st-${state}`"
    viewBox="0 0 120 132"
    :width="size"
    :height="Math.round((size * 132) / 120)"
    role="img"
    aria-hidden="true"
  >
    <defs>
      <linearGradient :id="`${uid}-shell`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="1" stop-color="#dfe6ff" />
      </linearGradient>
      <radialGradient :id="`${uid}-visor`" cx="0.5" cy="0.35" r="0.8">
        <stop offset="0" stop-color="#26346e" />
        <stop offset="1" stop-color="#121a3d" />
      </radialGradient>
    </defs>

    <ellipse class="shadow" cx="60" cy="126" rx="24" ry="4.5" />

    <g class="float">
      <g class="tilt">
        <!-- 左手 -->
        <g class="arm arm-l">
          <rect x="25" y="87" width="11" height="21" rx="5.5" :fill="`url(#${uid}-shell)`" class="line" />
          <circle cx="30.5" cy="109" r="5.5" class="hand" />
        </g>
        <!-- 右手(举放大镜) -->
        <g class="arm arm-r">
          <rect x="84" y="87" width="11" height="21" rx="5.5" :fill="`url(#${uid}-shell)`" class="line" />
          <circle cx="89.5" cy="109" r="5.5" class="hand" />
        </g>

        <!-- 身体 -->
        <rect x="36" y="80" width="48" height="38" rx="18" :fill="`url(#${uid}-shell)`" class="line" />
        <circle cx="60" cy="99" r="9.5" class="badge" />
        <text x="60" y="102.6" class="badge-text" text-anchor="middle">学</text>

        <!-- 头 -->
        <g class="head">
          <line x1="60" y1="20" x2="60" y2="10" class="antenna" />
          <circle cx="60" cy="8" r="5" class="bulb" />
          <rect x="7" y="40" width="11" height="24" rx="5.5" class="ear" />
          <rect x="102" y="40" width="11" height="24" rx="5.5" class="ear" />
          <rect x="14" y="18" width="92" height="66" rx="28" :fill="`url(#${uid}-shell)`" class="line" />
          <rect x="23" y="29" width="74" height="46" rx="20" :fill="`url(#${uid}-visor)`" />
          <path d="M33 36 q9 -4 19 -3" class="visor-shine" />
          <ellipse cx="35" cy="63" rx="5" ry="3" class="cheek" />
          <ellipse cx="85" cy="63" rx="5" ry="3" class="cheek" />

          <!-- 眼睛：每种表情一组，按状态显示其中一组 -->
          <g class="eyes eyes-open">
            <rect x="40" y="42" width="10" height="15" rx="5" class="eye" />
            <rect x="70" y="42" width="10" height="15" rx="5" class="eye" />
          </g>
          <g class="eyes eyes-happy">
            <path d="M39 52 q6 -8 12 0" class="eye-line" />
            <path d="M69 52 q6 -8 12 0" class="eye-line" />
          </g>
          <g class="eyes eyes-closed">
            <path d="M39 50 q6 5 12 0" class="eye-line" />
            <path d="M69 50 q6 5 12 0" class="eye-line" />
          </g>
          <g class="eyes eyes-think">
            <circle cx="47" cy="51" r="3.6" class="eye dot1" />
            <circle cx="60" cy="51" r="3.6" class="eye dot2" />
            <circle cx="73" cy="51" r="3.6" class="eye dot3" />
          </g>
          <g class="eyes eyes-confused">
            <circle cx="45" cy="49" r="5.5" class="eye-ring" />
            <rect x="69" y="47" width="12" height="4" rx="2" class="eye" />
          </g>

          <!-- 嘴 -->
          <path d="M54 64 q6 5 12 0" class="mouth mouth-smile" />
          <rect x="54.5" y="61.5" width="11" height="6" rx="3" class="mouth mouth-talk" />
          <ellipse cx="60" cy="65" rx="2.6" ry="3" class="mouth mouth-o" />
        </g>

        <!-- 翻找时举到眼前的放大镜 -->
        <g class="fx fx-lens">
          <line x1="89.5" y1="64" x2="101" y2="78" class="lens-handle" />
          <circle cx="80" cy="53" r="13" class="lens" />
          <path d="M72 47 q4 -5 10 -5" class="lens-shine" />
        </g>
      </g>

      <!-- 各个动作的小特效 -->
      <g class="fx fx-sparkle">
        <path d="M104 26 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z" />
        <path d="M14 22 l1.4 3.4 l3.4 1.4 l-3.4 1.4 l-1.4 3.4 l-1.4 -3.4 l-3.4 -1.4 l3.4 -1.4z" />
      </g>
      <g class="fx fx-bubbles">
        <circle cx="100" cy="20" r="3" />
        <circle cx="108" cy="10" r="4.5" />
      </g>
      <g class="fx fx-waves">
        <path d="M109 46 q4 6 0 12" />
        <path d="M114 42 q7 10 0 20" />
      </g>
      <g class="fx fx-hearts">
        <path class="h1" d="M98 30 c-3 -4 -9 -1 -6 4 l6 6 l6 -6 c3 -5 -3 -8 -6 -4z" />
        <path class="h2" d="M20 26 c-2.4 -3 -7 -1 -4.8 3.2 l4.8 4.8 l4.8 -4.8 c2.2 -4.2 -2.4 -6.2 -4.8 -3.2z" />
      </g>
      <text x="101" y="24" class="fx fx-question">?</text>
      <g class="fx fx-zzz">
        <text x="94" y="24" class="z1">z</text>
        <text x="103" y="14" class="z2">Z</text>
      </g>
      <g class="fx fx-ears">
        <path d="M4 44 q-4 8 0 16" />
        <path d="M116 44 q4 8 0 16" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.xc-bot {
  display: block;
  overflow: visible;
}
.xc-bot * {
  transform-box: view-box;
}

/* ---------- 颜色 ---------- */
.shadow {
  fill: rgba(30, 40, 90, 0.18);
  transform-origin: 60px 126px;
}
.line {
  stroke: #c3cdf3;
  stroke-width: 1.6;
}
.hand,
.badge,
.ear {
  fill: #4d6bfe;
}
.ear {
  transition: fill 0.3s;
}
.badge-text {
  fill: #fff;
  font-size: 10.5px;
  font-weight: 700;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.antenna {
  stroke: #8b9bd8;
  stroke-width: 3;
  stroke-linecap: round;
}
.bulb {
  fill: #ffc93c;
  transition: fill 0.4s;
}
.visor-shine {
  fill: none;
  stroke: rgba(255, 255, 255, 0.22);
  stroke-width: 3;
  stroke-linecap: round;
}
.cheek {
  fill: #ff8fb1;
  opacity: 0.45;
  transition: opacity 0.3s;
}
.eye {
  fill: #6ff3ff;
}
.eye-line,
.eye-ring,
.mouth-smile,
.mouth-o {
  fill: none;
  stroke: #6ff3ff;
  stroke-width: 3.2;
  stroke-linecap: round;
}
.eye-ring {
  stroke-width: 2.6;
}
.mouth-smile,
.mouth-o {
  stroke-width: 2.4;
}
.mouth-talk {
  fill: #6ff3ff;
  transform-origin: 60px 64.5px;
}
.fx {
  display: none;
}
.fx-sparkle path {
  fill: #ffc93c;
}
.fx-bubbles circle {
  fill: none;
  stroke: #8b9bd8;
  stroke-width: 2;
}
.fx-waves path,
.fx-ears path {
  fill: none;
  stroke: #4d6bfe;
  stroke-width: 2.4;
  stroke-linecap: round;
}
.fx-hearts path {
  fill: #ff6b9a;
}
.fx-question {
  fill: #ffaa1d;
  font: 800 22px/1 system-ui, sans-serif;
}
.fx-zzz text {
  fill: #8b9bd8;
  font: 800 12px/1 system-ui, sans-serif;
}
.fx-zzz .z2 {
  font-size: 16px;
}
.lens {
  fill: rgba(200, 235, 255, 0.28);
  stroke: #3b5bdb;
  stroke-width: 3;
}
.lens-handle {
  stroke: #3b5bdb;
  stroke-width: 4.5;
  stroke-linecap: round;
}
.lens-shine {
  fill: none;
  stroke: #fff;
  stroke-width: 1.6;
  stroke-linecap: round;
}

/* ---------- 部件的旋转中心 ---------- */
.head {
  transform-origin: 60px 82px;
  transition: transform 0.35s ease;
}
.tilt {
  transform-origin: 60px 118px;
  transition: transform 0.35s ease;
}
.arm-l {
  transform-origin: 30.5px 90px;
  transition: transform 0.35s ease;
}
.arm-r {
  transform-origin: 89.5px 90px;
  transition: transform 0.35s ease;
}
.eyes-open {
  transform-origin: 60px 50px;
}

/* ---------- 表情：默认睁眼微笑，其他按状态切换 ---------- */
.eyes,
.mouth {
  display: none;
}
.eyes-open,
.mouth-smile {
  display: inline;
}
.st-wave .eyes-open,
.st-cheer .eyes-open,
.st-sleep .eyes-open,
.st-think .eyes-open,
.st-confused .eyes-open {
  display: none;
}
.st-wave .eyes-happy,
.st-cheer .eyes-happy,
.st-sleep .eyes-closed,
.st-think .eyes-think,
.st-confused .eyes-confused {
  display: inline;
}
.st-talk .mouth-smile,
.st-confused .mouth-smile,
.st-sleep .mouth-smile {
  display: none;
}
.st-talk .mouth-talk,
.st-confused .mouth-o {
  display: inline;
}
.st-wave .cheek,
.st-cheer .cheek {
  opacity: 0.8;
}

/* ---------- 1. 待机：漂浮、眨眼、天线灯呼吸 ---------- */
.float {
  animation: xc-bob 3.2s ease-in-out infinite;
}
.shadow {
  animation: xc-shadow 3.2s ease-in-out infinite;
}
.eyes-open {
  animation: xc-blink 4.6s infinite;
}
.bulb {
  animation: xc-glow 2.6s ease-in-out infinite;
}

/* ---------- 2. 打招呼 ---------- */
.st-wave .arm-r {
  animation: xc-wave 0.9s ease-in-out infinite;
}
.st-wave .head {
  transform: rotate(-4deg);
}
.st-wave .fx-sparkle {
  display: inline;
  animation: xc-twinkle 0.9s ease-in-out infinite;
}

/* ---------- 3. 倾听 ---------- */
.st-listen .tilt {
  transform: rotate(-5deg);
}
.st-listen .head {
  transform: rotate(-6deg);
}
.st-listen .ear {
  animation: xc-ear 0.8s ease-in-out infinite;
}
.st-listen .fx-ears {
  display: inline;
  animation: xc-fade 0.8s ease-in-out infinite;
}
.st-listen .float {
  animation-duration: 4.5s;
}

/* ---------- 4. 翻找 ---------- */
.st-search .arm-r {
  transform: rotate(-134deg);
}
.st-search .fx-lens {
  animation: xc-look 1.4s ease-in-out infinite;
  transform-origin: 101px 78px;
}
.st-search .fx-lens {
  display: inline;
}
.st-search .eyes-open {
  animation: xc-scan 1.4s ease-in-out infinite;
}
.st-search .head {
  animation: xc-look 1.4s ease-in-out infinite;
}

/* ---------- 5. 思考 ---------- */
.st-think .dot1,
.st-think .dot2,
.st-think .dot3 {
  animation: xc-dot 1s ease-in-out infinite;
}
.st-think .dot2 {
  animation-delay: 0.15s;
}
.st-think .dot3 {
  animation-delay: 0.3s;
}
.st-think .bulb {
  animation: xc-flash 0.5s steps(2) infinite;
}
.st-think .head {
  transform: rotate(5deg);
}
.st-think .fx-bubbles {
  display: inline;
  animation: xc-rise 1.6s ease-in-out infinite;
}
.st-think .arm-l {
  transform: rotate(28deg);
}

/* ---------- 6. 讲解 ---------- */
.st-talk .mouth-talk {
  animation: xc-talk 0.28s ease-in-out infinite alternate;
}
.st-talk .fx-waves {
  display: inline;
  animation: xc-fade 0.6s ease-in-out infinite;
}
.st-talk .arm-r {
  animation: xc-gesture 1.2s ease-in-out infinite;
}
.st-talk .head {
  animation: xc-nod 1.2s ease-in-out infinite;
}

/* ---------- 7. 开心 ---------- */
.st-cheer .float {
  animation: xc-jump 0.7s cubic-bezier(0.3, 0.7, 0.4, 1) infinite;
}
.st-cheer .shadow {
  animation: xc-jump-shadow 0.7s cubic-bezier(0.3, 0.7, 0.4, 1) infinite;
}
.st-cheer .arm-l {
  transform: rotate(140deg);
}
.st-cheer .arm-r {
  transform: rotate(-140deg);
}
.st-cheer .fx-hearts {
  display: inline;
}
.st-cheer .fx-hearts .h1 {
  animation: xc-heart 1.2s ease-out infinite;
}
.st-cheer .fx-hearts .h2 {
  animation: xc-heart 1.2s ease-out 0.4s infinite;
}

/* ---------- 8. 疑惑 ---------- */
.st-confused .tilt {
  transform: rotate(7deg);
}
.st-confused .head {
  transform: rotate(8deg);
}
.st-confused .arm-r {
  animation: xc-scratch 0.5s ease-in-out infinite alternate;
}
.st-confused .fx-question {
  display: inline;
  animation: xc-pop 1.4s ease-in-out infinite;
}

/* ---------- 9. 打盹 ---------- */
.st-sleep .float {
  animation: xc-bob-slow 5s ease-in-out infinite;
}
.st-sleep .shadow {
  animation: none;
}
.st-sleep .head {
  transform: rotate(9deg) translateY(2px);
}
.st-sleep .bulb {
  animation: none;
  fill: #b3bce0;
}
.st-sleep .ear {
  fill: #8b9bd8;
}
.st-sleep .fx-zzz {
  display: inline;
}
.st-sleep .z1 {
  animation: xc-z 2.6s ease-in-out infinite;
}
.st-sleep .z2 {
  animation: xc-z 2.6s ease-in-out 1.3s infinite;
}

/* ---------- 动画 ---------- */
@keyframes xc-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
@keyframes xc-bob-slow {
  0%, 100% { transform: translateY(2px); }
  50% { transform: translateY(0); }
}
@keyframes xc-shadow {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.86); opacity: 0.7; }
}
@keyframes xc-blink {
  0%, 92%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}
@keyframes xc-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
@keyframes xc-flash {
  0% { fill: #ffc93c; }
  100% { fill: #6ff3ff; }
}
@keyframes xc-wave {
  0%, 100% { transform: rotate(-125deg); }
  50% { transform: rotate(-165deg); }
}
@keyframes xc-twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
@keyframes xc-ear {
  0%, 100% { fill: #4d6bfe; }
  50% { fill: #6ff3ff; }
}
@keyframes xc-fade {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 1; }
}
@keyframes xc-scan {
  0%, 100% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
}
@keyframes xc-look {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}
@keyframes xc-dot {
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  40% { transform: translateY(-4px); opacity: 1; }
}
@keyframes xc-rise {
  0% { transform: translateY(4px); opacity: 0; }
  40% { opacity: 1; }
  100% { transform: translateY(-4px); opacity: 0; }
}
@keyframes xc-talk {
  from { transform: scaleY(0.3); }
  to { transform: scaleY(1.15); }
}
@keyframes xc-gesture {
  0%, 100% { transform: rotate(-20deg); }
  50% { transform: rotate(-45deg); }
}
@keyframes xc-nod {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-3deg); }
}
@keyframes xc-jump {
  0%, 100% { transform: translateY(0) scale(1, 1); }
  15% { transform: translateY(1px) scale(1.04, 0.95); }
  50% { transform: translateY(-14px) scale(0.98, 1.03); }
}
@keyframes xc-jump-shadow {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.6); opacity: 0.45; }
}
@keyframes xc-heart {
  0% { transform: translateY(6px) scale(0.6); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateY(-12px) scale(1); opacity: 0; }
}
@keyframes xc-scratch {
  from { transform: rotate(-150deg); }
  to { transform: rotate(-162deg); }
}
@keyframes xc-pop {
  0%, 100% { transform: translateY(0) rotate(-6deg); }
  50% { transform: translateY(-3px) rotate(6deg); }
}
@keyframes xc-z {
  0% { transform: translate(0, 4px); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translate(6px, -10px); opacity: 0; }
}

/* 读者在系统里关掉了动画：只保留表情变化，不动 */
@media (prefers-reduced-motion: reduce) {
  .xc-bot *,
  .xc-bot {
    animation: none !important;
    transition: none !important;
  }
}
</style>
