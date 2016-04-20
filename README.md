# responsive sokoban game
Demo: [http://139.196.50.217:7011/](http://139.196.50.217:7011/)

## Features

1. Pure JS, minimal dependency (zepto only, whole game 75kb gzipped, with 800+ stages, only 35kb without stages)
1. Good gaming experience (Animations / Cartoon character with different orientation)
1. Responsive display. Auto centering / allow drag on mobile.
1. Virtual keyboard on mobile
1. Change zoom ratio manually / determine the best zoom ratio on mobile
1. Restart /  Undo
1. A cool node-js level converter at ```tools/level-converter/converter.js```, you can edit your stages in a WYSIWYG way at ```tools/level-converter/data```, and this tool will help you do the rest. (automatically removes duplicate level, searches directory recursively)

## PC key bindings

| Key  | Operation |
| ------------- | ------------- |
| ↑ | Move Up |
| ↓ | Move Down |
| ← | Move Left |
| → | Move Right |
| N | Next Stage |
| P | Previous Stage |
| Esc | Restart stage |
| Backspace| Undo |


## Level editing

You may edit levels by modifying txt files at ```tools/level-converter/data```, then run ```node tools/level-converter/converter.js```.

### Symbols:

|Symbol|Meaning|
| ------------- | ------------- |
|```$``` ***or*** ```o```|Box|
|```#```|Wall|
|***(space)***|Aisle|
|```.``` |Target|
|```@``` |Person|
|```+```|Person and Target|
|```*``` |Box and Target|
