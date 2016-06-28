# coect-starter-kit — isomorphic web app boilerplate (Coect, BEM, Node.js, Express, RiotJs, PassportJs).

The starter kit provides basic [Coect platform](http://www.coect.net) functionality, social logins (Facebook, Twitter, Google) using PassportJs and #IndieWeb-compatible distributed social network features (you can create various type of posts, tag and comment them, publicly like and privately bookmark). 

This code can be use as base for a blog (see for example [dogada.org](https://dogada.org)) or an #IndieWeb community site (for example [Memos sharing community — memolot.com](https://memolot.com). By default html content is marked using [microformats2](http://microformats.org/wiki/microformats-2).

The Coect application borrow a lot from [BEM methodology](https://en.bem.info/methodology/). Application is made from modules and modules are made from components. Thanks to dynamic nature of [RiotJs](http://riotjs.com/) you can change any component logic and presentation anywhere in component tree. This makes RiotJs a perfect base for BEM and Donald Knut's ["re-editable code"](http://www.informit.com/articles/article.aspx?p=1193856) approach. Many frameworks like React or Angular are rely on reusable state-less components, but code that links these components together aren't reusable and need to be repeated from scratch in every project. The Coect aims to make application code much more reusable by making it "re-editable" on  any level on component nesting. We try to avoid dividing on reusable presentational and non-reusable container components that seems common for the React's world.

Like in Redux Coect application has single source of truth — `Site.state`, but components may maintain private internal state if need. Like in all Flux-based architectures Coect also spits action and update flow. `Site.state` itself is mutable, but values in `Site.state` are immutable that allows to use fast equality check `===` in component's update flow to find should component update itself or not. It sounds a bit cryptic but works well so far.

The code is under active development, but already usable. For deployment and monitoring I use [PM2](http://pm2.keymetrics.io/) (example of configuration is in `ecosystem.json5`).

## How to setup
 
Before using of this starter kit you need to replace `mysite` in code with name of your project and setup PostgreSQL database.

Then create database structure using:

```
npm run db:migrate
```

To run development server & watch for changes in source files:

```
gulp run
```

To run unit and integration tests:

```
npm run test
```


Site settings like passport configuration, session secrets, etc are stored outside of source tree and loaded from `/srv/config/mysite_site/`. I use Ansible to sync these files between all hosts. If you will not provide these files, site will use default settings, social logins will not work and you will see in logs, warning like:
```
Can't load  /srv/config/mysite_site/common { [Error: Cannot find module '/srv/config/mysite_site/common'] code: 'MODULE_NOT_FOUND' }
```


You can make new release using `release_npm` script that will test master branch, increase package.json version and call `./bin/post_release` that will push master branch to `builder` and run `./bin/build` on builder machine. 

You can invoke `./bin/release` manually to build current master branch.

```
./bin/release
```

Deploy latest release to vagrant test machine (vb0):

```
pm2 deploy vb0
```

Deploy to production de1.matrix

```
pm2 deploy de1
```

Before first deployment on a host you need to setup it:
```
$ pm2 deploy vb0 setup
```

If database schema was changed, you need to apply migrations: `npm run db:migrate`.

On builder machine (usually vagrant box vb0) should be initalized build environment (it need to be done once and will be used for all builds to save build time).

```
user@vb0:/srv/repo$ cd /srv/repo/site_build/
user@vb0:/srv/repo/site_build$ cp package-dev.json ../package.json
user@vb0:/srv/repo/site_build$ cd ../
user@vb0:/srv/repo$ npm install
```

It's also possible to call `bin/build` on each commit:
```
ln -s dev/hooks/post-receive .git/hooks/post-receive
```

## Upcoming changes

After release of Riot 3.0 I plan to migrate from Browserify to Webpack and Babel 6.x. From my experience Browserify can't handle importing same module inside several npm modules used by main project. For example, when you import `riot` inside main npm-module and several submodules you receive several copies of `riot` that breaks tag cache. There are several workarounds like `npm dedupe` but during development it's constant source of annoying problems.

Client and server code is wrote using ES6 syntax subset that NodeJs 4.x understands. The project has a lot of code shared between client and server. It's true isomorphic aplication, any tag can be rendered on server and whole application state can be passed to as well. client like in Flux/Redux, but this also limit ES6-usage in client code or require to use Babel on server as well. Other approach is to migrate to current NodeJs 6.x branch that almost fully natively supports ES6. All approaches have own drawbacks and this is still open question.
