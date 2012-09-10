beer-markup
===========

Beer Markup Language (BML)

A beer recipe syntax that is easy to write and read by humans yet has enough structure to be read by brewing software.

###Some Rules
- case insensitive
- order should be inforced as much a possible
- easy to remember


This repository outlines the syntax along with a JavaScript implementation of a BML editor.

###Concept Format
    grain
    8 lbs American 2 row
    1 lb  Crystal 60
    1 lb  Munich Malt - 20L
    1 lb  Cara-pils
    1/2 lb Crystal 120L
    1/2 lb Chocolate Malt 350L
    
    hops
    60 min 3/4 oz Magnum 12%
    10 min 1 oz Cascade 5.5%
    5  min 1 oz Centennial 10%
    
    yeast
    Safeale US-05
    
    stats
    abv 5.2%
    ibu 20
    srm 22
    brewers Jose, Sean
    size 5 Gallons
    
    notes
    Yummy!
    
    mash
    TBA
    
##Commands



###Section Commands

Every section of the BML script needs to start with a section command.

- grain | grains | fermentable | fermentables
- hop | hops
- yeast 
- stats

###Grain Commands

- [amount][unit] [fermentable name] <points per gallon> <color>




