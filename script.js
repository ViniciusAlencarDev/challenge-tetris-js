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

    generateBlocks(random) {
        const blocks = [
            [
                [0, random - 1],
                [0, random],
                [0, random + 1],
                [1, random]
            ]
        ]
        
        const positionRandom = Math.floor(Math.random() * blocks.length);
        return blocks[positionRandom]
    }

    events() {
        document.addEventListener('keydown', e => {this.newBlock.map(block => this.board[block[0]][block[1]] = 0); 
            switch(e.code) {
                case 'ArrowLeft':
                    let smallesNumberLeft = null;
                    this.newBlock.map((block, key) => {
                        if(smallesNumberLeft === null)
                            smallesNumberLeft = key;
                        else {
                            if(block[1] < smallesNumberLeft)
                            smallesNumberLeft = key;
                        }
                    })
                    const blockVerifyLeft = this.newBlock[smallesNumberLeft];

                    if(blockVerifyLeft[1] > 0) {
                        if(this.board[blockVerifyLeft[0]][blockVerifyLeft[1] - 1] == 0) {
                            this.newBlock = this.newBlock.map(block => {
                                this.board[block[0]][block[1]] = 0;
                                return [block[0], block[1] - 1]
                            })
                            
                        }
                    }
                    break;
                case 'ArrowRight':
                    let smallesNumberRight = null;
                    this.newBlock.map((block, key) => {
                        if(smallesNumberRight === null)
                            smallesNumberRight = key;
                        else {
                            if(block[1] > smallesNumberRight)
                            smallesNumberRight = key;
                        }
                    })
                    const blockVerifyRight = this.newBlock[smallesNumberRight];

                    if(blockVerifyRight[1] < (this.board[0].length - 1)) {
                        if(this.board[blockVerifyRight[0]][blockVerifyRight[1] + 1] == 0) {
                            this.newBlock = this.newBlock.map(block => {
                                this.board[block[0]][block[1]] = 0;
                                return [block[0], block[1] + 1]
                            })
                            
                        }
                    }
                    break;
                case 'ArrowDown':
                    this.fastSpeed = true;
                    break;
                case 'ArrowUp':
                    this.newBlock = this.newBlock.map(block => {
                        this.board[block[0]][block[1]] = 0;
                        return block
                    }).reverse()
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
        return verify > 0 && (this.newBlock == null || this.newBlock.reduce((total, block) => total += block[0]) > 0)
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
                const blockHorizontalRandom = Math.floor(Math.random() * ((this.blocksHorizontal - 1)- 1) + 1);
                this.newBlock = this.generateBlocks(blockHorizontalRandom)
                this.newBlock.map(block => {
                    this.board[block[0]][block[1]] = this.newNumberColor;
                })
            } else {
                const lastBlock = this.newBlock[this.newBlock.length - 1];

                

                if(lastBlock[0] < (this.board.length - 1)) {

                    // const blocksBellow = this.newBlock.filter(block => {
                    //     return this.board[block[0] + 1][block[1]] > 0 && tihis.newBlock.filter(blockFilter => blockFilter[0] === block[0] + 1 && blockFilter[1] === block[1])
                    // })
                    // console.log('Blocks Bellow', blocksBellow)

                    let newBlock = [];
                    this.newBlock.reverse().map(block => {
                        this.board[block[0]][block[1]] = 0;
                        newBlock.push([block[0] + 1, block[1]])
                    })
                    this.newBlock = newBlock
                    this.newBlock.map(block => {
                        this.board[block[0]][block[1]] = this.newNumberColor;
                    })

                    if(lastBlock[0] === (this.board.length - 1)) {
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
