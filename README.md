## FLUX React JS Boilerplate

### Forked from [flux-react-boilerplate](https://github.com/christianalfoni/flux-react-boilerplate)

## Overview

This project is intended to be a boilerplate of best practices for Flux and React gathered fom Christian's original fork along with some gulpfile support to support environment-specific CI, automated unit tests, live reloading web server, and an opinionated structure on how to organize your React code.

The patterns in the project are partially inspired by my prior work in AngularJS, specifically [MEAN-Enterprise](https://github.com/CraftySquad/mean-enterprise.ui).

## Summary of Architecture
* Minimize/divorce JSX from component code using [react-templates](https://github.com/wix/react-templates)
* An opinionated folder structure for organizing code and unit tests
* Simple routing using [react-router](https://github.com/rackt/react-router)
* Automate all build processes

### Development
* Run `npm install`
* Run `gulp`
* Go to `localhost:8200` to display the app
* Any changes to `app` or `styles` folder will automatically rebuild to `build` folder

### Minify the code, ready for production
* Run `gulp deploy`

### Directory
* **app/**: Where your React code lives
  * **actions/**: Stores actions of your application
  * **components/**: Write your components and unit tests here by directory
  * **stores/**: Compose stores that your components will interact with
  * **.spec.js files**: The opinion of this project is to set unit tests alongside of your code for accessibility
  * **.rt files**: We use react-templates to divorce the HTML DOM from the actual React files. Intermingling templates (be it JSX or otherwise) with JS files never sat well with me  :)
* **build/**: Where your automatically builds to. This is where you launch your app in development
* **dist/**: Where the deployed code exists, ready for production
* **styles/**: Where you put your css files
* **gulpfile**: Gulp configuration

### TODO's
* SASS support
* Material Design Lite integration