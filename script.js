class Game {
    constructor(canvas, width, height, blocksHorizontal, blocksVertical) {
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.blocksHorizontal = blocksHorizontal
        this.blocksVertical = blocksVertical

        this.bootstrap();
        this.events();
        this.start();
    }

    bootstrap() {
        this.ctx = canvas.getContext('2d')
        this.colors = ['#333', 'white', 'blue', 'green', 'red', 'yellow', 'brown', 'purple']
        this.speed = 1
        this.fastSpeed = false
    }

    events() {
        document.addEventListener('keydown', e => {
            this.board[this.newBlock[0]][this.newBlock[1]] = 0;
            switch(e.code) {
                case 'ArrowLeft':
                    if(this.newBlock[1] > 0) {
                        if(this.board[this.newBlock[0]][this.newBlock[1] - 1] == 0)
                            this.newBlock[1] -= 1;
                    }
                    break;
                case 'ArrowRight':
                    if(this.newBlock[1] < this.board[0].length - 1) {
                        if(this.board[this.newBlock[0]][this.newBlock[1] + 1] == 0)
                            this.newBlock[1] += 1;
                    }
                    break;
                case 'ArrowDown':
                    this.fastSpeed = true;
                    break;
                default: return;
            }
        });
        document.addEventListener('keyup', e => {
            switch(e.code) {
                case 'ArrowDown':
                    this.fastSpeed = false;
                    break;
                default: return;
            }
        })
    }

    start() {
        let newBoard = []
        for(let i = 0; i < this.blocksVertical; i++) {
            let line = []
            for(let j = 0; j < this.blocksHorizontal; j ++) {
                line.push(0)
            }
            newBoard.push(line)
        }
        this.board = newBoard
        this.newNumberColor = Math.floor(Math.random() * (this.colors.length - 1) + 1)
        this.score = 0
        const beforeRecord = window.localStorage.getItem('@record');
        this.record = beforeRecord || 0;
        this.speed = 1
        this.fastSpeed = false

        this.move()
    }

    verifyGameover() {
        const verify = this.board[0].reduce((total, current) => total += current, 0)
        return verify > 0 && (this.newBlock == null || this.newBlock[0] !== 0)
    }

    gameover() {
        alert('Gamer over');
        const beforeRecord = window.localStorage.getItem('@record');
        if(this.score > beforeRecord) {
            window.localStorage.setItem('@record', this.score)
            alert('New record!!!');
        }
        this.start();
    }

    verifyScore() {
        for(let i = 0; i < this.board.length; i++) {
            const counter = this.board[i].reduce((total, current) => total += current === 0 ? 1 : 0, 0)
            if(counter == 0) {
                this.score += 10
                this.speed += 0.1
                let newFirstLine = []
                for(let i = 0; i < this.blocksHorizontal; i++) {
                    newFirstLine.push(0)
                }
                this.board = [newFirstLine, ...this.board.filter((_, key) => key !== i)]
            }
        }
    }

    move() {
        this.verifyScore();

        if(this.verifyGameover()) {
            this.gameover();
        } else {
            if(!this.newBlock) {
                const blockHorizontalRandom = Math.floor(Math.random() * (this.blocksHorizontal));
                this.newBlock = [0, blockHorizontalRandom]
                this.board[this.newBlock[0]][this.newBlock[1]] = this.newNumberColor;
            } else {
                if(this.newBlock[0] < (this.board.length - 1) && this.board[this.newBlock[0] + 1][this.newBlock[1]] == 0) {
                    this.board[this.newBlock[0]][this.newBlock[1]] = 0;
                    this.newBlock = [this.newBlock[0] + 1, this.newBlock[1]]
                    this.board[this.newBlock[0]][this.newBlock[1]] = this.newNumberColor;
    
                    if(this.newBlock[0] === (this.board.length - 1)) {

                        this.newBlock = null
                        this.newNumberColor = Math.floor(Math.random() * (this.colors.length - 1) + 1)
                    }
                } else {
                    this.newBlock = null
                    this.newNumberColor = Math.floor(Math.random() * (this.colors.length - 1) + 1)
                }
            }
    
            this.draw()
            setTimeout(() => this.move(), this.fastSpeed ? 30 / this.speed : 100 / this.speed)
        }
    }

    draw() {
        const sizeBoxWidth = this.canvas.width / this.board[0].length;
        const sizeBoxHeight = this.canvas.height / this.board.length;

        for(let i = 0; i < this.board.length; i++) {
            for(let j = 0; j < this.board[i].length; j++) {
                this.ctx.fillStyle = this.colors[this.board[i][j]];
                this.ctx.fillRect((j * sizeBoxWidth), (i * sizeBoxHeight), sizeBoxWidth, sizeBoxHeight);
            }
        }

        this.ctx.fillStyle = '#fff'
        this.ctx.fillText(`Score: ${this.score}`, 10, 20, 100);
        this.ctx.fillText(`Record: ${this.record}`, 10, 35, 100);
    }

}

const canvas = document.getElementById('canvas');
const game = new Game(canvas, 300, 620, 11, 20)
