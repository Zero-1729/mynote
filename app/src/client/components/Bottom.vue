<template>
    <footer id='bottom'>
        {{ noteCount }} Notes by {{ user }}
    </footer>
</template>

<script>
import os from 'os'

var userInfo = os.userInfo();

export default {
    data () {
        return {
            user: userInfo.username,
            show: "all"
        }
    },
    computed: {
        noteCount () {
            if (this.show === 'all') {
                return this.$store.state.allNotesCount
            }
            else if (this.show === 'favourites') {
                return this.$store.state.favNotesCount
            }
        }
    }
}
</script>
