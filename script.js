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
        this.colors = ['gray', 'white', 'lightblue', 'green', 'red', 'orange', 'yellow', 'purple', 'cyan', 'pink', '#333', '#7FFF00', '#B0C4DE', '#3CB371']
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
            ],
            [
                [0, random],
                [1, random + 1],
                [1, random],
                [2, random]
            ],
            [
                [1, random],
                [0, random - 1],
                [0, random],
                [1, random + 1]
            ],
            [
                [0, random],
                [1, random],
                [2, random],
                [3, random],
                [3, random + 1]
            ],
            [
                [0, random],
                [0, random + 1],
                [1, random],
                [1, random + 1],
            ],
            [
                [0, random - 1],
                [0, random],
                [0, random + 1],
                [0, random + 2],
            ],
        ]
        
        const positionRandom = Math.floor(Math.random() * blocks.length);
        return blocks[positionRandom]
    }

    events() {
        document.addEventListener('keydown', e => {
            if(this.newBlock)
                this.newBlock.map(block => this.board[block[0]][block[1]] = 0); 
            switch(e.code) {
                case 'ArrowLeft':
                    const verifyLeft = this.newBlock ? this.newBlock.map(item => item[1]).sort()[0] : 0
                    const blockVerifyLeft =  this.newBlock.sort((a, b) => b[1] - a[1])[0]

                    if(verifyLeft > 0) {
                        if(this.board[blockVerifyLeft[0]][blockVerifyLeft[1] - 1] == 0) {
                            this.newBlock = this.newBlock.map(block => {
                                this.board[block[0]][block[1]] = 0;
                                return [block[0], block[1] - 1]
                            })
                        } 
                    }
                    break;
                case 'ArrowRight':
                    const verifyRight = this.newBlock.map(item => item[1]).sort()[0]
                    const blockVerifyRight =  this.newBlock.sort((a, b) => a[1] - b[1])[0]

                    if(verifyRight < (this.board[0].length - this.newBlock[0].length)) {
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
                    const positionCenter = Math.floor(this.newBlock.length / 2)
                    const blockCenter = this.newBlock[positionCenter];
                    this.newBlock = this.newBlock.map(block => {
                        const diffX = block[1] - blockCenter[1]
                        const diffY = block[0] - blockCenter[0]

                        let quadrant = null;
                        if(diffX === 0 && diffY === 0) {
                            quadrant = 0;
                        } else {
                            if(diffX !== 0 && diffY !== 0) {
                                if(diffX > 0 && diffY < 0) {
                                    quadrant = 1;
                                } else if(diffX < 0 && diffY < 0) {
                                    quadrant = 2;
                                } else if(diffX < 0 && diffY > 0) {
                                    quadrant = 3;
                                } else if(diffX > 0 && diffY > 0) {
                                    quadrant = 4;
                                }
                            } else {
                                if(diffX === 0) {
                                    if(diffY < 0)
                                        quadrant = 1
                                    else if(diffY > 0)
                                        quadrant = 4
                                } else if(diffY === 0) {
                                    if(diffX < 0)
                                        quadrant = 2
                                    else if(diffX > 0)
                                        quadrant = 1
                                }
                            }
                        }

                        console.log(`
(DiffX: ${diffX} and DiffY: ${diffY})
    Quadrant: ${quadrant}
                        `)
                        return block;

                        // console.log('Diff', diff)
                        const diff = diffX + diffY
                        // if(diff == 0) {
                        //     return block
                        // } else if(diff > 0) {
                        //     return [block[0] - diff, block[1] + diff]
                        // } else {
                        //     return [block[0] + diff, block[1] - diff]
                        // }
                    })
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
                // min and max size block in list
                const blockHorizontalRandom = Math.floor(Math.random() * ((this.blocksHorizontal - 2) - 1) + 1);
                this.newBlock = this.generateBlocks(blockHorizontalRandom)
                this.newBlock.map(block => {
                    this.board[block[0]][block[1]] = this.newNumberColor;
                })
            } else {
                const lastBlock = this.newBlock.at(-1);       

                if(this.newBlock) {
                    try {
                        if(lastBlock[0] < (this.board.length - 1) && this.newBlock.reverse().filter(block => {
                            return this.board[block[0] + 1][block[1]] > 0 && this.newBlock.filter(blockFilter => blockFilter[0] === block[0] + 1 && blockFilter[1] === block[1]).length === 0
                        }).length === 0) {
        
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
                    } catch(error) {
                        console.log(error)
                    }
                }
            }

            this.draw()
            setTimeout(() => this.move(), this.fastSpeed ? 50 / this.speed : 150 / this.speed)
        }
    }

    draw() {
        const sizeBoxWidth = this.canvas.width / this.board[0].length;
        const sizeBoxHeight = this.canvas.height / this.board.length;

        for(let i = 0; i < this.board.length; i++) {
            for(let j = 0; j < this.board[i].length; j++) {
                this.ctx.fillStyle = 'darkgray'
                this.ctx.fillRect((j * sizeBoxWidth), (i * sizeBoxHeight), sizeBoxWidth, sizeBoxHeight);
                this.ctx.fillStyle = this.colors[this.board[i][j]];
                this.ctx.fillRect((j * sizeBoxWidth) + 0.5, (i * sizeBoxHeight) + 0.5, sizeBoxWidth - 0.5, sizeBoxHeight - 0.5);
            }
        }

        this.ctx.fillStyle = '#fff'
        this.ctx.fillText(`Score: ${this.score}`, 10, 20, 200);
        this.ctx.fillText(`Record: ${this.record}`, 10, 35, 200);
    }

}

const canvas = document.getElementById('canvas');
const game = new Game(canvas, 300, 620, 11, 20)
