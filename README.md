beer-markup
===========

Beer Markup Language (BML)

A beer recipe syntax that is easy to write and read by humans yet has enough structure to be read by brewing software.

[Demo BML Client](http://frodare.com/bml/)

###Concepts
- case insensitive
- order should not be inforced as much a possible
- easy to remember


This repository outlines the syntax along with a JavaScript implementation of a BML editor.

###Example BML Snippet
    --INFO-----------------------------
    style: 10A 2008 American Pale Ale
    name:Demo Pale
    brewers: Jose, Sean
    size: 5 Gallons
    og: 1.055
    fg: 1.016

    --GRAIN----------------------------
    8 lbs American 2 row [1.8L 37PPG]
    1 lb  Crystal 60 [60L 34PPG]
    
    --HOPS-----------------------------
    60 min 3/4 oz Magnum [12%]
    5  min 1 oz Centennial [10%]
    
    --YEAST----------------------------
    1pkg Safeale US-05 [75%]

    --NOTES----------------------------
    Yummy!


