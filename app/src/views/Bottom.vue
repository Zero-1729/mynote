<template>
    <footer id='bottom'>
        <automoji :data="emojiNames" :parent="this.$parent"></automoji>
        <search></search>
        <div class="item-0 slowIn">
            <p :class="{hidden: showInfo}">
                <b>Read Time</b>: {{ readTime[0] }} mins {{ readTime[1] }} secs &nbsp;&nbsp; <b>Created</b>: {{created}} &nbsp;&nbsp;&nbsp; <b>Updated</b>: {{updated}}
            </p>
            <p :class="{hidden: !showInfo}">{{ noteCount }} Notes by {{ user }}</p>
        </div>
        <button class="item-1" @click="toggleLiveMode" :class="{live: isLive == true}">
            <svg class="md-icn" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="8.2 7 19.607 5.86" width="28.607" height="14.86">
                <g><path d="M 8.768 9.344 L 10.723 9.344 C 11.036 9.344 11.291 9.599 11.291 9.912 L 11.291 9.938 C 11.291 10.251 11.036 10.506 10.723 10.506 L 8.768 10.506 C 8.455 10.506 8.2 10.251 8.2 9.938 L 8.2 9.912 C 8.2 9.599 8.455 9.344 8.768 9.344 Z" style="stroke:none;stroke-miterlimit:10;"/><path d="M 11.402 7 L 12.019 7 C 12.366 7 12.648 7.26 12.648 7.581 L 12.648 7.581 C 12.648 7.902 12.366 8.162 12.019 8.162 L 11.402 8.162 C 11.055 8.162 10.773 7.902 10.773 7.581 L 10.773 7.581 C 10.773 7.26 11.055 7 11.402 7 Z" style="stroke:none;stroke-miterlimit:10;"/><path d="M 11.604 11.688 L 12.604 11.688 C 12.999 11.688 13.319 11.948 13.319 12.269 L 13.319 12.269 C 13.319 12.59 12.999 12.85 12.604 12.85 L 11.604 12.85 C 11.209 12.85 10.889 12.59 10.889 12.269 L 10.889 12.269 C 10.889 11.948 11.209 11.688 11.604 11.688 Z" style="stroke:none;stroke-miterlimit:10;"/><g><path d=" M 14.329 7.005 L 17.326 7.005 L 17.326 8.167 L 14.329 8.167 C 13.786 8.167 13.346 7.906 13.346 7.586 L 13.346 7.586 C 13.346 7.265 13.786 7.005 14.329 7.005 L 14.329 7.005 Z  M 12.692 9.329 L 16.989 9.329 L 16.989 10.491 L 12.692 10.491 C 12.31 10.491 12 10.231 12 9.91 L 12 9.91 C 12 9.589 12.31 9.329 12.692 9.329 L 12.692 9.329 Z  M 14.76 11.66 L 17 11.66 L 17.241 12.385 C 17.328 12.647 17.174 12.86 16.898 12.86 L 14.76 12.86 C 14.341 12.86 14 12.591 14 12.26 L 14 12.26 C 14 11.929 14.341 11.66 14.76 11.66 Z " fill-rule="evenodd" /><path d=" M 16.261 9.361 L 16.26 9.361 L 16.376 8.715 L 16.681 7 L 18.41 7.001 L 17.484 12.357 C 17.437 12.629 17.175 12.847 16.899 12.843 L 16.705 12.84 C 16.12 12.832 15.729 12.358 15.831 11.782 L 15.853 11.661 L 15.853 11.661 L 15.852 11.661 L 16.049 10.559 L 16.261 9.361 Z  M 16.261 9.361 L 16.439 9.361 L 16.439 9.361 C 16.998 9.361 17.452 9.093 17.452 8.764 L 17.452 8.764 C 17.452 8.434 17.014 8.167 16.475 8.167 L 16.475 8.167 L 16.376 8.715 L 16.261 9.361 L 16.261 9.361 L 16.261 9.361 Z  M 15.853 11.661 L 15.885 11.661 L 15.885 11.661 C 16.444 11.661 16.899 11.393 16.899 11.064 L 16.899 11.064 C 16.899 10.734 16.525 10.467 16.065 10.467 L 16.065 10.467 L 16.049 10.559 L 15.853 11.661 L 15.853 11.661 L 15.853 11.661 Z " fill-rule="evenodd"/></g><g><g><path d=" M 19.632 10.451 L 17.49 7.717 L 18.184 7.08 C 18.306 6.968 18.486 6.984 18.585 7.116 L 20.556 9.728 C 20.765 10.004 20.729 10.389 20.477 10.586 L 20.477 10.586 C 20.224 10.784 19.846 10.724 19.632 10.451 Z " /><path d=" M 20.65 10.451 L 23.351 7 L 22.178 7 C 22.012 7 21.795 7.106 21.693 7.236 L 19.735 9.734 C 19.522 10.007 19.553 10.389 19.806 10.586 L 19.806 10.586 C 20.058 10.784 20.436 10.723 20.65 10.451 Z "/></g><path d=" M 27.626 8.774 C 27.505 8.433 27.318 8.128 27.065 7.861 C 26.812 7.594 26.488 7.385 26.093 7.233 C 25.699 7.081 25.238 7.005 24.711 7.005 L 22.484 7.005 L 21.689 12.355 C 21.648 12.628 21.839 12.85 22.115 12.85 L 24.406 12.85 C 25.151 12.85 25.776 12.736 26.281 12.508 C 26.786 12.281 27.167 11.946 27.423 11.505 C 27.679 11.063 27.807 10.518 27.807 9.869 C 27.807 9.481 27.747 9.116 27.626 8.774 Z  M 26.131 10.577 C 26.063 10.796 25.951 10.999 25.792 11.186 C 25.633 11.373 25.415 11.523 25.137 11.636 C 24.859 11.748 24.526 11.804 24.139 11.804 L 23.327 11.804 L 23.89 8.047 L 24.139 8.047 C 24.686 8.047 25.114 8.143 25.423 8.336 C 25.732 8.528 25.943 8.762 26.058 9.038 C 26.173 9.313 26.231 9.597 26.231 9.89 C 26.231 10.129 26.197 10.358 26.131 10.577 Z "/></g></g>
            </svg>
        </button>
    </footer>
</template>

<script>
    import os from 'os'
    import automoji from './../components/AutoMoji.vue'
    import search from './../components/Search.vue'

    const { ghEmojiNames, eoEmojiNames } = require('./../util/downmoji')

    export default {
        components: {
            automoji,
            search
        },
        data () {
            return {
                user: os.userInfo().username,
                showInfo: false
            }
        },
        mounted() {
            // To Dynamically swap bottom info
            setInterval(()=> {this.showInfo = !this.showInfo}, 100000)
        },
        methods: {
            formatTime(time) {
                // Lets obtain our min and secs
                let min = Math.trunc(Number(time / 60))
                let secs = Math.round(Number(time % 60))

                // Format min and secs
                secs = secs < 60 ? secs : secs

                // return parsed value
                return [min,secs]
            },
            toggleLiveMode() {
                this.$store.dispatch("toggleLiveMode")
            },
            editNote(text) {
                this.$store.dispatch("editNote", text)
            }
        },
        computed: {
            emojiNames() {
                return this.emojisType == "EmojiOne" ? eoEmojiNames : ghEmojiNames
            },
            readTime() {
                // Using Assumption that average Adult reads 200 words per minute (WPM)
                // Returns 'time' in secs
                return this.formatTime((this.currentText.split(' ').length / 200) * 60)
            },
            activeNote() {
                return this.$store.getters.activeNote
            },
            updated() {
                return this.activeNote.timestamp.slice(0, 15)
            },
            created() {
                return this.activeNote.epoch.slice(0, 15)
            },
            noteCount () {
                if (this.show == 'all') {
                    return this.$store.state.allNotesCount
                }
                else if (this.show == 'fav') {
                    return this.$store.state.favNotesCount
                }
            },
            isLive () {
                return this.$store.getters.live
            },
            show () {
                return this.$store.getters.onPane
            },
            currentText() {
                return this.$store.getters.activeNote.text
            },
            emojisType() {
                return this.$store.getters.settings.emojisType
            }
        }
    }
</script>

<style scoped>

    .slowIn {
        transition: opacity 0.4s ease-in;
    }

    button:focus {
        outline: none;
    }

    #bottom {
        z-index: 9999;
        display: flex;
        font-size: 14px;
        line-height: 2.200rem;
        height: 2.4rem;
        cursor: default;
        position: sticky;
        -webkit-user-select: none;
    }

    .md-icn {
        margin-top: 2px;
    	margin-right: 2px;
    }

    .item-0 {
        width: 100%;
        display: flex;
        position: relative;
    }

    .item-0 p {
        position: absolute;
        top: -14px;
        width: 100%;
        padding-left: 35px;
        text-align: center;
        transition: .6s ease-out;
    }

    .item-1 {
        font-size: 12px;
        margin-top: 6.5px;
        margin-right: 10px;
        height: 25px;
        border-radius: 2px;
        border-style: none;
        width: 58px;
        outline: none;
        transition: background 0.3s linear;
    }

    .item-1:hover {
        cursor: pointer;
    }

    .hidden {
        opacity: 0;
    }
</style>
