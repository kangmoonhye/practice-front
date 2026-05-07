<template>
  <div>
    <h1>메인 화면</h1>

    <button @click="goList">상품 목록 이동</button>
  </div>
</template>

<script>
export default {
  methods: {
    goList() {
      this.$router.push('/product/list')
    },
  },
}
</script>
