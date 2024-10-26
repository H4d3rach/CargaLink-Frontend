# CargaLinkFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.9.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
Carga Link Frontend \n Versiones de Software necesarias:\nNode instalar node version 20.16.0 o podría funcionar con cualquier versión 20, checar la versión del npm (npm -v) este proyecto se desarrolló con npm version 10.8.1\nInstalar angular CLI version 17 (nmp install -g @angular/cli17) si no mal recuerdo ese es el comando, en caso de duda preguntar a Chat GPT o su contraparte Copilot\n Para correr el proyecto unicamente utilizar el comando npm start\n Para realizar prueba de las vistas se necesitará iniciar sesión, pero las rutas están protegidas por lo que se recomienda dar de alta algún usuario y en el archivo app.routes.ts eliminar de todas las rutas el canActivate: [rutasGuard], y eliminar el data: {rol}\nY ásí visitar link por link\n La versión Main no tiene router link, por lo que los botones de todas las vistas de los usuarios no sirven, por lo que tendrá que navegar por medio de links
