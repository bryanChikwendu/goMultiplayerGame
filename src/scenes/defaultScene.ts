import Phaser from 'phaser'
import Puck from '../puck'


export default class defaultScene extends Phaser.Scene
{
  
    boardGraphics
    graphics
    offsetX : number = 200
    offsetY : number = 100
    tileSize : number = 50
    board : Array<Array<Puck>> 
    turnNumber : number = 0
    myColor : number = 0
    myTurn : boolean = false
    
    boardSprite
    ws
    ipStr : string = ""
    init(data){
        this.ipStr = data.ipAddy
    }
	constructor()
	{
       
        
		super('defaultScene')

      
     
        this.board = new Array<Array<Puck>>(9)
        for(let i = 0; i < 9; i++){
            this.board[i] = new Array<Puck>(9);
        }

        for(let y = 0; y < 9; y++){
            for (let x = 0; x < 9; x++){
                this.board[x][y] = new Puck(2, -1, x, y)
            }
        }
	}

	preload()
    {
        this.graphics = this.add.graphics();
        this.boardGraphics = this.add.graphics()
        this.boardGraphics.lineStyle(3, 0x000000, 1)
    }

    create()
    {

        this.ws = new WebSocket('ws://'+this.ipStr+':80/goGame/go')

        this.ws.addEventListener("open", (event) => {
            //
            console.log("Connected Successfully")
          });

        var self = this
        this.ws.addEventListener("message", (event) => {
           self.handleMsg(event.data.toString())
          });


    for(let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
         
            
            this.boardGraphics.strokeRect( this.offsetX + (x * this.tileSize),
                                     this.offsetY + y*this.tileSize,
               this.tileSize, this.tileSize);
            
            
           
        }
    }
    this.boardGraphics.generateTexture('box')
    // this.boardGraphics.destroy()
    // this.boardSprite = this.add.sprite(400 , 300 , 'box')
    this.graphics.setDepth(2)

    var self = this
    this.input.on('pointerdown', function(pointer) {
        self.handleClick(pointer.x, pointer.y)
    }
    , this);
        
       
    }

    update (){

        
        
 // Draw stones
            this.graphics.clear()

            for(let y = 0; y < 9; y++){
               for (let x = 0; x < 9; x++){
                
                    this.graphics.fillStyle(0xffffff * this.board[x][y].colour, this.board[x][y].active ? 1  : 0)
                    if(this.board[x][y].active) {
                    this.graphics.fillCircle( this.offsetX + (x * this.tileSize),
                                              this.offsetY + y*this.tileSize,
                                              15)
                    }
               }
            }       
            
            
    }

  
    placePuck(x_p : number, y_p : number, colour_p : number){
        let p : Puck = new Puck(colour_p, this.turnNumber, x_p, y_p)
        p.active = true
        this.board[x_p][y_p] = p
    
        
    }
     handleClick(exactX : number, exactY : number) {
    if(this.myTurn) {
        // Map X
        let calcX = exactX - (this.offsetX - (this.tileSize / 2))
        calcX = calcX / this.tileSize
        calcX = Math.floor(calcX)
        
        let calcY = exactY - (this.offsetY - (this.tileSize / 2))
        calcY = calcY / this.tileSize
        calcY = Math.floor(calcY)
        
       if( this.requestPlace(calcX, calcY) === true){
        this.placePuck(calcX, calcY, this.myColor)
        this.myTurn = false
       }
    }
    }

    handleMsg(data : string){
        console.log('received: %s', data);
        if(data.startsWith("CONFIG")){
            this.myColor = Number(data.charAt(data.length - 1)) - 1
            console.log("Assigned myself color " + this.myColor) 
            if(this.myColor == 0){
                this.myTurn = true
            }
        }
        else if(data.startsWith("GAME:ADD:")){
            let suffix : string = data.replace("GAME:ADD:", "")
            let dx =  Number(suffix.charAt(0))
            let dy =  Number(suffix.charAt(2))
            this.receivePlace(dx, dy)
        }
        else if (data.startsWith("GAME:DEL:")){
            let suffix : string = data.replace("GAME:DEL:","")
            // [5:7][6:7] -> 5:7  6:7 -> split on double space
            // [5:5] -> 5:5 -> ready to go
            // [5:7][6:7][5:7] -> 5:7  6:7  5:7 
            let modified = suffix.replaceAll("[" , " ").replaceAll("]", " ").trim()
            let a = modified.split("  ")
            for(let i = 0; i < a.length; i++){
                let s = a[i]
                console.log("re: " + s)
                this.receiveRemove(Number(s.split(":")[0]), Number(s.split(":")[1]))
            }
        }
    }
    receivePlace (exactX : number, exactY : number){
        this.placePuck(exactX, exactY, this.myColor === 0 ? 1 : 0)
        // Handle Deletes
        
        this.myTurn = true
    }
    receiveRemove(exactX : number, exactY : number) {
        this.board[exactX][exactY].active = false
        console.log("REMOVING " + exactX + " " + exactY)
    }
    requestPlace(exactX : number, exactY : number) : boolean{
        //placeholder
        //Basic local checks, then networks checks
        if(this.board[exactX][exactY].active === true){
            return false;
        }
        // Send it off to the network, and wait for a message?
        let data : string = (this.myColor + 1) + ":" + exactX + ":" + exactY
        this.ws.send(data)

        return true;
    }
}


