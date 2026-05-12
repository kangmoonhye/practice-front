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
        images: [],
      },
    }
  },

  mounted() {
    this.loadProducts()
  },

  methods: {
    getBoardIdx() {
      return this.$route.params.boardIdx
    },

    getListUrl() {
      const boardIdx = this.getBoardIdx()

      if (boardIdx) {
        return `/product/boards/${boardIdx}/list`
      }

      return '/product/list'
    },

    getCreateUrl() {
      const boardIdx = this.getBoardIdx()

      if (boardIdx) {
        return `/product/boards/${boardIdx}/create`
      }

      return '/product/create'
    },

    async loadProducts() {
      const res = await fetch(this.getListUrl())
      // const res = await fetch(`http://localhost:8080${this.getListUrl()}`)

      const data = await res.json()
      this.products = Array.isArray(data.result) ? data.result : []
    },

    formatUrl(url) {
      if (!url) return '#'
      return url.startsWith('http') ? url : 'https://' + url
    },

    imageList(imagePath) {
      if (!imagePath) return []

      return imagePath
        .split(',')
        .map((img) => img.trim())
        .filter((img) => img.length > 0)
    },

    imageUrl(img) {
      if (!img) return ''
      if (img.startsWith('http')) return img
      if (img.startsWith('/')) return `http://34.47.71.107:8080${img}`
      return `http://34.47.71.107:8080/${img}`
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
        images: [],
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
      this.form.images = []

      this.isModalOpen = true
    },

    handleImage(event) {
      const files = Array.from(event.target.files)

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

      if (this.isEditMode) {
        if (this.form.images.length > 0) {
          formData.append('image', this.form.images[0])
        }

        await fetch(`/product/update/${this.editIdx}`, {
          // await fetch(`http://localhost:8080/product/update/${this.editIdx}`, {
          method: 'PATCH',
          body: formData,
        })
      } else {
        this.form.images.forEach((file) => {
          formData.append('images', file)
        })

        await fetch(this.getCreateUrl(), {
          // await fetch(`http://localhost:8080${this.getCreateUrl()}`, {
          method: 'POST',
          body: formData,
        })
      }

      this.closeModal()
      await this.loadProducts()
    },

    async deleteProduct(idx) {
      if (!confirm('삭제하시겠습니까?')) return

      await fetch(`/product/delete/${idx}`, {
        // await fetch(`http://localhost:8080/product/delete/${idx}`, {
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

    truncateText(text, max = 50) {
      if (!text) return ''

      return text.length > max ? text.substring(0, max) + '...' : text
    },
  },
}
