<template>
    <div style="text-align: center;background-color: #f1f1f3;height: 100%;padding: 0px;margin: 0px;">
        <h1 style="font-size: 50px;">{{'欢迎！'+user.UserNickname}}</h1>

        <DateUtils></DateUtils>
    </div>
</template>

<script>
    import DateUtils from "./DateUtils";
    export default {
        name: "Home",
        components: {DateUtils},
        data() {

            return {
                user:{}
            }
        },
        computed:{

        },
        methods:{
            init(){
                this.user = this.$store.state.user;
            }
        },
        created(){
            this.init()
        }
    }
</script>

<style scoped>
    .el-descriptions{
        width:90%;

        margin: 0 auto;
        text-align: center;
    }
</style>