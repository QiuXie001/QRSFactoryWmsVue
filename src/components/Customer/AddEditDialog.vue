<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogCustomer" :rules="rules" ref="CustomerForm">
      <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
        <el-input v-if="field.type === 'input'" v-model="dialogCustomer[field.prop]"></el-input>
        <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows" v-model="dialogCustomer[field.prop]">
        </el-input>
        <el-select v-if="field.type === 'select'" v-model="dialogCustomer[field.prop]"
          placeholder="请选择级别">
          <el-option v-for="item in LevelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
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
    Customer: {
      type: Object,
      default: () => ({})
    },
  },
  computed: {
  },
  data() {
    return {
      rules: {
        CustomerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        CustomerNo: [
          { required: true, message: '请输入客户编号', trigger: 'blur' }
        ],
        // 如果备注是可选的，可以不添加规则
        Remark: [],

      },
      dialogVisible: this.visible,
      dialogTitle: this.title,
      dialogCustomer: Object,
      formFields: [
        {
          prop: 'CustomerNo',
          label: '客户编号',
          type: 'input',
        },
        {
          prop: 'CustomerName',
          label: '客户名称',
          type: 'input',
        }, {
          prop: 'Address',
          label: '地址',
          type: 'input',
        },
        {
          prop: 'Tel',
          label: '电话',
          type: 'input',
        },
        {
          prop: 'CustomerPerson',
          label: '联系人',
          type: 'input',
        },
        {
          prop: 'Email',
          label: '邮箱',
          type: 'input',
        },
        {
          prop: 'CustomerLevel',
          label: '级别',
          type: 'select',
        },
        {
          prop: 'Remark',
          label: '备注',
          type: 'textarea', // 假设这是一个文本域
          rows: 3,
        },
      ],
      LevelList: [
        { label: '普通客户', value: '0' },
        { label: '重点客户', value: '1' },
        { label: 'VIP客户', value: '2' },
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
    Customer(newValue) {
      this.dialogCustomer = newValue;
    },
  },
  created() {
    this.dialogCustomer = this.Customer;

  },
  mounted() {
  },
  methods: {
    confirmAction() {
      // 确认添加或编辑客户的逻辑
      this.$refs.CustomerForm.validate(valid => {
        if (valid) {
          this.$emit('confirmAction', this.dialogCustomer, this.menuIds);
          this.cancelDialog();
        } else {
          // 验证不通过，提示用户
          this.$message.error('请填写必填项');
        }
      });
    },
    cancelDialog() {
      // 重置表单的逻辑
      this.dialogCustomer = {};

      this.$emit('update:visible', false);
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