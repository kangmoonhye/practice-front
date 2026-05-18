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
        return `/product/list/${boardIdx}`
      }

      return '/product/list'
    },

    getCreateUrl() {
      const boardIdx = this.getBoardIdx()

      if (boardIdx) {
        return `/product/create/${boardIdx}`
      }

      return '/product/create'
    },

    async parseJsonResponse(res) {
      const text = await res.text()

      if (!res.ok) {
        console.error('[API ERROR]', res.status, text)
        throw new Error(`API 요청 실패: ${res.status}`)
      }

      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.error('[API HTML RESPONSE]', text)
        throw new Error(
          'API가 JSON이 아니라 HTML을 반환했습니다. 백엔드 경로 또는 nginx 설정을 확인해야 합니다.',
        )
      }

      return JSON.parse(text)
    },

    async loadProducts() {
      try {
        const url = this.getListUrl()
        console.log('[loadProducts] url:', url)

        const res = await fetch(url)
        const data = await this.parseJsonResponse(res)

        this.products = Array.isArray(data.result) ? data.result : []

        console.log('[loadProducts] products:', this.products)
      } catch (error) {
        console.error('[loadProducts] 실패:', error)
        alert(error.message)
        this.products = []
      }
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

      try {
        if (this.isEditMode) {
          if (this.form.images.length > 0) {
            formData.append('image', this.form.images[0])
          }

          const res = await fetch(`/product/update/${this.editIdx}`, {
            method: 'PATCH',
            body: formData,
          })

          await this.parseJsonOrTextResponse(res)
        } else {
          this.form.images.forEach((file) => {
            formData.append('images', file)
          })

          const res = await fetch(this.getCreateUrl(), {
            method: 'POST',
            body: formData,
          })

          await this.parseJsonOrTextResponse(res)
        }

        this.closeModal()
        await this.loadProducts()
      } catch (error) {
        console.error('[createProduct] 실패:', error)
        alert(error.message)
      }
    },

    async parseJsonOrTextResponse(res) {
      const text = await res.text()

      if (!res.ok) {
        console.error('[API ERROR]', res.status, text)
        throw new Error(`API 요청 실패: ${res.status}`)
      }

      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.error('[API HTML RESPONSE]', text)
        throw new Error(
          'API가 JSON/텍스트가 아니라 HTML을 반환했습니다. 백엔드 경로 또는 nginx 설정을 확인해야 합니다.',
        )
      }

      return text
    },

    async deleteProduct(idx) {
      if (!confirm('삭제하시겠습니까?')) return

      try {
        const res = await fetch(`/product/delete/${idx}`, {
          method: 'DELETE',
        })

        await this.parseJsonOrTextResponse(res)
        await this.loadProducts()
      } catch (error) {
        console.error('[deleteProduct] 실패:', error)
        alert(error.message)
      }
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

    formatPrice(price) {
      if (!price) return '0원'

      const num = Number(price)

      const man = Math.floor(num / 10000)
      const rest = num % 10000

      if (rest === 0) {
        return `${man.toLocaleString()}만 원`
      }

      return `${man.toLocaleString()}만 ${rest.toLocaleString()}원`
    },
  },
}
