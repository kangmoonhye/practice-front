<template>
  <div class="board-page">
    <h1>게시판 화면</h1>
    <p>게시판 ID: {{ boardIdx }}</p>
    <button @click="goMain">메인으로 가기</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boardIdx: null,
    }
  },

  mounted() {
    this.boardIdx = this.$route.params.boardIdx
  },

  methods: {
    goMain() {
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.board-page {
  padding: 30px;
}
</style>
