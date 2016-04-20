var game = {
    currentStage: 0,
    score: 0,
    remainingSkips: 5
};

if (!localStorage['levelsData']) {

//shuffle levelsData

    for (var i = 0; i < levelsData.length; i++) {
        var tmp = levelsData[i];
        var j = i + parseInt(Math.random() * 20) - 10;
        if (j < 0) j = 0;
        if (j >= levelsData.length)j = levelsData.length;
        levelsData[i] = levelsData[j];
        levelsData[j] = tmp;
    }

//Randomly pick from levelsData

    var newLevelsData = [];
    for (i = parseInt(Math.random() * 10); i < levelsData.length; i += (parseInt(Math.random() * 20 + i / 20) + 1)) {
        if (i >= 0 && i <= levelsData.length)
            newLevelsData.push(levelsData[i]);
    }

    levelsData = newLevelsData;

    localStorage['levelsData'] = JSON.stringify(levelsData);
} else {
    levelsData = JSON.parse(localStorage['levelsData']);
    game = JSON.parse(localStorage['game']);

}


function refreshScore() {
    DOM.score.html(game.score);
}

function restartGame(noConfirm) {
    function restart() {
        delete localStorage['game'];
        delete localStorage['levelsData'];
        window.location.reload();
    }

    if (noConfirm) {
        restart();
    } else {
        if (confirm("Are you sure to restart this game?")) {
            restart();
        }
    }
}

function endGame(noConfirm) {
    function end() {
        delete localStorage['game'];
        delete localStorage['levelsData'];
        $(".game").css("display", "none");
        $(".gameover").css("display", "block");
        $(".score_div_score").html(game.score);
    }

    if (noConfirm) end();
    else if (confirm("Are you sure to end this game ?"))
        end();

}

function skipLevel() {
    if (game.remainingSkips > 0) {
        var score = 0;
        for (var i = 0; i < GameState.boxes.length; i++) {
            var box = GameState.boxes[i];

            if (GameState.map[box.y][box.x] == 2)
                score += 7;

        }

        if (confirm("You have " + game.remainingSkips + " chance" + (game.remainingSkips > 1 ? "s" : "") + " remaining to skip, \n you will get " + score + " point" + (score > 1 ? "s" : "") + " for this level.\n\nSkip this level ?")) {
            game.score += score;
            game.currentStage++;
            game.remainingSkips--;
            refreshScore();
            initStage();
        }

    } else {
        alert("Oops, you have no chance left to skip stages.\n You may want to restart the game.");
    }


}

function cloneMap(map) {
    var newMap = [];
    for (var i = 0; i < map.length; i++) {
        newMap.push(map[i].slice(0));
    }
    return newMap;
}

function setPos(domElement, x, y) {
    domElement.style.top = y * 50 + 'px';
    domElement.style.left = x * 50 + 'px';
}

function decompressLevel(data) {
    var level = {map: [], person: {}, box: []};
    if (!data) return null;
    data[0].forEach(function (d) {
        level.map.push(d.split(""));
    });
    level.person = {x: data[1][0], y: data[1][1]};
    data[2].forEach(function (d) {
        level.box.push({x: d[0], y: d[1]});
    });
    level.difficulty = data[3];
    return level;
}

function initStage() {
    localStorage['game'] = JSON.stringify(game);
    var levelData = decompressLevel(levelsData[game.currentStage]);
    if (!levelData) {
        alert("Congrats! You've finished all the levels");
        endGame(true);
        return;
    }
    console.log("Level Difficulty:", levelData.difficulty);

    moveHistory = [];

    clearContainer();

    refreshScore();

    //init GameState
    GameState.person = {x: levelData.person.x, y: levelData.person.y};
    GameState.map = cloneMap(levelData.map);
    GameState.boxes = [];

    //add person.
    DOM.person = document.createElement("div");
    DOM.person.className = "person";
    DOM.person.style.zIndex = 1000;
    DOM.container.appendChild(DOM.person);
    setPos(DOM.person, levelData.person.x, levelData.person.y);

    //add boxes.
    DOM.boxes = [];
    for (var boxKey in levelData.box) {
        if (!levelData.box.hasOwnProperty(boxKey))
            continue;
        var box = levelData.box[boxKey];
        var boxElement = document.createElement("div");
        DOM.boxes.push(boxElement);
        boxElement.className = "box";
        boxElement.style.zIndex = 100;
        DOM.container.appendChild(boxElement);
        GameState.boxes.push({x: box.x, y: box.y, element: boxElement});
        setPos(boxElement, box.x, box.y);
        setBoxOpacity({element: boxElement, x: box.x, y: box.y});
    }

    //add walls and targets.
    for (var y = 0; y < levelData.map.length; y++) {
        for (var x = 0; x < levelData.map[y].length; x++) {
            var elementType = levelData.map[y][x];
            var element = document.createElement("div");
            element.className = ["", "wall", "target"][elementType];
            DOM.container.appendChild(element);
            setPos(element, x, y);
        }
    }

    centerContainer();
}

var DOM = {
    container: null,
    person: null,
    scroll: null
};

var GameState = {
    person: {x: 0, y: 0},
    map: [[]],
    boxes: [{x: 0, y: 0}]
};

function getDomElements() {
    DOM.container = $(".container")[0];
    DOM.score = $("#score");
}

function clearContainer() {
    var children = DOM.container.children;
    var toRemove = [];
    for (var childKey in children) {
        if (!children.hasOwnProperty(childKey) || typeof children[childKey] != "object")
            continue;
        toRemove.push(children[childKey]);
    }

    toRemove.forEach(function (node) {
        DOM.container.removeChild(node);
    });
}

function startGame() {
    getDomElements();
    initStage();
}

var moveHistory = [];

function setBoxOpacity(box) {
    if (GameState.map[box.y][box.x] == 2) {
        box.element.style.opacity = 0.55;
    } else {
        box.element.style.opacity = 1;
    }
}
function move(x, y) {
    var history = [];

    var targetX = GameState.person.x + x;
    var targetY = GameState.person.y + y;

    if (targetX < 0 || targetY < 0 || targetX >= GameState.map[0].length || targetY >= GameState.map.length)
        return;

    if (GameState.map[targetY][targetX] == 1)
        return;


    for (var i = 0; i < GameState.boxes.length; i++) {
        var box = GameState.boxes[i];

        if (box.x == targetX && box.y == targetY) {
            var targetX2 = targetX + x;
            var targetY2 = targetY + y;
            if (targetX2 < 0 || targetY2 < 0 || targetX2 >= GameState.map[0].length || targetY2 >= GameState.map.length)
                return;

            if (GameState.map[targetY2][targetX2] == 1)
                return;

            var collideWithOtherBoxes = false;

            for (var j = 0; j < GameState.boxes.length; j++) {
                var box2 = GameState.boxes[j];
                if (box2.x == targetX2 && box2.y == targetY2) {
                    collideWithOtherBoxes = true;
                    break;
                }
            }

            if (collideWithOtherBoxes)
                return;

            history.push(["moveBox", box, box.x, box.y]);

            box.x = targetX2;
            box.y = targetY2;

            setBoxOpacity(box);
            setPos(box.element, box.x, box.y);

            break;
        }
    }
    history.push(["move", GameState.person.x, GameState.person.y, DOM.person.className]);
    GameState.person.x += x;
    GameState.person.y += y;
    setPos(DOM.person, GameState.person.x, GameState.person.y);
    var direction = "";
    if (x == 1) direction = "right";
    if (x == -1) direction = "left";
    if (y == 1) direction = "down";
    if (y == -1) direction = "up";
    DOM.person.className = "person " + direction;
    moveHistory.push(history);
    checkSuccess();
}

var waitingForNewStage = false;

function checkSuccess(forceSuccessful) {
    var successful = true;

    if (!forceSuccessful) {
        for (var i = 0; i < GameState.boxes.length; i++) {
            var box = GameState.boxes[i];
            if (GameState.map[box.y][box.x] != 2) {
                successful = false;
                break;
            }
        }
    }

    if (successful && !waitingForNewStage) {
        waitingForNewStage = true;

        function nextStage() {
            waitingForNewStage = false;
            game.currentStage++;

            if (!forceSuccessful) {
                game.score += GameState.boxes.length * 7;
                game.score += game.currentStage * 15;
                refreshScore();
            }

            initStage();
        }

        if (forceSuccessful) {
            nextStage();
        } else {
            setTimeout(function () {
                nextStage();
            }, 150);
        }
    }
}

function bindKeys() {
    document.onkeydown = function (e) {
        e = e || window.event;
        switch (e.code || e.key) {

            case "KeyN":
                checkSuccess(true);
                console.log(game.currentStage);
                initStage();
                break;

            case "KeyP":
                if (game.currentStage > 0)
                    game.currentStage--;
                console.log(game.currentStage);
                initStage();
                break;

            case "ArrowUp":
            case "Up":
                move(0, -1);
                break;
            case "ArrowDown":
            case "Down":
                move(0, 1);
                break;
            case "ArrowLeft":
            case "Left":
                move(-1, 0);
                break;
            case "ArrowRight":
            case "Right":
                move(1, 0);
                break;
            case "Escape":
            case "Esc":
                restart();
                break;
            case "Backspace":
                undo();
                e.preventDefault();
                break;
            case "Minus":
            case "-":
                zoomOut();
                break;
            case "Equal":
            case "=":
                zoomIn();
                e.preventDefault();
                break;

        }
    }
}

var _isMobile = null;
function isMobile() {
    if (_isMobile !== null) return _isMobile;
    else {
        _isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return _isMobile;
    }
}

function tapOrClick(element, callback) {
    if (isMobile()) {
        element.tap(callback);
    } else {
        element.click(callback);
    }
}

function restart() {
    if (confirm("Are you sure to restart this stage?")) {
        initStage();
    }
}

function undo() {
    var history = moveHistory.pop();
    if (!history) return;
    history.forEach(function (item) {
        switch (item[0]) {
            case "move":
                var originalX = item[1];
                var originalY = item[2];
                var originalClassName = item[3];
                GameState.person.x = originalX;
                GameState.person.y = originalY;
                DOM.person.className = originalClassName;
                setPos(DOM.person, GameState.person.x, GameState.person.y);
                break;
            case "moveBox":
                var box = item[1];
                originalX = item[2];
                originalY = item[3];
                box.x = originalX;
                box.y = originalY;

                setBoxOpacity(box);
                setPos(box.element, box.x, box.y);
                break;
        }
    });
}

function zoomIn() {
    containerZoom += 0.25;
    if (containerZoom > 2) containerZoom = 2;
    centerContainer();
}

function zoomOut() {
    containerZoom -= 0.25;
    if (containerZoom < 0.4) containerZoom = 0.4;
    centerContainer();
}

function bindJoystick() {
    tapOrClick($(".joystick .up"), function () {
        move(0, -1);
    });

    tapOrClick($(".joystick .down"), function () {
        move(0, 1);
    });

    tapOrClick($(".joystick .left"), function () {
        move(-1, 0);
    });

    tapOrClick($(".joystick .right"), function () {
        move(1, 0);
    });

    tapOrClick($(".joystick .restart"), function () {
        restart();
    });

    tapOrClick($(".joystick .undo"), function () {
        undo();
    });

    tapOrClick($(".zoomSettings .zoomIn"), function () {
        zoomIn();
    });

    tapOrClick($(".zoomSettings .zoomOut"), function () {
        zoomOut();
    });

    tapOrClick($(".gameover .restart_btn"), function () {
        restartGame(true);
    });

    tapOrClick($("#btnRestartGame"), function () {
        restartGame();
    });

    tapOrClick($("#btnEndGame"), function () {
        endGame();
    });

    tapOrClick($("#btnSkipLevel"), function () {
        skipLevel();
    });
}

var lastDragPos;
var containerOffset;
var containerZoom;

function determineContainerZoom() {
    if (!documentWidth)
        documentWidth = $(document).width();

    if (!documentHeight)
        documentHeight = $(document).height();

    if (documentWidth < 600) {
        containerZoom = 0.8 - ((600 - documentWidth) / 1200);
    } else {
        containerZoom = 0.8;
    }
}

function getCoords(e) {
    var touch = false;
    if (isMobile()) {
        if (e.touches.length > 0) {
            touch = e.touches[0];
        } else {
            touch = e.changedTouches[0];
        }
    } else {
        touch = e;
    }
    if (!touch.pageX)
        touch.pageX = touch.clientX;
    if (!touch.pageY)
        touch.pageY = touch.clientY;

    return {x: touch.pageX, y: touch.pageY};
}

function setContainerPos() {
    DOM.container.style.top = containerOffset.y + "px";
    DOM.container.style.left = containerOffset.x + "px";
    DOM.container.style.zoom = containerZoom;
}

var documentWidth, documentHeight;

function centerContainer() {
    containerOffset = {
        x: (documentWidth / containerZoom - (50 * GameState.map[0].length)) / 2,
        y: (documentHeight / containerZoom - (50 * GameState.map.length)) / 2
    };

    setContainerPos();
}

function enableDragContainer() {
    var dragThreshold = 70;
    var accumulativeDistance = {x: 0, y: 0};
    var dragging = false;
    document.addEventListener(isMobile() ? 'touchstart' : "mousedown", function (e) {
        accumulativeDistance = {x: 0, y: 0};
        e = e || window.event;
        e.preventDefault();
        lastDragPos = getCoords(e);
        dragging = true;
    });

    document.addEventListener(isMobile() ? 'touchmove' : "mousemove", function (e) {
        e = e || window.event;
        e.preventDefault();

        if (!lastDragPos) {
            lastDragPos = getCoords(e);
        }

        if (!isMobile() && !dragging) return;

        var currentDragPos = getCoords(e);
        var offset = {x: currentDragPos.x - lastDragPos.x, y: currentDragPos.y - lastDragPos.y};

        accumulativeDistance.x += (offset.x / containerZoom);
        accumulativeDistance.y += (offset.y / containerZoom);

        if (Math.abs(accumulativeDistance.x) < dragThreshold && Math.abs(accumulativeDistance.y) < dragThreshold)
            return;

        containerOffset.x += (offset.x / containerZoom);
        containerOffset.y += (offset.y / containerZoom);

        setContainerPos();
        lastDragPos = currentDragPos;

    });

    document.addEventListener(isMobile() ? 'touchend' : 'mouseup', function (e) {
        e = e || window.event;
        e.preventDefault();
        dragging = false;
    });
}
