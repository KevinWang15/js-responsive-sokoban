//0:aisle
//1:wall
//2:target

var levelsData =
    [
        {
            map: [
                [0, 1, 1, 1, 0, 0],
                [1, 1, 2, 2, 1, 0],
                [1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1]
            ],
            person: {x: 1, y: 2},
            box: [{x: 2, y: 2}, {x: 3, y: 2}]
        },
        {
            map: [
                [0, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 0, 0, 1, 1, 1, 0],
                [0, 1, 0, 0, 0, 0, 1, 0],
                [1, 1, 1, 0, 1, 0, 1, 1],
                [1, 2, 1, 0, 1, 0, 0, 1],
                [1, 2, 0, 0, 0, 1, 0, 1],
                [1, 2, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1]
            ],
            person: {x: 2, y: 2},
            box: [{x: 3, y: 2}, {x: 2, y: 5}, {x: 5, y: 6}]
        },
        {
            map: [
                [0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
                [0, 1, 1, 1, 0, 0, 0, 0, 1, 0],
                [1, 1, 2, 0, 0, 1, 1, 0, 1, 1],
                [1, 2, 2, 0, 0, 0, 0, 0, 0, 1],
                [1, 2, 2, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 1, 1, 1, 1, 0, 0, 1, 0],
                [0, 0, 0, 0, 0, 1, 1, 1, 1, 0]
            ],
            person: {x: 8, y: 3},
            box: [{x: 4, y: 2}, {x: 3, y: 3}, {x: 4, y: 4}, {x: 5, y: 3}, {x: 6, y: 4}]
        },
        {
            map: [
                [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 1, 1, 1],
                [1, 1, 0, 1, 1, 1, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 2, 2, 1, 0, 0, 0, 1, 1],
                [1, 1, 2, 2, 1, 0, 0, 0, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 0]
            ],
            person: {x: 2, y: 3},
            box: [{x: 2, y: 2}, {x: 4, y: 3}, {x: 6, y: 4}, {x: 7, y: 3}]
        },
        {
            map: [
                [0, 0, 1, 1, 1, 1, 0, 0],
                [0, 0, 1, 2, 2, 1, 0, 0],
                [0, 1, 1, 0, 2, 1, 1, 0],
                [0, 1, 0, 0, 0, 2, 1, 0],
                [1, 1, 0, 0, 0, 0, 1, 1],
                [1, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1]
            ],
            person: {x: 4, y: 6},
            box: [{x: 4, y: 3}, {x: 3, y: 4}, {x: 4, y: 5}, {x: 5, y: 5}]
        },
        {
            map: [
                [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
                [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0],
                [2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 1, 1],
                [2, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
                [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [2, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
                [2, 2, 2, 1, 1, 1, 0, 1, 0, 0, 1, 1],
                [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0]
            ],
            person: {x: 5, y: 10},
            box: [
                {x: 5, y: 6},
                {x: 6, y: 3},
                {x: 6, y: 5},
                {x: 6, y: 7},
                {x: 6, y: 9},
                {x: 7, y: 2},
                {x: 8, y: 2},
                {x: 9, y: 6}
            ]
        }];
