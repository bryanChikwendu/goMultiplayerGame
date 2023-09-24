import Phaser from 'phaser'
import defaultScene from '../scenes/defaultScene'


export default class connectScene extends Phaser.Scene
{
    titleText
    ipString : string = "localhost:80"
    ipText
    pendingChange : boolean = false
    preload() {
        
    }

    create() {
        
        this.titleText = this.add.text(200, 100, 'Press P to paste an IP, \nthen press "Enter" \n BackSpace to remove\n', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' , fontSize: '30px', align: 'center' });
       if(this.input.keyboard != null) {
        this.input.keyboard.on('keydown', event =>
        {
            if(event.key === "Backspace"){
                this.removeLetter()
            }
            else if (event.key == "Enter"){
                this.submitIP()
            }
            else {
                this.addLetter(event.key)
            }
           

        });
       }
      
      this.ipText =  this.add.text(200, 300, 'localhost', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' ,fontSize: '20px', align: 'center'});

    }

    update(time: number, delta: number): void {
        if(this.pendingChange) {
            this.ipText.text = this.ipString
            this.pendingChange = false
        }
    }



    removeLetter(){
        this.ipString = ""
        this.pendingChange = true
    }
    async addLetter(c : String){
        
        this.ipString =  await navigator.clipboard.readText()
        this.pendingChange = true
    }
    submitIP(){
        this.scene.start("defaultScene", { ipAddy: this.ipString })
    }
}