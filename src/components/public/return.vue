<template>
  <div class="return-btn" @click="returnPage">
    返回
  </div>
</template>

<script>
export default {
  name: "returnBtn",
  methods: {
    returnPage() {
      this.$router.go(-1)
    }
  }
}
</script>

<style>
</style>