export default {
  data() {
    return {
      products: [],
      isModalOpen: false,

      isEditMode: false,
      editIdx: null,

      isImageModalOpen: false,
      selectedImage: null,

      form: {
        productName: '',
        price: '',
        salesLink: '',
        reviewLink: '',
        image: [],
      },
    }
  },

  mounted() {
    this.loadProducts()
  },

  methods: {
    async loadProducts() {
      const res = await fetch('http://localhost:8080/product/list')
      const data = await res.json()
      this.products = Array.isArray(data.result) ? data.result : []
    },

    formatUrl(url) {
      if (!url) return '#'
      return url.startsWith('http') ? url : 'https://' + url
    },

    loadMain() {
      this.$router.push('/')
    },

    resetForm() {
      this.form = {
        productName: '',
        price: '',
        salesLink: '',
        reviewLink: '',
        image: null,
      }
    },

    openModal() {
      this.isEditMode = false
      this.editIdx = null
      this.resetForm()
      this.isModalOpen = true
    },

    closeModal() {
      this.isModalOpen = false
      this.isEditMode = false
      this.editIdx = null
      this.resetForm()
    },

    editProduct(p) {
      this.isEditMode = true
      this.editIdx = p.idx

      this.form.productName = p.productName
      this.form.price = p.price
      this.form.salesLink = p.salesLink
      this.form.reviewLink = p.reviewLink
      this.form.image = null

      this.isModalOpen = true
    },

    handleImage(event) {
      const files = Array.from(event.target.files)

      // 5MB 제한 체크
      const validFiles = files.filter((f) => f.size <= 5 * 1024 * 1024)

      if (validFiles.length !== files.length) {
        alert('5MB 초과 파일은 제외됩니다.')
      }

      this.form.images = validFiles
    },

    async createProduct() {
      const formData = new FormData()

      formData.append('productName', this.form.productName)
      formData.append('price', this.form.price)
      formData.append('salesLink', this.form.salesLink)
      formData.append('reviewLink', this.form.reviewLink)

      this.form.images.forEach((file) => {
        formData.append('images', file)
      })

      if (this.isEditMode) {
        await fetch(`http://localhost:8080/product/update/${this.editIdx}`, {
          method: 'PATCH',
          body: formData,
        })
      } else {
        await fetch('http://localhost:8080/product/create', {
          method: 'POST',
          body: formData,
        })
      }

      this.closeModal()
      await this.loadProducts()
    },

    async deleteProduct(idx) {
      if (!confirm('삭제하시겠습니까?')) return

      await fetch(`http://localhost:8080/product/delete/${idx}`, {
        method: 'DELETE',
      })

      await this.loadProducts()
    },

    openImageModal(imageUrl) {
      this.selectedImage = imageUrl
      this.isImageModalOpen = true
    },

    closeImageModal() {
      this.isImageModalOpen = false
      this.selectedImage = null
    },
  },
}
