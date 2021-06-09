# FINSEC Dashboard application 

### Introduction

The project provides a User Interface to support security officers deal with cyber an physical threats.
This application fetches data from the MITIGATE platform.
It is planned to support integration with FINSEC's data tier in the next iteration

*   Developed using boostrap-v4.0.0
*   angular-v7.0.2
*   angular/cli-v7.0.4
*   [ng-bootstrap-v4.0.0](https://github.com/ng-bootstrap/)
*   [ngx-translate-v11.0.0](https://github.com/ngx-translate)
*   Following the best practices.
*   Ahead-of-Time compilation support.
*   Official Angular i18n support.
*   Production and development builds.
*   Tree-Shaking production builds.
*   Echarts (intgrated by Innov)
*   Ant design and ajax data fetching (integrated by Innov)
*   Supported JWT authorization (integrated by Innov)

### How to start

**Note** that this seed project requires **node >=v8.9.0 and npm >=4**.

In order to run the project as a docker container use:

```bash
$ git clone https://gogs.finsec-project.eu/finsec/dashboard.git 
$ cd finsec-dashboard
# build the image
$ docker image build -t finsec-dashboard . 
# Spin up a container and navigate to localhost:3000
$ docker run -p 3000:80 --rm finsec-dashboard
```

In order to start the project use:

```bash
$ git clone https://gogs.finsec-project.eu/finsec/dashboard.git 
$ cd finsec-dashboard
# install the project's dependencies
$ npm install
# watches your files and uses livereload by default run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
$ npm start
# prod build, will output the production application in `dist`
# the produced code can be deployed (rsynced) to a remote server
$ npm run build
```

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
