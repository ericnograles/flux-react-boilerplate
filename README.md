## FLUX React JS Boilerplate

### Forked from [flux-react-boilerplate](https://github.com/christianalfoni/flux-react-boilerplate)

## Vision

This project is intended to be a boilerplate of best practices for Flux and React gathered fom Christian's original fork along with some gulpfile support to support environment-specific CI, automated unit tests, live reloading web server, and an opinionated structure on how to organize your React code.

The patterns in the project are partially inspired by my prior work in AngularJS, specifically [MEAN-Enterprise](https://github.com/CraftySquad/mean-enterprise.ui). The main goal I wanted to accomplish was to create a React boilerplate that would be somewhat familiar to Angular folks, so I hope that gives context to the architectural decisions below.

## Architecture
* **Routing**: [react-router](https://github.com/rackt/react-router)
* **Templates**: [react-templates](https://github.com/wix/react-templates)
* **HTTP**: [request](https://github.com/request/request)
* **UI**: [material-design-lite](https://github.com/google/material-design-lite)
* **Other Notes**
  * An opinionated folder structure for organizing code and unit tests
  * Automate all build processes
  * Assumes a dev, staging, qa, and production branching strategy with built-in TravisCI assumption

## Usage

### Development
* Run `npm install`
* Run `gulp`
* Run `node web.js`
* Go to `localhost:8200` to display the app
* Any changes to `app` or `styles` folder will automatically rebuild to `build` folder

### Deployment
* Run `npm install`
* Run `gulp deploy --environment staging` (or whatever environment you want to package)
* (Optional) Run `node web.js` to serve up the content in ./dist to `localhost:8080`

### Directory
* **app/**: Where your React code lives
  * **main.js**: The starting point of the application. Uses react-router to define initial routes and route hierarchy.
  * **actions/**: Stores actions of your application
  * **components/**: Write your components and unit tests here by directory
  * **stores/**: Compose stores that your components will interact with
  * **services/**: Application-wide services
  * **.spec.js files**: The opinion of this project is to set unit tests alongside of your code for accessibility
  * **.rt files**: We use react-templates to divorce the HTML DOM from the actual React files. Intermingling templates (be it JSX or otherwise) with JS files never sat well with me  :)
* **config/**: Configurations to support gulp task automation and CI
  * **gulpfile.conf.js**: All config variables needed by gulp task automation.
  * **karma.conf.js**: Karma test runner configuration
* **build/**: Where your automatically builds to. This is where you launch your app in development
* **dist/**: Where the deployed code exists, ready for production
* **styles/**: Where you put your css files
* **gulpfile**: Gulp tasks
* **web.js**: A minimalist Express server that simulates jwt authentication and content distribution for HTML5 mode


### TODO's


## Collaborating

Full disclosure: I am far more versed in Angular than I am in React, and this boilerplate was my first deep dive into this exciting framework.  I would LOVE to collaborate with folks who want to make improvements or see anything egregious. Please log Issues as you see them and feel free to fork and PR!