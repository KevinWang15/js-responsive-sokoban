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

//var max_map_size = 8;
var max_map_size = 13;

var hash = require('object-hash');
var fs = require("fs");
var path = require("path");
var levels = [];
var levelHashes = [];

var dotCount = 0;
var duplicateLevelCount = 0;
var skippedLevelCount = 0;

function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch (err) {
        return false;
    }
}
function makeLevelHash(level) {
    return hash(level);
}

function random(low, high) {
    return Math.floor(Math.random() * (high - low)) + low;
}

function makeLevel(fContent) {
    if (!fContent) return;

    var difficulty = -1;
    var difficultyMatch = /^<difficulty:\s*(\d+\.?\d*)>/m.exec(fContent);


    if (difficultyMatch != null) {
        difficulty = difficultyMatch[1];
        fContent = fContent.substr(fContent.indexOf("\n") + 1);
    }

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
            if (char != " ") {
                if (map_coords.left > x) map_coords.left = x;
                if (map_coords.right < x) map_coords.right = x;
                if (map_coords.top > y) map_coords.top = y;
                if (map_coords.bottom < y) map_coords.bottom = y;
            }
            //$: box, .: target, #: wall, *: box on target, +: person on target, @: person
            map_line.push({' ': 0, '#': 1, 'o': 0, '@': 0, '.': 2, '$': 0, '+': 2, '*': 2}[char]);
            if (char == "@" || char == "+")
                level.person = [x, y];
            if (char == '$' || char == '*') {
                level.box.push([x, y]);
            }
        }
        level.map.push(map_line);
    }


    var map_real_height = map_coords.bottom - map_coords.top + 1;
    var map_real_width = map_coords.right - map_coords.left + 1;

    if (map_coords.top != 0 || map_coords.left != 0 ||
        map_real_height != height || map_real_width != width) {
        //resize map
        var newMap = [];
        for (y = map_coords.top; y <= map_coords.bottom; y++)
            newMap.push(level.map[y].splice(map_coords.left, map_real_width));
        level.map = newMap;
        level.person.x -= map_coords.left;
        level.person.y -= map_coords.top;
        level.box.forEach(function (d) {
            d.x -= map_coords.left;
            d.y -= map_coords.top;
        });
    }
    var levelMapCompressed = [];

    level.map.forEach(function (data) {
        levelMapCompressed.push(data.join(""));
    });
    level.map = levelMapCompressed;

    if (width > max_map_size || height > max_map_size) {
        skippedLevelCount++;
        return;
    } else {
        if (difficulty == -1) {
            //Estimate difficulty based on boxes
            difficulty = (map_real_height - 5) * (map_real_width - 5);
            if (difficulty < 0) difficulty = 1;
            difficulty += Math.pow(1.2, level.box.length);
            difficulty /= 5;
            difficulty += 10;
        }
    }

    var levelHash = makeLevelHash(level);
    if (levelHashes.indexOf(levelHash) == -1) {
        levelHashes.push(levelHash);
        levels.push([level.map, level.person, level.box, difficulty]);
    } else {
        duplicateLevelCount++;
    }

}

function splitLevels(fContent) {
    fContent = fContent.replace(/;.*?$/mg, "");
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
    + "\nRefresh your browser to play!"
);

console.log("\n\033[36mFinished in " + (time_end - time_start) + " ms");

if (fileExists('../../js/levels.js')) {
    var newPath = (+new Date()) + '.old.js';
    console.log("\n\033[35mOld levels.js moved to " + newPath);
    fs.renameSync('../../js/levels.js', '../../js/' + 'levels.' + newPath);
}

//levels = levels.sort(function compare(a, b) {
//        if (a[3] < b[3])
//            return -1;
//        else if (a[3] > b[3])
//            return 1;
//        else
//            return 0;
//    }
//);

fs.writeFileSync("../../js/levels.js",
    "var levelsData =" +
    JSON.stringify(levels)
    , {encoding: "utf8"}
);
