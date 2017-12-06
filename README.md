# MyNote

A Minimalist's Cross-Platform Notes App

![Screenshot](Screenshot.png)

It uses:
* [Node.js](https://nodejs.org/en/) for back-end
* [electron (used to be atom-shell)](https://github.com/atom/electron/) for embedded browser
* [Vue.js](https://vuejs.org/) as front-end framework with [Vuex](https://vuejs.org/vuex) as data-flow pattern

---

### Features

- Cross-platform Minimalist Notes app
- Notes & Favourites Management
- Auto Save/Sync notes
- Instant/Reactive Search bar
- Status info Footer
- Sleep mode blocker
- Minimize to tray

---

### Releases notes

[Check out tags](https://github.com/Zero-1729/mynote/releases)

---

### Run MyNote

> Note: make sure you already have [NodeJs](https://nodejs.org/en/) and [git](https://git-scm.com/) installed

Run the following commands in the Terminal

```sh
# Clone the repo
$ git clone https://github.com/Zero-1729/mynote/

# Go into repo and install all dependencies
$ cd mynote && npm install

# Webpack builds once and watches for changes in files to apply
# Add '&' to command to run in background and continue watching files even after 'npm start'
# Or just regular 'npm run dev'
$ npm run dev &

# Run the app with Electron
$ npm start
```

---

### Installation

#### Regular

> Note: Builds are comming soon!

Builds can be found [at this page](https://github.com/Zero-1729/mynote/releases).

#### Build (advanced)

Please consider that **`master` is unstable.**

- Download [Electron](https://github.com/atom/electron/releases)
- Download MyNote [source code](https://github.com/zero1729/mynote/)
- Put it in a folder called `app` in `[Electron path]/resources`
- `npm install && npm run dev`
- Run Electron

### Packaging

> To package app for your platform

```sh
# Clone the repo
$ git clone https://github.com/Zero-1729/mynote/

# Go into repo and install all dependencies
$ cd mynote && npm install

# Build app
# Replace 'platform' with your os, e.g mac, win or linux
# Replace 'arch' with your os architecture, e.g 64-bit or 32-bit
$ npm run build:[platform]-[arch]
```

The built app will be in the `app/dist` folder.

---

### Troubleshooting

MyNote is currently in development. Meaning certain parts of the app can break after an update (database schemes changes, config, etc ).

If you encounter any hiccups when starting the app or during use, you can reset MyNote by following the steps below:

- Go to your home folder directory:
    - Windows: `%AppData%\mynote`
    - OSX: `~/Library/Application Support/mynote`
    - Linux: `~/.config/mynote/` or `$XDG_CONFIG_HOME/mynote`

- Delete:
    - `IndexedDB` folder
    - `config.json` file

- Restart MyNote

If you still encounter problems after that, you're more than welcome to open an issue or a PR ;)

---

### Bug report

If you want to report a bug, Just go ahead! To help us, please indicate your OS, your MyNote version, and how to reproduce it (exactly if possibly). Adding a screenshot of the app's current state.

---

### Contribute

- Fork and clone
- **bleading** is usually unstable, and packed with the latest additions. The **master** branch is usually stable. To help out in the hacking clone **bleeding** and to solidify defences clone **master**. (Just a pun :wink:)

- Install the latest version of electron either by running `npm install -g electron` or downloading the latest release available [here](https://github.com/electron/electron/releases) and just drop the app in the `resources/` folder.
- You can use electron now with `electron [electronapp-dir]` command if you installed electron using npm or by running your downloaded electron.

- `npm install && npm run dev` then run in a separate terminal `npm start`
- `npm run dev` will watch for file changes using Webpack which will recompile the Vue files.

- Open up DevTools

Please respect a few rules:

- Open an issue first to discuss about any major fixes or hacks.
- Make the code readable and comment where possible.


MIT &copy; Zero-1729
