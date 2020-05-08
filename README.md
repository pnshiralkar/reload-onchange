# Reload onchange

### Reload selected browser tab when given file(s) or directory changes!
---
Many a times, we want to reload a webpage when files change (say, when backend server changes). This package along with a Chrome Extension automatically reloads webpage when given files change. 

## Prerequisites:
- Node v10+ and NPM
- Google Chrome browser

## Installation :

- Install Chrome Extension : [Install from Chrome WebStore](https://chrome.google.com/webstore/detail/reload-onchange/ilmckbifpnmmmmjdjodagmhlgmoidgkh) 
- To install [reload-onchange](https://www.npmjs.com/package/reload-onchange) NPM package, RUN `npm i -g reload-onchange`

## Usage :

- Run `reload-onchange /path/to/watch` and turn on the extension on Chrome tab you want to reload.
- Run `reload-onchange /path/to/watch --port 8080 --delay 1500` to reload after delay of 1500ms and listen on port 8080 (Use same port on extension also!)
- Run `reload-onchange --help` for more!

## Issues and contributing :

- In case of any issues, visit and feel free to add issues in the [issues page](https://github.com/pnshiralkar/reload-onchange/issues)
- Also feel free to contribute!

