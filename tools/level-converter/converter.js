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


Map source: https://github.com/scrooloose/sokoban
*/

var fs = require("fs");
var files = fs.readdirSync("data");

var levels = [];

for (var n = 0; n < files.length; n++) {
    var file = "data/" + files[n];
    var fContent = fs.readFileSync(file, {encoding: "utf8"});
    var lines = fContent.split("\n");
    var height = lines.length;
    var width = -1;
    lines.forEach(function (d) {
        if (d.length > width) width = d.length;
    });
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
            //o: box, .: target, #: wall
            map_line.push({' ': 0, '#': 1, 'o': 0, '@': 0, '.': 2}[char]);
            if (char == "@")
                level.person = {x: x, y: y};
            if (char == 'o') {
                level.box.push({x: x, y: y});
            }
        }
        level.map.push(map_line);
    }
    levels.push(level);
}

fs.writeFileSync("levels.js",
    "//0:aisle\n//1:wall\n//2:target\nvar levelsData =" +
    JSON.stringify(levels)
    , {encoding: "utf8"}
);
