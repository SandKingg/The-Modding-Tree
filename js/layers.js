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

    doReset(resettingLayer){
        if (resettingLayer == "c") return

        var keep = []
        if(hasMilestone("o",0)){
            keep.push("upgrades")
        }
        layerDataReset("c",keep)
    },

    upgrades: {
        rows: 3,
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
                return hasUpgrade(this.layer, 21) ? initial.pow(2) : initial
            },
            effectDisplay() {return format(tmp.c.upgrades[12].effect)+"x"}, 
        },

        13: {
            title: "Growth",
            description: "Mana boosts crystal gain.",
            cost: new Decimal(6),
            effect() {return player.points.add(1).log10().sqrt().add(1)}, //sqrt(log(mana+1))+1
            effectDisplay() {return format(tmp.c.upgrades[13].effect)+"x"}, 
        },

        21: {
            title: "Empowered Conduits",
            description: "<b>Conduits</b> power increased.", //new: (log(crystals+1)+1)^2
            cost: new Decimal(20),
        },

        22: {
            title: "Fractalisation",
            description: "Crystals boost crystal gain.",
            cost: new Decimal(50),
            effect() {return player[this.layer].points.add(1).log10().add(1).log2().add(1)}, //log2(log(crystals+1)+1)+1
            effectDisplay() {return format(tmp.c.upgrades[22].effect)+"x"}, 
        },

        23: {
            title: "Deluge",
            description: "Mana boosts mana gain.",
            cost: new Decimal(100),
            effect() {
                let x = player.points.add(1).log10().add(1).exp(hasUpgrade(this.layer, 32) ? upgradeEffect(this.layer, 32) : 1)
                let cap = hasAlignmentUpgrade("f",12) ? new Decimal(1e8) : new Decimal(1e7)
                return softcap(x,cap)
            }, //log(mana+1)+1; softcapped at 10M
            effectDisplay() {return format(tmp.c.upgrades[23].effect)+"x"}, 
        },

        31: {
            title: "Accumulation",
            description: "Crystal upgrades boost mana gain.",
            cost: new Decimal(350),
            effect() {
                let base = new Decimal(player.c.upgrades.length);
                base = base.pow(0.15);
                return base;
            }, //upgrades^0.1
            effectDisplay() {return "^"+format(tmp.c.upgrades[31].effect)}, 
        },

        32: {
            title: "Addendum",
            description: "Crystal upgrades exponentiate the <b>Deluge</b> effect.", //new: (log(mana+1)+1)^upgrades
            cost: new Decimal(1e3),
            effect() {return new Decimal(player.c.upgrades.length)},
            effectDescription() {return "^"+format(tmp.c.upgrades[32].effect)}, 
        },

        33: {
            title: "Acquired Knowledge",
            description: "Crystal upgrades boost mana gain.", //(upgrades*0.02)+1
            cost: new Decimal(2e6),
            effect() {return new Decimal(player.c.upgrades.length).times(0.015).add(1)},
            effectDisplay() {return "^"+format(tmp.c.upgrades[33].effect)}, 
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
    requires: function() {return new Decimal(2e17)}, // Can be a function that takes requirement increases into account
    resource: "orbs", // Name of prestige currency
    baseResource: "mana", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["c"],
    exponent: new Decimal(0.25), // Prestige currency exponent
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
    effectBase() {
        return new Decimal(2)
    },
    effect() {
        return tmp.o.effectBase.times(player.o.points)
    },
    effectDescription() {
        return "which are boosting mana generation by "+format(tmp.o.effect)+"x"
    },

    upgrades: {
        rows: 2,
        cols: 5,

        11: {
            title: "Chosen",
            description: "Unlock Elemental Alignments",
            cost: new Decimal(2),
        },
    },

    milestones: {
        0: {
            requirementDescription: "25 orbs",
            effectDescription: "Keep Crystal upgrades on reset",
            done() {return player.o.points.gte(25)},
        },
    },

    layerShown(){return player.c.unlocked}
})

addLayer("a", {
    name: "alignments",
    symbol: "A",
    position: 0,
    row: "side",
    color: "#EFE87C",
    baseResource: "mana", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    resource: "alignment points",
    tooltip() {
        return("Elemental Alignments")
    },
    startData() { return {
        unlocked: true,
        points: new Decimal(1),
        aligned: '',
    }},
    effectDescription() {
        if(player.a.aligned == ''){
            return "choose carefully."
        } else {
            return "you have already aligned with your chosen element."
        }
    },

    upgrades: {
        rows: 1,
        cols: 4,

        11: {
            title: "Fire",
            description: "Aligns with fire. Fire focuses on passive bonuses and synergy between layers.",
            cost: new Decimal(1),
            onPurchase() {player.a.aligned = 'f'},
        }
    },

    layerShown(){return hasUpgrade("o", 11)}
})

addLayer("f", {
    name: "fire", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: "side",
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["a"],
    resource: "fire",
    baseResource: "mana", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    tooltip() {
        return("Fire")
    },
    color: "#F76429",
    effect() {
        let eff = new Decimal(1)
        if(hasAlignmentUpgrade("f", 11)) eff = eff.times(tmp.f.upgrades[11].effect)
        return eff
    },
    effectDescription() {
        return "which are boosting mana generation by "+format(tmp.f.effect)+"x"
    },

    upgrades: {
        rows: 1,
        cols: 6,

        11: {
            title: "Warmth",
            description: "Fire boosts mana gain.",
            cost: new Decimal(1),
            currencyInternalName: "points",
            currencyDisplayName: "mana",
            effect() {return new Decimal(5).times(player.f.points)},
            effectDisplay() {return format(tmp.f.upgrades[11].effect)+"x"}, 
        },

        12: {
            title: "Ignition",
            description: "Lessen the <b>Deluge</b> softcap.", //new: 100M
            cost: new Decimal(1e20),
            currencyInternalName: "points",
            currencyDisplayName: "mana",
        },
    },

    update(diff){
        player.f.points = new Decimal(player.f.upgrades.length)
    },

    layerShown(){return player.a.aligned == 'f'}
})
