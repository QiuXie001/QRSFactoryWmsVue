<template>
    <div style="display: flex;line-height: 60px;">
        <div style="margin-top: 8px;">
            <i :class="icon" style="font-size: 20px;cursor: pointer;" @click="collapse"></i>
        </div>
        <div style="flex: 1;text-align: center;font-size: 34px;">
            <span>WMS System</span>
        </div>
        <div class="custom-dropdown">
            <img 
            :src=" user.HeadImg" 
            @click="isDropdownOpen = !isDropdownOpen"
                />
            <transition name="fade">
                <el-menu v-show="isDropdownOpen" class="dropdown-menu" :default-active="activeIndex">
                    <el-menu-item index="1" @click="isDropdownOpen = false, toUser()">个人信息</el-menu-item>
                    <el-menu-item index="2" @click="isDropdownOpen = false, logout()">退出登录</el-menu-item>
                </el-menu>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            isDropdownOpen: false,
            activeIndex: '1',
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    props: {
        icon: String
    },
    methods: {
        init() {
        },
        toUser() {
            this.$router.push("/PersonalInfo")
        },
        logout() {
            this.$confirm('您确定要退出登录吗?', '提示', {
                confirmButtonText: '确定',  //确认按钮的文字显示
                type: 'warning',
                center: true, //文字居中显示
            })
                .then(() => {
                    this.$axios.get(this.$httpUrl + '/Authentication/CheckLogout')
                        .then(logoutres => logoutres.data).then(logoutres => {
                            if (logoutres.Item1) {
                                this.$message({
                                    type: 'success',
                                    message: logoutres.Item2
                                })
                                this.$store.commit('reset');
                                this.$router.push("/");
                                sessionStorage.clear();
                            }
                            else {
                                this.$message({
                                    type: 'error',
                                    message: logoutres.Item2
                                })
                            }
                        })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出登录'
                    });
                });
        },
        collapse() {
            this.$emit('doCollapse')
        }

    },
    created() {
        this.init();
        this.$router.push("/Home")
    }

}
</script>

<style scoped>
img {
    border-radius: 50%; /* 创建圆形 */
    width: 65px; /* 图片宽度 */
    height: 65px; /* 图片高度 */
    cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.custom-dropdown {
    position: relative;
    display: flex;
    align-items: center; /* 使子元素垂直居中 */
    height: 70px; /* 假设header的高度是60px */
}

.custom-dropdown .dropdown-menu {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    position: absolute;
    top: 50px;
    right: 0;
    width: auto;
    background-color: #fff;
    z-index: 1000;
}
</style>