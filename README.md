beer-markup
===========

Beer Markup Language (BML)

A beer recipe syntax that is easy to write and read by humans yet has enough structure to be read by brewing software.

###Concepts
- case insensitive
- order should be inforced as much a possible
- easy to remember


This repository outlines the syntax along with a JavaScript implementation of a BML editor.

###Example BML Snippet
    info
    ----------------------------
    style: 10A 2008
    brewers: Jose, Sean
    batch size: 5 Gallons

    grain
    ----------------------------
    8 lbs American 2 row 1.8L 37PPG 
    1 lb  Crystal 60 60L 34PPG
    
    hops
    ----------------------------
    60 min 3/4 oz Magnum 12%
    5  min 1 oz Centennial 10%
    
    yeast
    ----------------------------
    1pkg Safeale US-05 75%
    
    stats
    ----------------------------
    abv: 5.2%
    ibu: 20
    srm: 22
    
    
    notes
    ----------------------------
    Yummy!

##Section Commands

The beer markup is separated into different sections using the secion commands:
    info
    grain
    hops
    yeast 
    stats

Every section of the script have different formatating rules.

###Grain Section

- [amount] [unit] [fermentable name] [points per gallon]PPG [color]L

Examples

    10lbs US 2-Row
    10 lb 2row
    8 oz roasted special: 25ppg 400l


