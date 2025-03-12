<template>
  <div class="icon-title flex flex-between">
    <div class="flex align-center">
      <img v-if="iconHidden" class="left-icon" src="@/assets/icons/Group1707479139.svg" alt="icon" />
      <span class="title-text">
        <slot name="title" />
      </span>
    </div>
    <slot name="right" />
  </div>
</template>

<script>
export default {
  name: 'iconTitle',
  props: {
    // 是否显示标题左侧icon
    iconHidden: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style></style>
