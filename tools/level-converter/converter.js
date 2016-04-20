#!/usr/bin/env node

/*
 A tool to convert maps

 Convert from:

 #####
 #   #
 #o  #
 ###  o##
 #  o o #
 ### # ## #   ######
 #   # ## #####  ..#
 # o  o          ..#
 ##### ### #@##  ..#
 #     #########
 #######

 Where o stands for box, # stands for wall, . stands for target, @ stands for person
 To levels.js which this game can recognize.

 */

var max_map_size = 20;


var fs = require("fs");
var path = require("path");
var levels = [];

function makeLevel(fContent) {
    if (!fContent) return;
    var lines = fContent.split("\n");
    var height = lines.length;
    var width = -1;
    lines.forEach(function (d) {
        if (d.length > width) width = d.length;
    });
    if (width > max_map_size || height > max_map_size) return;
    var level = {map: [], person: {}, box: []};
    for (var y = 0; y < height; y++) {
        var map_line = [];
        for (var x = 0; x < width; x++) {
            var char;
            if (x < lines[y].length) {
                char = lines[y][x];
            } else {
                char = " ";
            }
            //o$: box, .: target, #: wall, *: box on target, +: person on target, @: person
            map_line.push({' ': 0, '#': 1, 'o': 0, '@': 0, '.': 2, '$': 0, '+': 2, '*': 2}[char]);
            if (char == "@" || char == "+")
                level.person = {x: x, y: y};
            if (char == 'o' || char == '$' || char == '*') {
                level.box.push({x: x, y: y});
            }
        }
        level.map.push(map_line);
    }
    levels.push(level);
}

function splitLevels(fContent) {
    fContent = fContent.replace(/;.+?$/mg, "");
    return fContent.split(/\n\n+/m);
}

function readDir(dirPath) {
    var files = fs.readdirSync(dirPath);
    for (var n = 0; n < files.length; n++) {
        var file = path.join(dirPath, files[n]);
        if (fs.lstatSync(file).isDirectory()) {
            readDir(file);
        } else {
            var fContent = fs.readFileSync(file, {encoding: "utf8"});
            splitLevels(fContent).forEach(function (f) {
                makeLevel(f);
                //console.log(f);
            });
        }
    }
}

readDir("data");

console.log(levels.length + " levels created");
fs.writeFileSync("levels.js",
    "//0:aisle\n//1:wall\n//2:target\nvar levelsData =" +
    JSON.stringify(levels)
    , {encoding: "utf8"}
);
