<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogCarrier" :rules="rules" ref="CarrierForm">
      <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
        <el-input v-if="field.type === 'input'" v-model="dialogCarrier[field.prop]"></el-input>
        <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows" v-model="dialogCarrier[field.prop]">
        </el-input>
        <el-select v-if="field.type === 'select'" v-model="dialogCarrier[field.prop]"
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
    Carrier: {
      type: Object,
      default: () => ({})
    },
  },
  computed: {
  },
  data() {
    return {
      rules: {
        CarrierName: [
          { required: true, message: '请输入承运商名称', trigger: 'blur' }
        ],
        CarrierNo: [
          { required: true, message: '请输入承运商编号', trigger: 'blur' }
        ],
        // 如果备注是可选的，可以不添加规则
        Remark: [],

      },
      dialogVisible: this.visible,
      dialogTitle: this.title,
      dialogCarrier: Object,
      formFields: [
      {
          prop: 'CarrierNo',
          label: '承运商编号',
          type: 'input',
        },
        {
          prop: 'CarrierName',
          label: '承运商名称',
          type: 'input',
        },  {
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
          prop: 'CarrierPerson',
          label: '联系人',
          type: 'input',
        },
        {
          prop: 'Email',
          label: '邮箱',
          type: 'input',
        },
        {
          prop: 'CarrierLevel',
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
        { label: '普通合作', value: '0' },
        { label: '重点合作', value: '1' },
        { label: '自营', value: '2' },
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
    Carrier(newValue) {
      this.dialogCarrier = newValue;
    },
  },
  created() {
    this.dialogCarrier = this.Carrier;

  },
  mounted() {
  },
  methods: {
    confirmAction() {
      // 确认添加或编辑承运商的逻辑
      this.$refs.CarrierForm.validate(valid => {
        if (valid) {
          this.$emit('confirmAction', this.dialogCarrier);
          this.cancelDialog();
        } else {
          // 验证不通过，提示用户
          this.$message.error('请填写必填项');
        }
      });
    },
    cancelDialog() {
      // 重置表单的逻辑
      this.dialogCarrier = {};

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