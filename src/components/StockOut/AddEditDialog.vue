<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogStockOut" :rules="rules" ref="StockOutForm">
      <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
        <el-input v-if="field.type === 'input'" v-model="dialogStockOut[field.prop]"></el-input>
        <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows"
          v-model="dialogStockOut[field.prop]">
        </el-input><el-select v-if="field.type === 'select' && field.label === '出库单'"
          v-model="dialogStockOut[field.prop]" placeholder="请选择出库单">
          <el-option v-for="(key, value) in stockOutTypeList" :key="value" :label="key" :value="value"></el-option>

        </el-select>
        <el-select v-if="field.type === 'select' && field.label === '客户'" v-model="dialogStockOut[field.prop]"
          placeholder="请选择客户">
          <el-option v-for="(key, value) in customerList" :key="value" :label="key" :value="value"></el-option>
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
    stockOut: {
      type: Object,
      default: () => ({})
    },
    stockOutTypeList: {
      type: Object,
      default: () => ({})
    },
    customerList: {
      type: Object,
      default: () => ({})
    },

  },
  computed: {
  },
  data() {
    return {
      rules: {
        StockOutName: [
          { required: true, message: '请输入出库名称', trigger: 'blur' }
        ],
        StockOutType: [
          { required: true, message: '请输入出库类型', trigger: 'blur' }
        ],
        // 如果备注是可选的，可以不添加规则
        Remark: [],

      },
      dialogVisible: this.visible,
      dialogTitle: this.title,
      dialogStockOut: Object,
      dialogStockOutTypeList: this.stockOutTypeList,
      dialogCustomerList: this.customerList,
      formFields: [
        {
          prop: 'StockOutId',
          label: '出库单号',
          type: 'input',
        },
        {
          prop: 'OrderNo',
          label: '订单号',
          type: 'input',
        },
        {
          prop: 'StockOutType',
          label: '出库单',
          type: 'select',
        },
        {
          prop: 'CustomerId',
          label: '客户',
          type: 'select',
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
    stockOut(newValue) {
      this.dialogStockOut = newValue;
    },
    stockOutTypeList(newValue) {
      this.dialogStockOutTypeList = newValue;
    },
    customerList(newValue) {
      this.dialogCustomerList = newValue;
    },

  },
  created() {
    this.dialogStockOut = this.stockOut;
    this.dialogStockOutTypeList = this.stockOutTypeList;
    this.dialogCustomerList = this.customerList;
  },
  mounted() {
  },
  methods: {
    confirmAction() {
      // 确认添加或编辑出库的逻辑
      this.$refs.StockOutForm.validate(valid => {
        if (valid) {
          this.$emit('confirmAction', this.dialogStockOut, this.menuIds);



          this.cancelDialog();
        } else {
          // 验证不通过，提示用户
          this.$message.error('请填写必填项');
        }
      });
    },
    cancelDialog() {
      // 重置表单的逻辑
      this.dialogStockOut = null;

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