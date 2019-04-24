# Fusion  - Portfolio Viewer

<br />




## prerequisities

* GIT: https://git-scm.com/
* Node.js: https://nodejs.org/

<br />




## clone the repository

```
$ git clone git@github.com:stellar-fox/fusion.git
Cloning into 'fusion'...
```

</br>




## install dependencies

```
$ cd fusion
$ npm i
```

<br />




## prepare [configuration file][config]

```
$ cp src/config.example.js src/config.localhost.js
$ vi src/config.localhost.js
$ ln -s src/config.localhost.js src/config.js
```

<br />




## run local development server

```
$ npm start

Compiled successfully!

You can now view fusion-ui in the browser.

  Local:            http://localhost:3000/

Note that the development build is not optimized.
To create a production build, use npm run build.
```

<br />




## run tests

```
$ npm run test
```

<br />




## compile production build

```
$ npm run build
Creating an optimized production build...
Compiled successfully.
```

<br />




## Support

```
GAUWLOIHFR2E52DYNEYDO6ZADIDVWZKK3U77V7PMFBNOIOBNREQBHBRR
```




[config]: src/config.example.js
