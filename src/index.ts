import Phaser from "phaser"
import defaultScene from './scenes/defaultScene'
import connectScene from "./scenes/connectScene";

const canv = document.getElementById("mainG") as HTMLCanvasElement
if(canv === null){
    throw console.error("Cannot find supplied Canvas...");
    
}
const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.CANVAS,
	width: 800,
	height: 600,
	canvas: canv,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
    backgroundColor: '#fabb77',
	scene: [connectScene, defaultScene]
}

export default new Phaser.Game(config)