module.exports = class{

    constructor(vitality, energy, power, vitalityRegen, energyRegen){
        this.vitality = vitality
        this.energy = energy
        this.power = power
        this.vitalityRegen = vitalityRegen
        this.energyRegen = energyRegen
        this.shield = 0
        this.base = {
            vitality: vitality + 0,
            energy: energy + 0,
            power: power + 0,
            vitalityRegen: vitalityRegen + 0,
            energyRegen: energyRegen + 0,
            shield: 0
        }
    }

    reset(){
        this.vitality = this.base.vitality
        this.energy = this.base.energy
        this.power = this.base.power
        this.vitalityRegen = this.base.vitalityRegen
        this.energyRegen = this.base.energyRegen
        this.shield = this.base.shield
    }

    exportable(){
        return {
            vitality: this.vitality,
            energy: this.energy,
            shield: this.shield
        }
    }

}