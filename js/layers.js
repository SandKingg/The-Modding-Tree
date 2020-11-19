addLayer("c", {
    name: "crystals", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#CEDBD9",
    requires: function() {return new Decimal(10)}, // Can be a function that takes requirement increases into account
    resource: "crystals", // Name of prestige currency
    baseResource: "mana", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	    if (hasUpgrade(this.layer, 13)) mult = mult.times(upgradeEffect(this.layer, 13))
	    if (hasUpgrade(this.layer, 22)) mult = mult.times(upgradeEffect(this.layer, 22))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "Reset for crystals", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    upgrades: {
        rows: 2,
        cols: 3,
        11: {
            title: "Potency",
            description: "Double mana gain.",
            cost: new Decimal(1),
            effect() {return new Decimal(2)},
        },

        12: {
            title: "Conduits",
            description: "Crystals boost mana gain.",
            cost: new Decimal(3),
            effect() {
                var initial = player[this.layer].points.add(1).log10().add(1) //log(crystals+1)+1
                return hasUpgrade(this.layer, 21) ? initial.exp(2) : initial
            }, 
        },

        13: {
            title: "Growth",
            description: "Mana boosts crystal gain.",
            cost: new Decimal(6),
            effect() {return player.points.add(1).log10().exp(1.05)}, //log(mana+1)^1.1
        },

        21: {
            title: "Empowered Conduits",
            description: "<b>Conduits</b> power increased.", //new: (log(crystals+1)+1)^2
            cost: new Decimal(35),
        },

        22: {
            title: "Fractalisation",
            description: "Crystals boost crystal gain.",
            cost: new Decimal(200),
            effect() {return player[this.layer].points.add(1).log10().add(1).log2()}, //log2(log(crystals+1)+1)
        },

        23: {
            title: "Deluge",
            description: "Mana boosts mana gain.",
            cost: new Decimal(1e3),
            effect() {return player.points.add(1).log10().add(1)}, //log(mana+1)+1
        },
    },

    layerShown(){return true}
})

addLayer("o", {
    name: "orbs", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "O", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#53EDB3",
    requires: function() {return new Decimal(5e4)}, // Can be a function that takes requirement increases into account
    resource: "orbs", // Name of prestige currency
    baseResource: "crystals", // Name of resource prestige is based on
    baseAmount() {return player["c"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["c"],
    exponent: new Decimal(0.5), // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "o", description: "Reset for orbs", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){return player.c.unlocked}
})

/*addLayer("f", {
    name: "fire", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#CEDBD9",
    requires: function() {return player[this.layer].upgrades.includes(22) ? new Decimal(7) : new Decimal(10)}, // Can be a function that takes requirement increases into account
    resource: "fire", // Name of prestige currency
    baseResource: "crystals", // Name of resource prestige is based on
    baseAmount() {return player["c"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
})*/
