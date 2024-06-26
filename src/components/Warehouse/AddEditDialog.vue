<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogWarehouse" :rules="rules" ref="WarehouseForm">
      <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
        <el-input v-if="field.type === 'input'" v-model="dialogWarehouse[field.prop]"></el-input>
        <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows"
          v-model="dialogWarehouse[field.prop]">
        </el-input>
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
    Warehouse: {
      type: Object,
      default: () => ({})
    },
  },
  computed: {
  },
  data() {
    return {
      rules: {
        WarehouseName: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' }
        ],
        WarehouseType: [
          { required: true, message: '请输入仓库类型', trigger: 'blur' }
        ],
        // 如果备注是可选的，可以不添加规则
        Remark: [],

      },
      dialogVisible: this.visible,
      dialogTitle: this.title,
      dialogWarehouse: Object,
      formFields: [
        {
          prop: 'WarehouseNo',
          label: '仓库编号',
          type: 'input',
        },
        {
          prop: 'WarehouseName',
          label: '仓库名称',
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
    Warehouse(newValue) {
      this.dialogWarehouse = newValue;
    },
    created() {
      this.dialogWarehouse = this.Warehouse;
    },
    mounted() {
    },
  },
  methods: {
    confirmAction() {
      // 确认添加或编辑仓库的逻辑
      this.$refs.WarehouseForm.validate(valid => {
        if (valid) {
          this.$emit('confirmAction', this.dialogWarehouse, this.menuIds);
          this.cancelDialog();
        } else {
          // 验证不通过，提示用户
          this.$message.error('请填写必填项');
        }
      });
    },
    cancelDialog() {
      // 重置表单的逻辑
      this.dialogWarehouse = {};

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