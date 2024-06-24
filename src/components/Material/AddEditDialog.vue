<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogMaterial" :rules="rules" ref="MaterialForm">
      <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
        <el-input v-if="field.type === 'input'" v-model="dialogMaterial[field.prop]"></el-input>
        <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows" v-model="dialogMaterial[field.prop]">
        </el-input>
        <el-select v-if="field.type === 'select'&& field.label==='所属仓库'" v-model="dialogMaterial[field.prop]" placeholder="请选择仓库">
          <el-option v-for="(key,value) in warehouseList" :key="value" :label="key"
          :value="value"></el-option>
              
            </el-select>
            <el-select v-if="field.type === 'select'&& field.label==='所属库区'" v-model="dialogMaterial[field.prop]" placeholder="请选择库区">
          <el-option v-for="(key,value) in reservoirAreaList" :key="value" :label="key"
          :value="value"></el-option>
              
            </el-select>
            <el-select v-if="field.type === 'select'&& field.label==='所属货架'" v-model="dialogMaterial[field.prop]" placeholder="请选择货架">
          <el-option v-for="(key,value) in storagerackList" :key="value" :label="key"
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
import { Object } from 'core-js';

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
    Material: {
      type: Object,
      default: () => ({})
    },
    warehouseList: {
      type: Object,
      default: () => ({})
    },
    reservoirAreaList: {
      type: Object,
      default: () => ({})
    }, 
    storagerackList: {
      type: Object,
      default: () => ({})
    },
  
  },
  computed: {
  },
  data() {
    return {
      rules: {
        MaterialName: [
          { required: true, message: '请输入物料名称', trigger: 'blur' }
        ],
        MaterialType: [
          { required: true, message: '请输入物料类型', trigger: 'blur' }
        ],
        // 如果备注是可选的，可以不添加规则
        Remark: [],

      },
      dialogVisible: this.visible,
      dialogTitle: this.title,
      dialogMaterial: Object,
      dialogWarehouseList:Object,
      dialogReservoirAreaList:Object,
      dialogStoragerackList:Object,
      formFields: [
      {
          prop: 'MaterialNo',
          label: '物料编号',
          type: 'input',
        },
        {
          prop: 'MaterialName',
          label: '物料名称',
          type: 'input',
        },
        {
          prop: 'MaterialType',
          label: '物料类型',
          type: 'input',
        }, {
          prop: 'UnitType',
          label: '单位',
          type: 'input',
        }, {
          prop: 'WarehouseId',
          label: '所属仓库',
          type: 'select',
        }, {
          prop: 'ReservoirAreaId',
          label: '所属库区',
          type: 'select',
        }, {
          prop: 'StoragerackId',
          label: '所属货架',
          type: 'select',
        },{
          prop: 'ExpiryDate',
          label: '有效期',
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
    Material(newValue) {
      this.dialogMaterial = newValue;
    },
    warehouseList(newValue) {
      this.dialogWarehouseList = newValue;
    },
    reservoirAreaList(newValue) {
      this.dialogReservoirAreaList = newValue;
    },
    storagerackList(newValue) {
      this.dialogStoragerackList = newValue;
    },
   
   
  },
  created() {
    this.dialogMaterial = this.Material;
    this.dialogWarehouseList =this.warehouseList;
    this.dialogReservoirAreaList = this.reservoirAreaList;
    this.dialogStoragerackList = this.storagerackList;

  },
  mounted() {
  },
  methods: {
    confirmAction() {
      // 确认添加或编辑物料的逻辑
      this.$refs.MaterialForm.validate(valid => {
        if (valid) {
          this.$emit('confirmAction', this.dialogMaterial);
          console.log('数据发出');
          console.log(this.dialogMaterial);
          this.cancelDialog();
        } else {
          // 验证不通过，提示用户
          this.$message.error('请填写必填项');
        }
      });
    },
    cancelDialog() {
      // 重置表单的逻辑
      this.dialogMaterial = null;
     

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