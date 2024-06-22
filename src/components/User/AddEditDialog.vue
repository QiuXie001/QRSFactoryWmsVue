<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogUser" :rules="rules" ref="menuForm">
      <el-row v-for="field in formFields" :key="field.prop" type="flex" align="middle">
        <el-col :span="4">{{ field.label }}</el-col>
        <el-col :span="16" :offset="2">
          <el-form-item :prop="field.prop">
            <el-input v-if="field.type === 'input'" v-model="dialogUser[field.prop]" :style="getInputStyle(field)">
              <template v-if="field.prefix && title !== '编辑用户'" slot="prefix">{{ field.prefix }}</template>
            </el-input>

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
    menu: {
      type: Object,
      default: () => ({})
    },
    parentUserList: {
      type: Array,
      default: () => []
    },
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
      dialogParentUserList: this.parentUserList,
      formFields: [
        {
          prop: 'UserName',
          label: '用户名称',
          type: 'input',
        }, {
          prop: 'UserType',
          label: '用户类型',
          type: 'input',
        }, {
          prop: 'UserUrl',
          label: '用户路径',
          type: 'input',
          prefix: '/',
        }, {
          prop: 'UserIcon',
          label: '图标',
          type: 'input',
          prefix: 'iconfont icon-',
        }, {
          prop: 'UserParent',
          label: '父用户',
          type: 'select',
        }, {
          prop: 'Sort',
          label: '展示顺序',
          type: 'number',
          defaultValue: 1,
        }, {
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
    menu(newValue) {
      this.dialogUser = newValue;
    },
    parentUserList(newValue) {
      this.dialogParentUserList = newValue;
    },

  },
  created() {
    this.dialogUser = this.menu;
    this.dialogParentUserList = this.parentUserList;
  },
  components: {
  },
  mounted() {
  },
  methods: {
    getInputStyle(field) {
      if (this.title !== '编辑用户') {
        switch (field.label) {
          case '图标':
            return {
              'padding-left': '100px',
              'width': '210px'
            };
          case '用户路径':
            return {
              'padding-left': '20px',
              'width': '290px'
            };

          default:
            return '';
        }
      }
    },
    confirmAction() {
      // 确认添加或编辑角色的逻辑
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          this.dialogUser.UserUrl = this.getInputPrefix('UserUrl') + this.dialogUser.UserUrl;
          this.dialogUser.UserIcon = this.getInputPrefix('UserIcon') + this.dialogUser.UserIcon;

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
      this.$refs.menuForm.resetFields(); // 重置表单
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