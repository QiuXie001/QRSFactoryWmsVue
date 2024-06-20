<template>
    <el-menu
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="height: 100%;"
        default-active="/Home"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
    >
        <el-menu-item index="/Home">
            <i class="el-icon-s-home" style="font-size: 36px;"></i>
            <span slot="title">首页</span>
        </el-menu-item>

        <el-submenu v-for="(item, i) in menu" :key="i" :index="String(i)">
            <template slot="title">
                <i :class="item.Icon"></i>
                <span>{{ item.Name }}</span>
            </template>
            <el-menu-item v-for="child in item.Children" :key="child.Url" :index="child.Url" >
                <i :class="child.Icon"></i>
                <span slot="title">{{ child.Name }}</span>
            </el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
export default {
    name: "Aside",
    data() {
        return {
        }
    },
    computed: {
        menu() {
            return this.$store.state.menu;
        }
    },
    props: {
        isCollapse: Boolean
    }
}
</script>

<style scoped>
span{
    padding-left: 10px;
}
.el-menu{
    width:99.9%;
}
</style>
