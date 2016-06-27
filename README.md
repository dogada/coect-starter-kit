# coect-starter-kit - isomorphic web app boilerplate (Coect, Node.js, Express, RiotJs, Babel 5, Browserify, Browsersync)

Replace `mysite` in code with name of your project. 

Then create database structure using:

```
npm run db:migrate
```

To run development server & watch for changes:

```
gulp run
```



You can make new release using `release_npm` that will test master branch, increase package.json version.call and call `./bin/post_release` that will push master branch to `builder` and run `./bin/build` on builder machine. 

You can invoke `./bin/release` manually to build current master branch.

```
i3:$ ./bin/release
```

Deploy latest release to vagrant web-machines (vb0):

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

In production (secret) part of config is stored in `/srv/config/$sitename` and copied by Ansible. It's imported in `server/config/index.js`.


On builder machine (usually vagrant box vb0) should be initalized build environment (it will should be done once and will be used for all builds).

```
dvd@vb0:/srv/repo$ cd /srv/repo/site_build/
dvd@vb0:/srv/repo/site_build$ cp package-dev.json ../package.json
dvd@vb0:/srv/repo/site_build$ cd ../
dvd@vb0:/srv/repo$ npm install
```

It's also possible to call `bin/build` on each commit:
dvd@vb0$ ln -s dev/hooks/post-receive .git/hooks/post-receive
