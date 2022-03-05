export default {
    computed: {
        thisData() {
            return JSON.stringify(this.questionnaire)
        }
    },
    watch: {
        thisData: function () {
            if (!this.readonly) {
                this.$localforage.setItem(window.location.href + this.$options.name, this.thisData)
            }
        }
    },
    async mounted() {
        if (!this.readonly) {
            let temp = await this.$localforage.getItem(window.location.href + this.$options.name)
            if (!temp) return
            temp = JSON.parse(temp)
            if (this.$options.name == "suifang") temp.nextdate = ""
            this.questionnaire = temp

        }
    },
    methods: {
        removeTempSave() {
            this.$localforage.removeItem(window.location.href + this.$options.name)
        }
    }
}