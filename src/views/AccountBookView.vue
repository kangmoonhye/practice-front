<template>
  <div class="account-page">
    <div class="account-header">
      <div class="header-left">
        <h1>가계부</h1>

        <select v-model="selectedMonth" @change="filterItems">
          <option value="">전체</option>
          <option v-for="month in 12" :key="month" :value="month">{{ month }}월</option>
        </select>
      </div>

      <div class="actions">
        <button @click="loadItems">불러오기</button>
        <button @click="openModal">추가하기</button>
        <button @click="goMain">메인으로 가기</button>
      </div>
    </div>

    <div class="table-card">
      <table class="account-table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>내용</th>
            <th>금액</th>
            <th>상세내용</th>
            <th>카드</th>
            <th>작업</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in filteredItems" :key="item.idx">
            <td>{{ formatDate(item.usedDate, item.dayOfWeek) }}</td>
            <td>{{ item.content }}</td>
            <td>{{ formatAmount(item.amount) }}</td>
            <td>{{ item.detail }}</td>

            <td :class="cardClass(item.card)">
              {{ item.card }}
            </td>

            <td>
              <button @click="editItem(item)">수정</button>
              <button @click="deleteItem(item.idx)">삭제</button>
            </td>
          </tr>

          <tr v-if="filteredItems.length === 0">
            <td colspan="6" class="empty">등록된 내역이 없습니다.</td>
          </tr>

          <tr class="summary-row hyundai">
            <td>현대</td>
            <td></td>
            <td>{{ formatAmount(summary.hyundaiAmount) }}</td>
            <td colspan="3"></td>
          </tr>

          <tr class="summary-row samsung">
            <td>삼성</td>
            <td></td>
            <td>{{ formatAmount(summary.samsungAmount) }}</td>
            <td colspan="3"></td>
          </tr>

          <tr class="summary-row transfer">
            <td>송금</td>
            <td></td>
            <td>{{ formatAmount(summary.transferAmount) }}</td>
            <td colspan="3"></td>
          </tr>

          <tr class="summary-row total">
            <td>합계</td>
            <td></td>
            <td>{{ formatAmount(summary.totalAmount) }}</td>
            <td colspan="3"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="modal-backdrop">
      <div class="modal">
        <h2>
          {{ isEditMode ? '가계부 수정' : '가계부 추가' }}
        </h2>

        <div class="date-input-wrap" @click="openDatePicker">
          <input ref="usedDateInput" v-model="form.usedDate" type="date" />
        </div>

        <input v-model="form.content" placeholder="내용" />

        <input v-model="form.amount" type="number" placeholder="금액" />

        <input v-model="form.detail" placeholder="상세내용" />

        <select v-model="form.card">
          <option value="현대">현대</option>
          <option value="삼성">삼성</option>
          <option value="송금">송금</option>
        </select>

        <div class="modal-actions">
          <button @click="saveItem">저장</button>
          <button @click="closeModal">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="../scripts/accountBook.js"></script>
<style scoped src="../assets/accountBook.css"></style>
<style scoped src="../assets/accountBook.mobile.css"></style>
