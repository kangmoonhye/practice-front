<template>
  <div class="main-page">
    <div class="main-header">
      <h1>my board</h1>
      <button class="create-button" @click="openBoardModal">게시판 만들기</button>
    </div>

    <div v-for="board in boards" :key="board.idx" class="board-wrapper">
      <button class="board-card" @click="goBoard(board)">
        {{ board.name }}
      </button>

      <button class="delete-button" @click="deleteBoard(board.idx)">삭제</button>
      <button class="update-button" @click.stop="openEditBoardModal(board)">수정</button>
    </div>

    <div v-if="isBoardModalOpen" class="modal-backdrop">
      <div class="modal">
        <h2>게시판 만들기</h2>

        <input v-model="boardName" placeholder="게시판 이름" />
        <select v-model="boardType">
          <option value="product">상품 게시판</option>
          <option value="account">가계부</option>
        </select>

        <div class="modal-actions">
          <button @click="createBoard">저장</button>
          <button @click="closeBoardModal">취소</button>
        </div>
      </div>
    </div>
    <div v-if="isEditBoardModalOpen" class="modal-backdrop">
      <div class="modal">
        <h2>게시판 수정</h2>

        <input v-model="editBoardName" placeholder="게시판 이름" />
        <select v-model="editBoardType">
          <option value="product">상품 게시판</option>
          <option value="account">가계부</option>
        </select>

        <input
          v-model="editBoardPassword"
          type="password"
          placeholder="새 비밀번호 / 비워두면 해제"
        />

        <div class="modal-actions">
          <button @click="updateBoard">저장</button>
          <button @click="closeEditBoardModal">취소</button>
        </div>
      </div>
    </div>

    <div v-if="isPasswordModalOpen" class="modal-backdrop">
      <div class="modal">
        <h2>비밀번호 입력</h2>

        <input
          v-model="password"
          type="password"
          placeholder="비밀번호"
          @keyup.enter="checkBoardPassword"
        />

        <div class="modal-actions">
          <button @click="checkBoardPassword">확인</button>

          <button @click="isPasswordModalOpen = false">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="../scripts/main.js"></script>
<style scoped src="../assets/main.css"></style>
