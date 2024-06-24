<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogReservoirArea" :rules="rules" ref="ReservoirAreaForm">
      <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
        <el-input v-if="field.type === 'input'" v-model="dialogReservoirArea[field.prop]"></el-input>
        <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows" v-model="dialogReservoirArea[field.prop]">  </el-input>
        <el-select v-if="field.type === 'select'" v-model="dialogReservoirArea[field.prop]" placeholder="请选择仓库">
          <el-option v-for="(key,value) in warehouseList" :key="value" :label="key"
          :value="value"></el-option>
              
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
    ReservoirArea: {
      type: Object,
      default: () => ({})
    },
    warehouseList: {
      type: Object,
      default: () => ({})
    },

  },
  computed: {
  },
  data() {
    return {
      rules: {
        ReservoirAreaName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        ReservoirAreaType: [
          { required: true, message: '请输入角色类型', trigger: 'blur' }
        ],
        // 如果备注是可选的，可以不添加规则
        Remark: [],

      },
      dialogVisible: this.visible,
      dialogTitle: this.title,
      dialogReservoirArea: Object,
      dialogWarehouseList: this.warehouseList,
      formFields: [
        {
          prop: 'ReservoirAreaNo',
          label: '库区编号',
          type: 'input',
        },
        {
          prop: 'ReservoirAreaName',
          label: '库区名称',
          type: 'input',
        },

        {
          prop: 'WarehouseId',
          label: '所属仓库',
          type: 'select',
        },        {
          prop: 'Remark',
          label: '备注',
          type: 'textarea', // 假设这是一个文本域
          rows: 3,
        },
      ],
      dialogMenuIds: this.menuIds,
    }
  },
  watch: {
    visible(newValue) {
      this.dialogVisible = newValue;
    },
    title(newValue) {
      this.dialogTitle = newValue;
    },
    ReservoirArea(newValue) {
      this.dialogReservoirArea = newValue;
    },
    warehouseList(newValue) {
      this.dialogWarehouseList = newValue;
    },
    
  },
  created() {
    this.dialogReservoirArea = this.ReservoirArea;
    this.dialogWarehouseList = this.warehouseList;
 

  },
  mounted() {
  },
  methods: {
   
    confirmAction() {
      // 确认添加或编辑角色的逻辑
      this.$refs.ReservoirAreaForm.validate(valid => {
        if (valid) {
          this.$emit('confirmAction', this.dialogReservoirArea, this.menuIds);
          console.log('数据发出');
          console.log(this.dialogReservoirArea);
          console.log(this.menuIds);
          this.cancelDialog();
        } else {
          // 验证不通过，提示用户
          this.$message.error('请填写必填项');
        }
      });
    },
    cancelDialog() {
      // 重置表单的逻辑
      this.dialogReservoirArea = {};
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