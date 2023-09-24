export default class Puck {
    colour : integer //0 for black, 1 for white, 2 for inactive
    turnPlaced : integer // -1 for inactive
    x : integer
    y : integer
    active: boolean
    constructor(c : integer = 2, t: integer, x: integer, y: integer){
        this.x = x
        this.y = y
        this.colour = c
        this.turnPlaced = t
        this.active = true

        if(c === 2 || t === -1){
            this.active = false
        }
    }

    
}