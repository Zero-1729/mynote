<template>
    <div id='app' @keydown.ctrl.187.prevent="incFontSize"
    @keydown.ctrl.189.prevent="decFontSize"
    @keydown.ctrl.72.prevent="slidePane"
    @dragover.prevent
    @drop.prevent="open">
        <notes-list></notes-list>
        <transition name="enter">
            <editor></editor>
        </transition>
    </div>
</template>

<script>
    import NotesList  from './components/NotesList.vue'
    import Editor     from './components/Editor.vue'

    const {remote} = require('electron')

    window.dmoji  = require('./lib/downmoji')
    window.marked =  require('marked')
    window.katex = require('katex')

    window.path = require('path')
    window.fs   = require('fs')
    window.remote = remote

    window.h2m = require("html2markdown")

    window.emojisPath = window.path.join(path.resolve(), window.path.sep, 'app', window.path.sep, 'build', window.path.sep, 'emojis', window.path.sep, window.path.sep, 'pngs')

    export default {
        created() {
            // Disable Js 'eval' built-in function for security reasons
            window.eval = global.eval = () => {
                console.log("[Notice] 'MyNote' doesn't support 'window.eval' for security reasons")
                throw new Error("[Security Alert]")
            }
        },
        mounted() {
            // Load stylesheet
            this.$store.dispatch("loadStyle")

            // Load fonts
            document.getElementById('textarea').style.fontSize = String(this.currentFontSize).concat("px")
            document.getElementById('screen').style.fontSize = String(this.currentFontSize).concat("px")
        },
        computed: {
            currentFontSize() {
                return this.$store.getters.fontSize
            }
        },
        methods: {
            open() {
                console.log("DROPED >", event.dataTransfer.items)
            },
            incFontSize() {
                this.$store.dispatch("setFontSize", this.currentFontSize + 1)
                document.getElementById('textarea').style.fontSize = String(this.currentFontSize).concat("px")
                document.getElementById('screen').style.fontSize = String(this.currentFontSize).concat("px")
            },
            decFontSize() {
                // Find fix
                this.$store.dispatch("setFontSize", this.currentFontSize - 1)
                document.getElementById('textarea').style.fontSize = String(this.currentFontSize).concat("px")
                document.getElementById('screen').style.fontSize = String(this.currentFontSize).concat("px")
            },
            slidePane () {
                if (document.getElementById('notes-list').style.width.includes("px") || document.getElementById('notes-list').style.width == "") {
                    if ("0px" == document.getElementById('notes-list').style.width) {
                        document.getElementById('toolset').style.width = "0px"

                        function rest() {
                            document.getElementById('notes-list').style.visibility = 'visible'
                            document.getElementById('notes-list').style.width = "270px"
                            document.getElementById('editor').style.marginLeft = '270px'
                        }

                        // We want to give the effect off it (i.e the toolset) being closed all along
                        window.setTimeout(rest, 200)
                        window.clearTimeout(rest)
                    } else {
                        document.getElementById('notes-list').style.visibility = 'hidden'
                        document.getElementById('notes-list').style.width = "0px"
                        document.getElementById('editor').style.marginLeft = '0px'

                        for (var i = 0;i < 6;i++) {
                            document.getElementsByClassName('toolset-btns-holder')[i].style.visibility = 'hidden'
                        }
                    }
                }
            }
        },
        components: {
            NotesList,
            Editor
        }
    }
</script>

<style>
    @font-face {
    	font-family: 'Lato';
    	src: url('./styles/font/Lato-Regular.ttf');
    }

    html, #app {
        font-family: Lato, sans-serif !important;
        border: 0;
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
    }

    body {
        margin: 0;
        padding: 0;
        border: 0;
        height: 100%;
        max-height: 100%;
        position: relative;
    }

    .enter {
        transition: opacity 0.3s ease;
    }

    #screen a {
    	color: #4183C4 !important;
    	text-decoration: none !important;
    }

    #screen a.absent {
    	color: #cc0000 !important;
    }

    #screen a.anchor {
    	display: block !important;
    	padding-left: 30px !important;
    	margin-left: -30px !important;
    	cursor: pointer !important;
    	position: absolute !important;
    	top: 0 !important;
    	left: 0 !important;
    	bottom: 0 !important;
    }

    img, svg {
        -webkit-user-drag: none;
        user-select:none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
    }

    footer {
    	position: absolute;
    	flex-direction: row;
    	width: 100%;
    	bottom: 0;
    	height: 40px;
    	display: flex;
    	justify-content: space-between;
    }

    footer #show {
    	padding-top: 6px;
    }

    footer #write {
    	padding-top: 4px;
    }

    footer #bin {
    	padding-top: 4px;
    	padding-left: 6px;
    }

    footer #search {
    	display: flex;
    	padding-top: 2px;
    }

    footer #search svg {
    	margin-right: 6px;
    }

    footer #search input {
    	font-size: 14px;
    	margin-top: 6px;
    	padding: 4px;
        border-top: 0;
        border-left: 0;
        border-right: 0;
    	border-bottom-width: 0.4px;
    	outline: none;
    	user-select: none;
    	height: 22px;
    }

    footer #file svg {
    	padding-top: 2px;
    }

    h1, h2, h3, h4, h5, h6 {
    	margin: 20px 0 10px;
    	padding: 0;
    	font-weight: bold;
    	-webkit-font-smoothing: antialiased;
    	cursor: text;
    	position: relative;
    }

    h2:first-child, h1:first-child, h1:first-child + h2, h3:first-child, h4:first-child, h5:first-child, h6:first-child {
    	margin-top: 0;
    	padding-top: 0;
    }

    h1:hover a.anchor, h2:hover a.anchor, h3:hover a.anchor, h4:hover a.anchor, h5:hover a.anchor, h6:hover a.anchor {
    	text-decoration: none;
    }

    h1 tt, h1 code {
    	font-size: inherit;
    }

    h2 tt, h2 code {
    	font-size: inherit;
    }

    h3 tt, h3 code {
    	font-size: inherit;
    }

    h4 tt, h4 code {
    	font-size: inherit;
    }

    h5 tt, h5 code {
    	font-size: inherit;
    }

    h6 tt, h6 code {
    	font-size: inherit;
    }

    h1 {
    	font-size: 28px;
    }

    h2 {
    	font-size: 24px;
        padding-bottom: 4px;
    	border-bottom: 1.5px solid #eaeaea;
    }

    h3 {
    	font-size: 18px;
    }

    h4 {
    	font-size: 16px;
    }

    h5 {
    	font-size: 14px;
    }

    h6 {
    	color: rgb(152, 150, 150);
    	font-size: 14px;
    }

    p, blockquote, ul, ol, dl, li, table, pre {
    margin: 15px 0;
    }

    hr {
	width: 80px;
    	border: 0 none;
    	border-top: none;
    	border-left: none;
    	border-right: none;
    	border-bottom-style: dashed;
    	border-bottom-width: 1.5px;
    	color: #cccccc;
    	height: 4px;
    	padding: 0;
	margin-top: 50px;
	margin-bottom: 50px;
	margin-left: 45%;
    }

    body > h2:first-child {
    	margin-top: 0;
    	padding-top: 0;
    }

    body > h1:first-child {
    	margin-top: 0;
    	padding-top: 0;
    }

    body > h1:first-child + h2 {
    	margin-top: 0;
    	padding-top: 0;
    }

    body > h3:first-child, body > h4:first-child, body > h5:first-child, body > h6:first-child {
    	margin-top: 0;
    	padding-top: 0;
    }

    a:first-child h1, a:first-child h2, a:first-child h3, a:first-child h4, a:first-child h5, a:first-child h6 {
    	margin-top: 0;
    	padding-top: 0;
    }

    h1 p, h2 p, h3 p, h4 p, h5 p, h6 p {
    	margin-top: 0;
    }

    li p.first {
    	display: inline-block;
    }

    ul, ol {
    	padding-left: 30px;
    }

    ul :first-child, ol :first-child {
    	margin-top: 0;
    }

    ul :last-child, ol :last-child {
    	margin-bottom: 0;
    }

    dl {
    	padding: 0;
    }

    dl dt {
    	font-size: 14px;
    	font-weight: bold;
    	font-style: italic;
    	padding: 0;
    	margin: 15px 0 5px;
    }

    dl dt:first-child {
    	padding: 0;
    }

    dl dt > :first-child {
    	margin-top: 0;
    }

    dl dt > :last-child {
    	margin-bottom: 0;
    }

    dl dd {
    	margin: 0 0 15px;
    	padding: 0 15px;
    }

    dl dd > :first-child {
    	margin-top: 0;
    }

    dl dd > :last-child {
    	margin-bottom: 0;
    }

    /*blockquote {
    	border-left: 4px solid #dddddd;
    	padding: 5px 15px;
    	color: #6a737d;
    }*/

    blockquote > :first-child {
    	margin-top: 0;
    }

    blockquote > :last-child {
    	margin-bottom: 0;
    }

    table {
        border-radius: 3px;
    	padding: 0;
    }
    table tr {
    	margin: 0;
    	padding: 0;
    }

    table tr th {
    	font-weight: bold;
    	/*border: 1px solid #cccccc;*/
    	text-align: left;
    	margin: 0;
    	padding: 6px 13px;
    }

    table tr td {
    	/*border: 1px solid #cccccc;*/
    	text-align: left;
    	margin: 0;
    	padding: 6px 13px;
    }

    table tr th :first-child, table tr td :first-child {
    	margin-top: 0;
    }

    table tr th :last-child, table tr td :last-child {
    	margin-bottom: 0;
    }

    img {
    	max-width: 100%;
    }

    span.frame {
    	display: block;
    	overflow: hidden;
    }

    span.frame > span {
    	border: 1px solid #dddddd;
    	display: block;
    	float: left;
    	overflow: hidden;
    	margin: 13px 0 0;
    	padding: 7px;
    	width: auto;
    }

    span.frame span img {
    	display: block;
    	float: left;
    }

    span.frame span span {
    	clear: both;
    	color: #333333;
    	display: block;
    	padding: 5px 0 0;
    }

    span.align-center {
    	display: block;
    	overflow: hidden;
    	clear: both;
    }

    span.align-center > span {
    	display: block;
    	overflow: hidden;
    	margin: 13px auto 0;
    	text-align: center;
    }

    span.align-center span img {
    	margin: 0 auto;
    	text-align: center;
    }

    span.align-right {
    	display: block;
    	overflow: hidden;
    	clear: both;
    }

    span.align-right > span {
    	display: block;
    	overflow: hidden;
    	margin: 13px 0 0;
    	text-align: right;
    }

    span.align-right span img {
    	margin: 0;
    	text-align: right;
    }

    span.float-left {
    	display: block;
    	margin-right: 13px;
    	overflow: hidden;
    	float: left;
    }

    span.float-left span {
    	margin: 13px 0 0;
    }

    span.float-right {
    	display: block;
    	margin-left: 13px;
    	overflow: hidden;
    	float: right;
    }

    span.float-right > span {
    	display: block;
    	overflow: hidden;
    	margin: 13px auto 0;
    	text-align: right;
    }

    code, tt {
    	margin: 0 2px;
    	padding: 0 5px;
    	white-space: nowrap;
    	border: 1px solid #eaeaea;
    	border-radius: 3px;
    }

    pre code {
    	margin: 0;
    	padding: 0;
    	white-space: pre;
    	border: none;
    	background: transparent;
    }

    .highlight pre {
    	border: 1px solid #cccccc;
    	line-height: 19px;
    	overflow: auto;
    	padding: 6px 10px;
    	border-radius: 3px;
    }

    pre {
    	line-height: 19px;
    	overflow: auto;
    	padding: 6px 10px;
    	border-radius: 3px;
    }

    pre code, pre tt {
    	background-color: transparent;
    	border: none;
    }

    .btn {
    	border: none;
    	outline: none;
    	padding: 8px 22px;
    	text-align: center;
    	text-decoration: none;
    	display: inline-block;
    	font-size: 14px;
    	font-weight: 600;
    	cursor: pointer;
    	-webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
    }

    .btn-main-group {
    	margin-left: 3px;
    }

    .btn-group {
    	font-size: 14px;
        float: left;
    	margin-bottom: 15px;
    }

    .btn-group:after, .btn-group:before {
        content:"";
        display:table;
        clear:both;
    }

    .btn:hover {
        opacity: 0.95;
    }

    .btn-1 {
    	font-size: 13px;
    	border-bottom-left-radius: 4px;
    	border-top-left-radius: 4px;
    }

    .btn-2 {
    	font-size: 13px;
    	border-bottom-right-radius: 4px;
    	border-top-right-radius: 4px;
    }

    .icon-after-1 {
    	margin-left: 28px;
    }

    .btn-first {-webkit-user-select: none;
    	margin-left: 22px;
    }

    .sidebtn {
    	outline: none;
    	border-style: hidden;
    	border-radius: 5px;
    }

    .sidebtn:active {
    	transform: Scale(0.95);
    }

    .add, .heart, .bin, .export, .nightm, .settings {
    	cursor: pointer;
    }

    .icon-btns {
    	border: none;
    	outline: none;
    	background: none;
    	text-align: center;
    	text-decoration: none;
    	display: inline-block;
    	font-weight: bold;
    	cursor: pointer;
    	-webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;-webkit-user-select: none;
    	transition: opacity 0.5s ease;
    }

    .icon-btns:active {
        opacity: .75;
    }

    .toolset-btns {
    	display: flex;
    	margin-top: 4px;
    	padding: 10px;
    	bottom: 5px;
    	align-items: center;
    }

    .toolset-btns-holder {
    	visibility: hidden;
    	padding-left: 4px;
    	padding-right: 15px;
    }

    .toolset-btns-holder:active {
    	transform: Scale(0.9);
    }

    .bin:hover path {
    	fill: red !important;
    }

    .starred path {
    	fill: #ff1389 !important;
    }
</style>
