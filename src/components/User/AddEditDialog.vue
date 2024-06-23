<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogUser" :rules="rules" ref="userForm">
      <el-row v-for="field in formFields" :key="field.prop" type="flex" align="middle">
        <el-col :span="4">{{ field.label }}</el-col>
        <el-col :span="16" :offset="2">
          <el-form-item :prop="field.prop">
            <el-input v-if="field.type === 'input'" v-model="dialogUser[field.prop]" >
            </el-input>
            <el-select v-if="field.type === 'select'&&field.label==='角色'" v-model="dialogUser[field.prop]" placeholder="请选择">
              <el-option v-for=" (key,value) in roleList" :key="value" :label="key"
              :value="value"></el-option>
             
            </el-select>
            <el-select v-if="field.type === 'select'&&field.label==='部门'" v-model="dialogUser[field.prop]" placeholder="请选择">
              <el-option v-for="(key,value) in deptList" :key="value" :label="key"
              :value="value"></el-option>
             
            </el-select>
            <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows"
              v-model="dialogUser[field.prop]"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取消</el-button>
      <el-button type="primary" @click="confirmAction">确定</el-button>
    </span>
  </el-dialog>
</template>


<script>
export default {
  name: 'AddEditDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    user: {
      type: Object,
      default: () => ({})
    },
    roleList: {
      type: Object,
      default: () => ({})
    },
    deptList:{
      type: Object,
      default: () => ({})
    }

  },
  computed: {
  },
  data() {
    return {
      rules: {
        UserName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        UserType: [
          { required: true, message: '请输入用户类型', trigger: 'blur' }
        ],
        // 如果备注是可选的，可以不添加规则
        Remark: [],

      },
      dialogVisible: this.visible,
      dialogTitle: this.title,
      dialogUser: Object,
      dialogRoleList: this.roleList,
      dialogDeptList: this.deptList,

      formFields: [
        {
          prop: 'UserName',
          label: '用户名称',
          type: 'input',
        },
        {
          prop: 'UserNickname',
          label: '昵称',
          type: 'input',
        },{
          prop: 'Pwd',
          label: '初始密码',
          type: 'input',
        },
        {
          prop: 'TwicePwd',
          label: '确认密码',
          type: 'input',
        },
        {
          prop: 'Sex',
          label: '性别',
          type: '',
        },
        {
          prop: 'DeptId',
          label: '部门',
          type: 'select', 
        },
        {
          prop: 'RoleId',
          label: '角色',
          type: 'select', 
        },{
          prop: 'Remark',
          label: '备注',
          type: 'textarea', // 假设这是一个文本域
          rows: 3,
        },
      ],
    }
  },
  watch: {
    visible(newValue) {
      this.dialogVisible = newValue;
    },
    title(newValue) {
      this.dialogTitle = newValue;
    },
    user(newValue) {
      this.dialogUser = newValue;
    },
    roleList(newValue) {
      this.dialogRoleList = newValue;
    },
    deptList(newValue) {
      this.dialogDeptList = newValue;
    }

  },
  created() {
    this.dialogUser = this.user;
    this.dialogRoleList = this.roleList;
    this.dialogDeptList = this.deptList;
  },
  components: {
  },
  mounted() {
  },
  methods: {
    confirmAction() {
      // 确认添加或编辑角色的逻辑
      this.$refs.userForm.validate(valid => {
        if (valid) {
          

          this.$emit('confirmAction', this.dialogUser);

          this.cancelDialog();
        } else {
          // 验证不通过，提示用户
          this.$message.error('请填写必填项');
        }
      });
    },
    cancelDialog() {
      this.$emit('update:visible', false);
      this.$refs.userForm.resetFields(); // 重置表单
    }
  }
}
</script>

<style scoped>
.rounded-checkbox-group {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.rounded-checkbox-group .el-checkbox {
  margin-bottom: 10px;
}

.el-checkbox {
  display: flex;
}

.children {
  margin-top: 10px;
}
</style>