<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogStockIn" :rules="rules" ref="StockInForm">
      <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
        <el-input v-if="field.type === 'input'" v-model="dialogStockIn[field.prop]"></el-input>
        <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows"
          v-model="dialogStockIn[field.prop]">
        </el-input>
        <el-select v-if="field.type === 'select' && field.label === '入库单'" v-model="dialogStockIn[field.prop]"
          placeholder="请选择入库单">
          <el-option v-for="(key, value) in stockInTypeList" :key="value" :label="key" :value="value"></el-option>

        </el-select>
        <el-select v-if="field.type === 'select' && field.label === '供应商'" v-model="dialogStockIn[field.prop]"
          placeholder="请选择供应商">
          <el-option v-for="(key, value) in supplierList" :key="value" :label="key" :value="value"></el-option>
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
    StockIn: {
      type: Object,
      default: () => ({})
    },

    stockInTypeList: {
      type: Object,
      default: () => ({})
    },
    supplierList: {
      type: Object,
      default: () => ({})
    },

  },
  computed: {
  },
  data() {
    return {
      rules: {
        StockInName: [
          { required: true, message: '请输入入库名称', trigger: 'blur' }
        ],
        StockInType: [
          { required: true, message: '请输入入库类型', trigger: 'blur' }
        ],
        // 如果备注是可选的，可以不添加规则
        Remark: [],

      },
      dialogVisible: this.visible,
      dialogTitle: this.title,
      dialogStockIn: Object,
      dialogSupplierList: this.supplierList,
      dialogStockInTypeList: this.stockInTypeList,
      formFields: [

        {
          prop: 'OrderNo',
          label: '订单编号',
          type: 'input',
        },
        {
          prop: 'StockInNo',
          label: '入库单',
          type: 'select',
        },
        {
          prop: 'SupplierId',
          label: '供应商',
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
    StockIn(newValue) {
      this.dialogStockIn = newValue;
    },
    stockInTypeList(newValue) {
      this.dialogStockInTypeList = newValue;
    },
    supplierList(newValue) {
      this.dialogSupplierList = newValue;
    },
  },
  created() {
    this.dialogStockIn = this.StockIn;
    this.dialogStockInTypeList = this.stockInTypeList;
    this.dialogSupplierList = this.supplierList;

  },
  mounted() {
  },
  methods: {


    confirmAction() {
      // 确认添加或编辑入库的逻辑
      this.$refs.StockInForm.validate(valid => {
        if (valid) {
          this.$emit('confirmAction', this.dialogStockIn);
          console.log('数据发出');
          console.log(this.dialogStockIn);
          this.cancelDialog();
        } else {
          // 验证不通过，提示用户
          this.$message.error('请填写必填项');
        }
      });
    },
    cancelDialog() {
      // 重置表单的逻辑
      this.dialogStockIn = {};

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