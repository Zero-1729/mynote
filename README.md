# MyNote

A Hybrid Minimalist's Cross-Platform Notes App

> Built with [Electron](https://github.com/atom/electron/), [Vue.js](https://vuejs.org/) with [Vuex](https://vuejs.org/vuex)

![Screenshot](Screenshot.png)

---

### Features

- Supports Markdown and KaTeX 
- Emoji Support (including the GitHub Mark and Octocat)
- Notes Categorizer (Favourites & all Notes)
- Auto-Hot Save notes (Saves as you type)
- Fuzzy Notes Search bar
- Status info Footer
- Light/Night Mode
- Sleep mode blocker

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

# Run the app
$ npm start
```

---

### Installation

#### Regular

> Note: Builds are comming soon!

Builds can be found [at this page](https://github.com/Zero-1729/mynote/releases).

### Packaging

> To package app for your platform

```sh
# Clone the repo
$ git clone https://github.com/Zero-1729/mynote/

# Go into repo and install all dependencies
$ cd mynote && npm install

# Build App
# Replace 'platform' with your OS, e.g mac, win or Linux
# Replace 'arch' with your OS architecture, e.g 64-bit or 32-bit
$ npm run build:[platform]-[arch]
```

The built app will be in the `app/dist` folder.

---

### Bug report

If you want to report a bug or encounter any problems feel free to open an issue or a PR :wink:.

It would be very helpful if you:-

- please indicate your OS
- your MyNote version
- And how to reproduce it (exactly if possibly)
- Adding a screenshot of the app's current state.

You can also include any possible solution(s) if you have any.

---

### Contribute

- Fork and clone
- **bleading** is usually unstable, and packed with the latest additions. The **master** branch is usually stable. To help out in the hacking clone **bleeding** and to solidify deffences clone **master**. (Just a pun :wink:)
- `npm install && npm run dev` then run in a separate terminal (window) `npm start`
- Open up the App's DevTools and have fun

Please respect the following rules:

- Open an issue first to discuss about any major fixes or possible hacks.
- No aggressive or degrading language would be tolerated in any discussion (issues, commits, etc).
- Make the code readable and comment where possible.


MIT &copy; Zero-1729
