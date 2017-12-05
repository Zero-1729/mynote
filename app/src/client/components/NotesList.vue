<template>
    <div id="notes-list">

    <div class="search-bar">
        <input class="search" type="search" placeholder="Search Notes" v-model="search">
    </div>

    <div id="list-header">

        <div class="btn-group btn-main-group" role="group">
            <!-- All Notes button -->
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-1"
                    @click="show = 'all'"
                    :class="{activeBtn: show === 'all'}">
                    All Notes
                </button>
            </div>
            <!-- Favourite Button -->
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-2"
                    @click="show = 'favourites'"
                    :class="{activeBtn: show === 'favourites'}">
                    Favourite
                </button>
            </div>
        </div>
        <!-- render notes in a list -->
        <div class="container">

            <div class="notes-list-canvas">

            <div class="list-group">
                <a v-for="note in filteredNotes"
                    class="list-group-item" href="#"
                    :class="{active: activeNote === note}"
                    @click="updateActiveNote(note)">
                    <h4 id="list-group-item-heading">
                        {{ note.text.trim().substring(0, 32) }}
                    </h4>
                </a>
            </div>

            </div>

        </div>
    </div>

    <div class="bottom-btns btn-group" role="group">
        <div class="btn-group add" role="group">
            <button @click="addNote" class="icon-btns btn-first">
                <svg class="heart" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="740.311 320.985 37.824 37.824" width="22" height="22"><path d=" M 760.723 341.397 Q 776.636 341.397 776.636 341.397 C 777.464 341.397 778.136 340.725 778.135 339.897 C 778.134 339.069 777.464 338.397 776.636 338.397 Q 776.636 338.397 760.723 338.397 Q 760.723 322.484 760.723 322.484 C 760.723 321.656 760.052 320.985 759.223 320.985 C 758.394 320.985 757.723 321.656 757.723 322.484 Q 757.723 322.484 757.723 338.397 Q 741.811 338.397 741.811 338.397 C 740.982 338.397 740.311 339.069 740.311 339.897 C 740.311 340.312 740.479 340.686 740.75 340.958 C 741.021 341.23 741.396 341.397 741.811 341.397 Q 741.811 341.397 757.723 341.397 Q 757.723 357.31 757.723 357.31 C 757.723 357.724 757.891 358.099 758.163 358.37 C 758.435 358.641 758.809 358.809 759.223 358.809 C 760.051 358.81 760.723 358.138 760.723 357.31 Q 760.723 357.31 760.723 341.397 Z " fill-rule="evenodd" fill="grey"/></svg>
            </button>
        </div>
        <div class="btn-group heart" :class="{starred: activeNote.favourite}" role="group">
            <button @click="toggleFavourite" class="icon-btns icon-after-1">
                <svg :class="{starred: activeNote.favourite}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="3479.05 508 41.939 34.081" width="24" height="24"><path d=" M 3514.803 508.999 C 3509.737 506.684 3503.751 508.531 3500.948 513.104 C 3500.947 513.105 3500.947 513.105 3500.944 513.107 C 3500.938 513.122 3500.93 513.138 3500.918 513.149 C 3500.917 513.155 3500.913 513.16 3500.912 513.164 C 3500.72 513.459 3500.38 513.656 3499.994 513.656 C 3499.608 513.656 3499.268 513.461 3499.077 513.164 C 3499.073 513.16 3499.071 513.155 3499.068 513.149 C 3499.058 513.138 3499.049 513.122 3499.043 513.107 C 3499.043 513.106 3499.043 513.106 3499.04 513.104 C 3496.239 508.531 3490.253 506.684 3485.185 508.999 C 3480.118 511.315 3477.494 517.682 3480.03 522.901 C 3482.031 527.02 3493.299 537.204 3497.966 541.32 C 3497.966 541.32 3497.97 541.32 3497.97 541.32 C 3498.503 541.791 3499.213 542.081 3499.994 542.081 C 3500.775 542.081 3501.477 541.793 3502.013 541.326 C 3502.013 541.326 3502.013 541.326 3502.013 541.326 C 3506.673 537.218 3517.954 527.024 3519.959 522.901 C 3522.496 517.682 3520.188 511.458 3514.803 508.999 C 3514.803 508.999 3514.803 508.999 3514.803 508.999 Z " fill-rule="evenodd" fill="grey"/></svg>
            </button>
        </div>
        <div class="btn-group delete" role="group">
            <button @click="deleteNote" class="icon-btns icon-after-1">
                 <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="1463.35 1327.38 33.88 38.88" width="20" height="22"><path d="M 1495.73 1332.88 L 1487.6 1332.88 Q 1487.6 1330.88 1487.6 1330.88 C 1487.6 1328.95 1486.03 1327.38 1484.1 1327.38 C 1484.1 1327.38 1476.23 1327.38 1476.23 1327.38 C 1474.3 1327.38 1472.73 1328.95 1472.73 1330.88 Q 1472.73 1330.88 1472.73 1332.88 Q 1464.85 1332.88 1464.85 1332.88 C 1464.03 1332.88 1463.35 1333.55 1463.35 1334.38 C 1463.35 1335.21 1464.03 1335.88 1464.85 1335.88 Q 1464.85 1335.88 1466.6 1335.88 Q 1466.6 1362.76 1466.6 1362.76 C 1466.6 1364.69 1468.17 1366.26 1470.1 1366.26 C 1470.1 1366.26 1490.35 1366.26 1490.35 1366.26 C 1492.28 1366.26 1493.85 1364.69 1493.85 1362.76 Q 1493.85 1362.76 1493.85 1335.88 Q 1495.73 1335.88 1495.73 1335.88 C 1496.56 1335.88 1497.23 1335.21 1497.23 1334.38 C 1497.23 1333.55 1496.56 1332.88 1495.73 1332.88 Q 1495.73 1332.88 1495.73 1332.88 Z" style="stroke:none;fill:grey;stroke-miterlimit:10;fill-rule:evenodd;"/></svg>
            </button>
        </div>
    </div>
    </div>

    </div>
</template>

<script>
import { updateActiveNote } from "./../../server/vuex/actions"

export default {
    data () {
        return {
            show: "all",
            search: ""
        }
    },
    methods: {
        addNote () {
            this.$store.dispatch("addNote")
        },
        updateActiveNote (note) {
            this.$store.dispatch("updateActiveNote", note)
        },
        toggleFavourite () {
            this.$store.dispatch("toggleFavourite")
        },
        deleteNote () {
            this.$store.dispatch("deleteNote")
        }
    },
    computed: {
        notes () {
            return this.$store.state.notes
        },
        filteredNotes () {

            if (this.show === "all") {

                var notes = this.notes;
                var search = this.search.toLowerCase();

                if (!search) {
                    return notes;
                }

                else {

                    return notes.filter(function(item) {
                        return item.text.toLowerCase().indexOf(search) !== -1
                    });

                }
                }

            else if (this.show === "favourites") {

                var notes = this.notes.filter(note => note.favourite);
                var search = this.search.toLowerCase();

                if (!search) {
                    return notes;
                }

                else {

                    return notes.filter(function(item) {
                        return item.text.toLowerCase().indexOf(search) !== -1
                    });

                }
            }
        },
        activeNote () {
            return this.$store.getters.activeNote
        }
    }
}
</script>
