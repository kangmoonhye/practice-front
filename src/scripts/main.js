export default {
  data() {
    return {
      boards: [],

      isBoardModalOpen: false,
      boardName: '',
      boardType: 'product',

      isEditBoardModalOpen: false,
      editBoardIdx: null,
      editBoardName: '',
      editBoardPassword: '',
      editBoardType: 'product',

      isPasswordModalOpen: false,
      selectedBoard: null,
      password: '',
    }
  },

  mounted() {
    this.loadBoards()
  },

  methods: {
    async loadBoards() {
      const res = await fetch('/boards/list')
      // const res = await fetch('http://localhost:8080/boards/list')
      this.boards = await res.json()
    },

    openBoardModal() {
      this.boardName = ''
      this.boardType = 'product'
      this.isBoardModalOpen = true
    },

    closeBoardModal() {
      this.boardName = ''
      this.boardType = 'product'
      this.isBoardModalOpen = false
    },

    async createBoard() {
      if (!this.boardName.trim()) {
        alert('게시판 이름을 입력해 주세요.')
        return
      }

      const formData = new FormData()
      formData.append('name', this.boardName)
      formData.append('type', this.boardType)

      await fetch('/boards/create', {
        // await fetch('http://localhost:8080/boards/create', {
        method: 'POST',
        body: formData,
      })

      this.closeBoardModal()
      await this.loadBoards()
    },

    async deleteBoard(boardIdx) {
      if (!confirm('게시판을 삭제하시겠습니까?')) return

      // await fetch(`http://localhost:8080/boards/delete/${boardIdx}`, {
      await fetch(`/boards/delete/${boardIdx}`, {
        method: 'DELETE',
      })

      await this.loadBoards()
    },

    goBoard(board) {
      if (board.password && board.password.trim() !== '') {
        this.selectedBoard = board
        this.password = ''
        this.isPasswordModalOpen = true
        return
      }

      this.moveBoard(board)
    },

    moveBoard(board) {
      if (board.type === 'product') {
        this.$router.push(`/boards/${board.idx}/products`)
        return
      }

      if (board.type === 'account') {
        this.$router.push(`/boards/${board.idx}/account`)
        return
      }

      this.$router.push(`/boards/${board.idx}`)
    },

    async checkBoardPassword() {
      const formData = new FormData()
      formData.append('password', this.password)

      const res = await fetch(
        // `http://localhost:8080/boards/${this.selectedBoard.idx}/check-password`,
        `/boards/${this.selectedBoard.idx}/check-password`,
        {
          method: 'POST',
          body: formData,
        },
      )

      const isValid = await res.json()

      if (!isValid) {
        alert('비밀번호가 틀렸습니다.')
        return
      }

      this.isPasswordModalOpen = false
      this.moveBoard(this.selectedBoard)
    },

    goProductBoard() {
      this.$router.push('/products/list')
    },

    openEditBoardModal(board) {
      this.editBoardIdx = board.idx
      this.editBoardName = board.name
      this.editBoardPassword = ''
      this.editBoardType = board.type || 'product'
      this.isEditBoardModalOpen = true
    },

    closeEditBoardModal() {
      this.editBoardIdx = null
      this.editBoardName = ''
      this.editBoardPassword = ''
      this.editBoardType = 'product'
      this.isEditBoardModalOpen = false
    },

    async updateBoard() {
      if (!this.editBoardName.trim()) {
        alert('게시판 이름을 입력해 주세요.')
        return
      }

      const formData = new FormData()
      formData.append('name', this.editBoardName)
      formData.append('password', this.editBoardPassword || '')
      formData.append('type', this.editBoardType)

      // await fetch(`http://localhost:8080/boards/update/${this.editBoardIdx}`, {
      await fetch(`/boards/update/${this.editBoardIdx}`, {
        method: 'PATCH',
        body: formData,
      })

      this.closeEditBoardModal()
      await this.loadBoards()
    },
  },
}
