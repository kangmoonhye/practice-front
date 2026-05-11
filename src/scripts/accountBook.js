export default {
  data() {
    return {
      boardIdx: null,

      items: [],
      filteredItems: [],
      selectedMonth: new Date().getMonth() + 1,

      summary: {
        totalAmount: 0,
        hyundaiAmount: 0,
        samsungAmount: 0,
      },

      isModalOpen: false,
      isEditMode: false,
      editIdx: null,

      form: {
        usedDate: '',
        content: '',
        amount: '',
        detail: '',
        card: '현대',
      },
    }
  },

  mounted() {
    this.boardIdx = this.$route.params.boardIdx
    this.loadItems()
  },

  methods: {
    async loadItems() {
      const res = await fetch(`http://localhost:8080/boards/${this.boardIdx}/account-books`)

      const data = await res.json()

      this.items = Array.isArray(data.items) ? data.items : []

      this.filterItems()
    },

    filterItems() {
      if (!this.selectedMonth) {
        this.filteredItems = [...this.items]
      } else {
        this.filteredItems = this.items.filter((item) => {
          const month = Number(item.usedDate.split('-')[1])
          return month === Number(this.selectedMonth)
        })
      }

      this.calculateSummary()
    },

    calculateSummary() {
      const total = this.filteredItems.reduce((sum, item) => sum + Number(item.amount), 0)

      const hyundai = this.filteredItems
        .filter((item) => item.card === '현대')
        .reduce((sum, item) => sum + Number(item.amount), 0)

      const samsung = this.filteredItems
        .filter((item) => item.card === '삼성')
        .reduce((sum, item) => sum + Number(item.amount), 0)

      this.summary = {
        totalAmount: total,
        hyundaiAmount: hyundai,
        samsungAmount: samsung,
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

    resetForm() {
      this.form = {
        usedDate: '',
        content: '',
        amount: '',
        detail: '',
        card: '현대',
      }
    },

    editItem(item) {
      this.isEditMode = true
      this.editIdx = item.idx

      this.form.usedDate = item.usedDate
      this.form.content = item.content
      this.form.amount = item.amount
      this.form.detail = item.detail
      this.form.card = item.card

      this.isModalOpen = true
    },

    async saveItem() {
      if (!this.form.usedDate || !this.form.content || !this.form.amount) {
        alert('날짜, 내용, 금액은 필수입니다.')
        return
      }

      const formData = new FormData()

      formData.append('usedDate', this.form.usedDate)
      formData.append('content', this.form.content)
      formData.append('amount', this.form.amount)
      formData.append('detail', this.form.detail || '')
      formData.append('card', this.form.card)

      if (this.isEditMode) {
        await fetch(`http://localhost:8080/boards/${this.boardIdx}/account-books/${this.editIdx}`, {
          method: 'PATCH',
          body: formData,
        })
      } else {
        await fetch(`http://localhost:8080/boards/${this.boardIdx}/account-books`, {
          method: 'POST',
          body: formData,
        })
      }

      this.closeModal()
      await this.loadItems()
    },

    async deleteItem(idx) {
      if (!confirm('삭제하시겠습니까?')) return

      await fetch(`http://localhost:8080/boards/${this.boardIdx}/account-books/${idx}`, {
        method: 'DELETE',
      })

      await this.loadItems()
    },

    openDatePicker() {
      const input = this.$refs.usedDateInput

      if (input && input.showPicker) {
        input.showPicker()
      } else if (input) {
        input.focus()
      }
    },

    formatDate(date, dayOfWeek) {
      if (!date) return ''

      const [, month, day] = date.split('-')

      return `${Number(month)}/${Number(day)} (${dayOfWeek})`
    },

    formatAmount(amount) {
      if (!amount) return '₩0'

      return '₩' + Number(amount).toLocaleString()
    },

    cardClass(card) {
      if (card === '현대') return 'card-hyundai'
      if (card === '삼성') return 'card-samsung'
      return ''
    },

    goMain() {
      this.$router.push('/')
    },
  },
}
