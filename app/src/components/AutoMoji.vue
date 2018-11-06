<template>
    <table class="autocomp" v-show="candidates.length != 0">
        <tbody>
            <tr v-for="(name, i) in candidates"
            v-if="candidates.includes(name)"
            @click="complete(i)"
            :class="{active: i == current}">
                <td>{{ name }}</td>
            </tr>
        </tbody>
    </table>
</template>


<script>
export default {
    name: 'automoji',
    props: ['data', 'parent'],
    data() {
        return {
            show: false,
            alphnums: ['0','1','2','3','4','5','6','7','8','9',
                'a','b','c','d','e','f','g','h','i','j','k','l',
                'm','n','o','p','q','r','s','t','u','v','w','x',
                'y','z'
            ], // To ensure Proper formating
            trigger: ':', // if empty it just matches the text as you type
            emojiNames: []
        }
    },
    created() {
        // Populate 'emojiNames' variable with value passed to prop
        this.emojiNames = this.data
    },
    methods: {
        matchSensitivity() {
            if (this.trigger == this.lastChunk[0] && this.trigger != this.lastChunk[this.lastChunk.length-1]) {
                return true
            } else {
                if (this.trigger == '') {
                    // Special case matched later
                    return null
                } else {
                    return false
                }
            }
        },
        complete(index) {
            // Use Editor's 'complete' implementation
            this.$parent.$parent.complete(index)
        },
        getLastChunkIndex() {
            let lastChunk = this.lastChunk.replace(/\n/g, '')

            let editedLastChunk = !this.alphnums.includes(this.trigger) && this.trigger.length != 0 ? lastChunk.slice(1) : lastChunk

            let index = this.candidates.filter((row) => {
                return row == editedLastChunk
            })

            return index.length != 0 ? this.candidates.indexOf(index[0]) : -1
        },
        swapElms(newIndex, index) {
            let list = this.candidates
            // Only performs swap if the index 'old' exists

            if (index != -1 && index != newIndex) {
                // Swaps the element at 'old' with the element at 'index'
                let oldElm = list[newIndex]
                let newElm = list[index]

                list[index] = oldElm
                list[newIndex] = newElm

                return list
            } else {return this.candidates}
        }
    },
    computed: {
        candidates() {
            // For special case of '' trigger, we handle text matching directly
            if (this.matchSensitivity() == null) {
                return this.lastChunk != '' ? this.emojiNames.filter((name) => {
                    return name.toLowerCase().includes(this.lastChunk.toLowerCase())
                }) : []
            } else {
                    return this.lastChunk != '' && this.matchSensitivity() ? this.emojiNames.filter((name) => {
                        return name.toLowerCase().includes(this.lastChunk.slice(1).toLowerCase())
                }) : []
            }
        },
        activeNoteText() {
            return this.$store.getters.activeNote.text
        },
        currentCaretPos() {
            return this.$parent.$parent.caretPos
        },
        lastChunk() {
            return !this.$parent.$parent.completed ? this.activeNoteText.slice(0, this.currentCaretPos+1).split("\n")[this.activeNoteText.slice(0, this.currentCaretPos).split("\n").length - 1].split(" ")[this.activeNoteText.slice(0, this.currentCaretPos+1).split("\n")[this.activeNoteText.slice(0, this.currentCaretPos).split("\n").length - 1].split(" ").length-1] : ''
        },
        current() {
            return this.$parent.$parent.index
        }
    },
    watch: {
        candidates: function (prev, curr) {
            if (prev.length > 0) {
                this.$store.dispatch("setAutoMojiOpen", true)
            } else {
                this.$store.dispatch("setAutoMojiOpen", false)
            }
        }
    },
}
</script>

<style scoped>
    table {
        padding: 4px;
        margin-left: 8px;
        overflow-x: auto;
        position: absolute;
        background: #082133;
        transition: opacity 1s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        width: 96%;
        display: flex;
        flex-flow: row;
        position: absolute;
        bottom: 45px;
    }

    table tbody {
        display: flex;
    }

    table tr {
        background: none !important;
    }

    table tr:last-child {
        border-bottom: none;
    }

    table tr:hover {
        background: #d7d7d7;
        opacity: 0.8;
    }

    table td {
        white-space: nowrap;
        padding: 0px 15px;
        font-size: 12px;
        cursor: pointer;
    }

    table::-webkit-scrollbar {
        width: 1px;
        height: 1px;
    }
</style>
