<template>
  <div class="page">
    <div class="page-header">
      <h1>상품 목록</h1>

      <div class="actions">
        <button @click="loadProducts">불러오기</button>
        <button @click="openModal">추가하기</button>
        <button @click="loadMain">메인으로 가기</button>
      </div>
    </div>

    <div class="table-card">
      <table class="product-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>상품명</th>
            <th>가격</th>
            <th>판매링크</th>
            <th>후기링크</th>
            <th>이미지</th>
            <th>작업</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(p, index) in products" :key="p.idx">
            <td>{{ index + 1 }}</td>
            <td>{{ p.productName }}</td>
            <td>{{ p.price }}만원</td>
            <td>
              <a v-if="p.salesLink" :href="formatUrl(p.salesLink)" target="_blank">
                {{ p.salesLink }}
              </a>
            </td>
            <td>
              <a v-if="p.reviewLink" :href="formatUrl(p.reviewLink)" target="_blank">
                {{ p.reviewLink }}
              </a>
            </td>
            <td>
              <img
                v-for="img in p.imagePath.split(',')"
                :key="img"
                :src="img"
                class="thumb"
                @click="openImageModal(img)"
              />
            </td>
            <td>
              <button @click="editProduct(p)">수정</button>
              <button @click="deleteProduct(p.idx)">삭제</button>
            </td>
          </tr>

          <tr v-if="products.length === 0">
            <td colspan="6" class="empty">등록된 상품이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="modal-backdrop">
      <div class="modal">
        <h2>상품 추가하기</h2>

        <input v-model="form.productName" placeholder="상품명" />
        <input v-model="form.price" type="number" placeholder="가격" />
        <input v-model="form.salesLink" placeholder="판매링크" />
        <input v-model="form.reviewLink" placeholder="후기링크" />
        <input type="file" multiple @change="handleImage" />

        <div class="modal-actions">
          <button @click="createProduct">저장</button>
          <button @click="closeModal">취소</button>
        </div>
      </div>
    </div>

    <div v-if="isImageModalOpen" class="image-modal-backdrop" @click="closeImageModal">
      <div class="image-modal">
        <button class="close-btn" @click="closeImageModal">✕</button>
        <img :src="selectedImage" class="image-large" />
      </div>
    </div>
  </div>
</template>

<script src="../scripts/productList.js"></script>

<style scoped src="../assets/productList.css"></style>
