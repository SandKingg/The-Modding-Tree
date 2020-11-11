addLayer("c", {
    name: "crystal", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#CEDBD9",
    requires: function() {return player[this.layer].upgrades.includes(22) ? new Decimal(7) : new Decimal(10)}, // Can be a function that takes requirement increases into account
    resource: "crystals", // Name of prestige currency
    baseResource: "mana", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
	    if (hasUpgrade(this.layer, 21)) exp = exp.times(upgradeEffect("c", 21))
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "Reset for crystals", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    upgrades: {
        rows: 2,
        cols: 2,
        11: {
            title: "Potency",
            description: "Double mana gain.",
            effect() {return new Decimal(2)},
            cost: new Decimal(1)
        },

        12: {
            title: "Conduits",
            description: "Crystals boost mana gain.",
            effect() {return player[this.layer].points.add(1).log10().add(1)},
            cost: new Decimal(3)
        },

        21: {
            title: "Efficiency",
            description: "The crystal gain formula is better.",
            cost: new Decimal(6),
            effect() {return new Decimal(1.5)}
        },

        22: {
            title: "Crafting",
            description: "Reduces the base mana required to generate crystals.",
            cost: new Decimal(20),
        }
    },

    layerShown(){return true}
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
