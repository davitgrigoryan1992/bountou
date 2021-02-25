## Setup:
* Install [Node](http://nodejs.org) (v10.x.x or above)
* `git clone https://aragalstyan@bitbucket.org/qtpoker/websiteautomatedqav8.git`
* `npm i` to install the project dependencies
* install `cucumber.js` plugin from IDE settings

## Run tests:
* Login into percy.io
* Create a new project in percy.io
* cd to project root directory in terminal
* Copy the project token from percy and set into the command line of the project directory(you will need to repeat this action every time after you reopen the terminal. The token of the existing project can be taken from Project Settings)
* Run the test using `percy exec cypress run` command

## Run only functional part of tests
* Run the test using `cypress run --headless` command

## Frameworks and plugins:
* cypress
* mocha
* percy.io

## Specification document:
https://docs.google.com/document/d/1m5gXKspME4vHUDgdM-C7cRgVRzIO3so3DEOfaE-G4W8/edit
