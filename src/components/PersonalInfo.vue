<template>
    <div style="text-align: center;background-color: #f1f1f3;height: 100%;padding: 10px;margin: 0px;">
        <!-- 个人中心标题和描述列表 -->
        <el-descriptions title="个人中心" :column="2" size="40" border>
            <!-- 头像信息项，编辑模式下显示输入框，查看模式下显示文本 -->
            <el-descriptions-item :span="2">
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    头像
                </template>
                <el-image :src="imgsrc" fit="cover" style="width: 100px; height: 100px;"></el-image>
                <div v-if="editMode" class="custom-upload">
                    <label for="upload-file" class="el-button el-button--primary el-button--small">
                        选取文件
                    </label>
                    <input id="upload-file" type="file" @change="freshImg" style="display:none;" />
                    <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </div>
            </el-descriptions-item>

            <!-- 用户名信息项 -->
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    用户名
                </template>
                <el-input v-if="editMode" v-model="user.UserName"></el-input>
                <span v-else>{{ user.UserName }}</span>
            </el-descriptions-item>

            <!-- 昵称信息项 -->
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    昵称
                </template>
                <el-input v-if="editMode" v-model="user.UserNickname"></el-input>
                <span v-else>{{ user.UserNickname }}</span>
            </el-descriptions-item>

            <!-- 密码信息项 -->
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    密码
                </template>
                <el-input v-if="editMode" v-model="user.Pwd" type="password"></el-input>
                <span v-else>••••••••</span> <!-- 显示密码占位符 -->
            </el-descriptions-item>

            <!-- 性别信息项，编辑模式下显示下拉选择，查看模式下显示文本 -->
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    性别
                </template>
                <el-select v-if="editMode" v-model="user.Sex" placeholder="请选择性别">
                    <el-option label="男" :value="0"></el-option>
                    <el-option label="女" :value="1"></el-option>
                </el-select>
                <span v-else>{{ user.Sex === 0 ? '男' : '女' }}</span>
            </el-descriptions-item>

            <!-- 所属部门信息项 -->
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    所属部门
                </template>
                <el-input v-if="editMode" v-model="user.DeptName"></el-input>
                <span v-else>{{ user.DeptName }}</span>
            </el-descriptions-item>

            <!-- 电话信息项 -->
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    电话
                </template>
                <el-input v-if="editMode" v-model="user.Tel"></el-input>
                <span v-else>{{ user.Tel }}</span>
            </el-descriptions-item>

            <!-- 邮箱信息项 -->
            <el-descriptions-item>
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    邮箱
                </template>
                <el-input v-if="editMode" v-model="user.Email"></el-input>
                <span v-else>{{ user.Email }}</span>
            </el-descriptions-item>

            <!-- 简介 -->
            <el-descriptions-item :span="2">
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    简介
                </template>
                <el-input v-if="editMode" v-model="user.Remark" type="textarea"></el-input>
                <span v-else>{{ user.Remark }}</span>
            </el-descriptions-item>

            <!-- 上次登录信息项 -->
            <el-descriptions-item :span="2">
                <template slot="label">
                    <i class="el-icon-s-custom"></i>
                    上次登陆
                </template>
                <el-input v-if="false" v-model="user.LoginDate" readonly></el-input>
                <span v-else>{{ user.LoginDate }}</span>
            </el-descriptions-item>
        </el-descriptions>

        <!-- 按钮，切换编辑模式 -->
        <el-button @click="toggleEditMode" v-if="!editMode">编辑</el-button>
        <!-- 按钮组，编辑模式下显示，用于保存和取消 -->
        <div v-else>
            <el-button @click="saveChanges">保存</el-button>
            <el-button @click="cancelEdit">取消</el-button>
        </div>
    </div>
</template>


<script>
export default {
    name: "PersonalInfo",
    data() {
        return {
            editMode: false,
            imgObj: {},
            imgsrc: "",
        };
    },
    computed: {
        user() {
            var user = this.$store.state.user;
            user.Pwd = null;
            var date = Date.parse(user.LoginDate);

            // 如果日期有效，格式化日期
            if (!isNaN(date)) {
                user.LoginDate = new Date(date).toISOString().slice(0, 10);
            } else {
                // 如果日期无效，设置一个默认值或错误消息
                user.LoginDate = '无效的日期';
            }
            return user;
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
                        this.imgsrc = data.Item2.HeadImg;
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
        },
        toggleEditMode() {
            this.editMode = !this.editMode;
            if (this.editMode) {
                this.user.Pwd = '';
            }
        },
        saveChanges() {
            this.user.HeadImg = this.imgsrc;
            const UserFormData = new FormData();
            UserFormData.append("user", JSON.stringify(this.user));
            UserFormData.append("token", this.$store.state.token);
            UserFormData.append("userId", this.$store.state.user.UserId);
            this.$axios.post(this.$httpUrl + '/PersonalInfo/Update', UserFormData)
                .then(response => {
                    const data = response.data;
                    if (data.Item1) {
                        this.$store.commit('setUser', this.user);
                        this.editMode = false;
                        this.init();
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
        },
        cancelEdit() {
            // 重置表单数据
            // 切换回查看模式
            this.editMode = false;
        },
        beforeAvatarUpload(file) {
            // 上传前的校验
            const isJPGPNG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt500K = file.size / 1024 < 500;

            if (!isJPGPNG) {
                this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
            }
            if (!isLt500K) {
                this.$message.error('上传头像图片大小不能超过 500KB!');
            }
            return isJPGPNG && isLt500K;
        },
        freshImg(e) {
            let _this = this;
            _this.imgObj = e.target.files['0']; // 得到上传的第一个文件

            // 创建一个Image对象
            let img = new Image();

            // 读取文件并设置src
            img.onload = function () {
                // 创建一个canvas对象
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');

                canvas.width = img.width / 8;
                canvas.height = img.height / 8;

                // 将图片绘制到canvas上
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // 将canvas转换为base64编码的图片数据
                let dataUrl = canvas.toDataURL('image/jpeg', 0.5); // 调整质量参数

                // 计算压缩后的图片大小
                let compressedSize = dataUrl.length;
                console.log('Compressed image size:', compressedSize);

                // 如果压缩后的图片大小超过1KB，可以进一步调整canvas的尺寸
                if (compressedSize > 1024) {
                    canvas.width = img.width / 16;
                    canvas.height = img.height / 16;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    dataUrl = canvas.toDataURL('image/jpeg', 0.5); // 再次调整质量参数
                }

                // 将压缩后的图片数据赋值给图片标签路径
                _this.imgsrc = dataUrl;
            };

            // 读取图片数据
            img.src = URL.createObjectURL(_this.imgObj);
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

.custom-upload {
    margin-top: 10px;
}

.custom-upload .el-button {
    margin-right: 10px;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}

.custom-upload .el-button:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
}

.custom-upload .el-upload__tip {
    font-size: 12px;
    color: #999;
}
</style>
