<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogDept" :rules="rules" ref="deptForm">
      <el-row v-for="field in formFields" :key="field.prop" type="flex" align="middle">
        <el-col :span="4">{{ field.label }}</el-col>
        <el-col :span="16" :offset="2">
          <el-form-item :prop="field.prop">
            <el-input v-if="field.type === 'input'" v-model="dialogDept[field.prop]" :style="getInputStyle(field)">
              <template v-if="field.prefix && title !== '编辑菜单'" slot="prefix">{{ field.prefix }}</template>
            </el-input>
            <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows"
              v-model="dialogDept[field.prop]"></el-input>
            <el-input-number v-if="field.type === 'number'" v-model="dialogDept[field.prop]" :min="1"
              :default-value="field.defaultValue"></el-input-number>
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
    dept: {
      type: Object,
      default: () => ({})
    },
    deptList: {
      type: Array,
      default: () => []
    },
  },
  computed: {
  },
  data() {
    return {
      rules: {
        DeptName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        DeptType: [
          { required: true, message: '请输入菜单类型', trigger: 'blur' }
        ],
        // 如果备注是可选的，可以不添加规则
        Remark: [],

      },
      dialogVisible: this.visible,
      dialogTitle: this.title,
      dialogDept: Object,
      formFields: [
        {
          prop: 'DeptId',
          label: '部门编号',
          type: 'input',
        },
        {
          prop: 'DeptName',
          label: '部门名称',
          type: 'input',
        },
        {
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
    dept(newValue) {
      this.dialogDept = newValue;
    },

  },
  created() {
    this.dialogDept = this.dept;
  },
  components: {
  },
  mounted() {
  },
  methods: {
    getInputStyle(field) {
      if (this.title !== '编辑菜单') {
        switch (field.label) {
          case '图标':
            return {
              'padding-left': '100px',
              'width': '210px'
            };
          case '菜单路径':
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
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          this.$emit('confirmAction', this.dialogDept);

          this.cancelDialog();
        } else {
          // 验证不通过，提示用户
          this.$message.error('请填写必填项');
        }
      });
    },
    cancelDialog() {
      this.$emit('update:visible', false);
      this.$refs.deptForm.resetFields(); // 重置表单
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