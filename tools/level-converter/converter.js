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

 will search data/ directory recursively

 */

var max_map_size = 18;

var hash = require('object-hash');
var fs = require("fs");
var path = require("path");
var levels = [];
var levelHashes = [];

var dotCount = 0;
var duplicateLevelCount = 0;
var skippedLevelCount = 0;

function makeLevelHash(level) {
    return hash(level);
}

function random(low, high) {
    return Math.floor(Math.random() * (high - low)) + low;
}

function makeLevel(fContent) {
    if (!fContent) return;

    process.stdout.write("\033[3" + random(0, 9) + "m\033[4" + random(0, 9) + "m" + ["★", "○", "√", "÷", "×", "©", "￥"][random(0, 5)]);
    dotCount++;
    if (dotCount % 32 == 0)
        process.stdout.write("\033[0m\n");


    //remove trailing \n
    if (fContent.charCodeAt(fContent.length - 1) == 10)
        fContent = fContent.substr(0, fContent.length - 1);

    //o may represent $ in some map formats
    fContent = fContent.replace(/o/g, "$");

    var lines = fContent.split("\n");
    var height = lines.length;
    var width = -1;

    var map_coords = {top: 10000, left: 10000, bottom: -10000, right: -10000};

    lines.forEach(function (d) {
        if (d.length > width) width = d.length;
    });

    if (width > max_map_size || height > max_map_size) {
        skippedLevelCount++;
        return;
    }

    var level = {m: [], p: {}, b: []};
    for (var y = 0; y < height; y++) {
        var map_line = [];
        for (var x = 0; x < width; x++) {
            var char;
            if (x < lines[y].length) {
                char = lines[y][x];
            } else {
                char = " ";
            }
            if (char != " ") {
                if (map_coords.left > x) map_coords.left = x;
                if (map_coords.right < x) map_coords.right = x;
                if (map_coords.top > y) map_coords.top = y;
                if (map_coords.bottom < y) map_coords.bottom = y;
            }
            //$: box, .: target, #: wall, *: box on target, +: person on target, @: person
            map_line.push({' ': 0, '#': 1, 'o': 0, '@': 0, '.': 2, '$': 0, '+': 2, '*': 2}[char]);
            if (char == "@" || char == "+")
                level.p = [x, y];
            if (char == '$' || char == '*') {
                level.b.push([x, y]);
            }
        }
        level.m.push(map_line.join(""));
    }

    if (map_coords.top != 0 || map_coords.left != 0 ||
        map_coords.bottom != height - 1 || map_coords.right != width - 1) {
        //resize map
        var newMap = [];
        for (y = map_coords.top; y <= map_coords.bottom; y++)
            newMap.push(level.map[y].splice(map_coords.left, map_coords.right - map_coords.left + 1));
        level.map = newMap;
        level.person.x -= map_coords.left;
        level.person.y -= map_coords.top;
        level.box.forEach(function (d) {
            d.x -= map_coords.left;
            d.y -= map_coords.top;
        });
    }

    var levelHash = makeLevelHash(level);
    if (levelHashes.indexOf(levelHash) == -1) {
        levelHashes.push(levelHash);
        levels.push([level.m, level.p, level.b]);
    } else {
        duplicateLevelCount++;
    }

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

            //get rid of carriage returns so that all line-breaks will be \n
            fContent = fContent.replace(/\r/g, "");

            splitLevels(fContent).forEach(function (f) {
                makeLevel(f);
                //console.log(f);
            });
        }
    }
}

console.log("\033[32mWorking on it\n");

var time_start = +new Date();

readDir("data");

var time_end = +new Date();

console.log("\033[0m\n\n\033[33m" + levels.length + " level" + (levels.length > 1 ? "s" : "") + " created, "
    + duplicateLevelCount + " duplicate level" + (duplicateLevelCount > 1 ? "s" : "") + ", "
    + skippedLevelCount + " skipped level" + (skippedLevelCount > 1 ? "s (because they are too big)" : "")
);

console.log("\n\033[36mFinished in " + (time_end - time_start) + " ms");
fs.writeFileSync("levels.js",
    "var levelsData =" +
    JSON.stringify(levels)
    , {encoding: "utf8"}
);
