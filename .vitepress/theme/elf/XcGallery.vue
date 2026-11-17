<script setup lang="ts">
// "认识学创 AI"页面上的 9 个动作展示
import XcRobot from './XcRobot.vue'

const ACTIONS = [
  { state: 'idle', name: '待机', what: '漂浮、眨眼、天线灯一呼一吸', when: '平时待在右下角' },
  { state: 'wave', name: '打招呼', what: '挥手、眼睛笑成弯月、冒星星', when: '第一次见面、鼠标移到它身上、读完一页时' },
  { state: 'listen', name: '倾听', what: '歪着头，耳朵灯一闪一闪', when: '你在输入框里打字' },
  { state: 'search', name: '翻找', what: '举起放大镜，眼睛左右扫', when: '边打字边在网站里帮你找' },
  { state: 'think', name: '思考', what: '屏幕变成三个跳动的点，冒思考泡泡', when: '你按了回车，它在想答案' },
  { state: 'talk', name: '讲解', what: '嘴巴一张一合，发出声波，手跟着比划', when: '回答一个字一个字地出来' },
  { state: 'cheer', name: '开心', what: '双手举高跳起来，冒爱心', when: '收到你的反馈、你说“看懂了”' },
  { state: 'confused', name: '疑惑', what: '歪头挠头，一只眼眯起，头顶冒问号', when: '网站里没找到答案，或者出错了' },
  { state: 'sleep', name: '打盹', what: '闭眼，天线灯熄灭，飘出 Zzz', when: '一分钟没人理它；动一下鼠标就醒' },
] as const
</script>

<template>
  <div class="xc-gallery">
    <figure v-for="(a, i) in ACTIONS" :key="a.state">
      <div class="stage"><XcRobot :state="a.state" :size="110" /></div>
      <figcaption>
        <strong>{{ i + 1 }}. {{ a.name }}</strong>
        <span>{{ a.what }}</span>
        <small>什么时候：{{ a.when }}</small>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.xc-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
  margin: 20px 0;
}
figure {
  margin: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
  background: var(--vp-c-bg);
}
.stage {
  display: grid;
  place-items: center;
  height: 168px;
  padding-top: 12px;
  background: radial-gradient(circle at 50% 60%, var(--vp-c-brand-soft), transparent 70%);
}
figcaption {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px 14px;
  line-height: 1.55;
}
figcaption span {
  font-size: 14px;
}
figcaption small {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
