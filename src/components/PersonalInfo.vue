<template>
    <div style="text-align: center;background-color: #f1f1f3;height: 100%;padding: 10px;margin: 0px;">
        <el-descriptions title="个人中心" :column="2" size="40" border>
            
            <el-descriptions-item :span="2">
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    头像
                </template>
                {{ user.HeadImg }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    用户名
                </template>
                {{ user.UserName }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    昵称
                </template>
                {{ user.UserNickname }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    密码
                </template>
                {{ user.Pwd }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    所属部门
                </template>
                {{ user.DeptName }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    电话
                </template>
                {{ user.Tel }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    邮箱
                </template>
                {{ user.Email }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    简介
                </template>
                {{ user.Remark }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    上次登陆
                </template>
                {{ user.LoginDate}}
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script>
export default {
    name: "PersonalInfo",
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    methods: {
        init() {
            const UserFormData = new FormData();
            UserFormData.append("token", this.$store.state.token);
            UserFormData.append("userId", this.$store.state.user.UserId);
            this.$axios.post(this.$httpUrl + '/PersonalInfo/GetInfo', UserFormData)
                .then(response => {
                    const data = response.data;
                    if (data.Item1) {
                        this.$store.commit('setUser', data.Item2);
                    } else {
                        this.$message({
                            type: 'error',
                            message: data.Item2
                        });
                    }
                })
                .catch(error => {
                    this.$message({
                        type: 'error',
                        message: error
                    });
                });
        }
    },
    created() {
        this.init();
    }
}
</script>

<style scoped>
    .el-descriptions {
        width: 90%;
        margin: 0 auto;
        text-align: center;
    }
</style>
