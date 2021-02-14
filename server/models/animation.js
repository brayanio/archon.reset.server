module.exports = class{

    constructor(name){
        this.name = name
        this.sfx = []
    }

    /* Spawn Targets
    
    self, target, enemies, allies

    */
    addSFX(spawntarget, offsetSpawnTime, img, width, height, offsetX, offsetY, duration, tick){
        this.sfx.push({
            spawntarget,
            offsetSpawnTime,
            img,
            width,
            height,
            offsetX,
            offsetY,
            duration,
            tick,
            frame: 0
        })
        return this
    }

    tick(){
        this.sfx = this.sfx.filter(sfx => {
            sfx.tick()
            sfx.frame++
            if(sfx.frame >= duration)
                return false
            return true
        })
    }

    exportable(){
        return {
            sfx: this.sfx.map(sfx => { return {
                spawntarget: sfx.spawntarget,
                img: sfx.img,
                width: sfx.width,
                height: sfx.height,
                offsetX: sfx.offsetX,
                offsetY: sfx.offsetY,
                active: sfx.offsetSpawnTime <= sfx.frame
            }})
        }
    }

}