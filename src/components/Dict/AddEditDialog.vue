<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogDict" :rules="rules" ref="DictForm">
      <el-row v-for="field in formFields" :key="field.prop" type="flex" align="middle">
        <el-col :span="4">{{ field.label }}</el-col>
        <el-col :span="16" :offset="2">
          <el-form-item :prop="field.prop">
            <el-input v-if="field.type === 'input'" v-model="dialogDict[field.prop]">
              <template v-if="field.prefix && title !== '编辑菜单'" slot="prefix">{{ field.prefix }}</template>
            </el-input>
            <el-select v-if="field.type === 'select'" v-model="dialogDict[field.prop]" placeholder="请选择字典">
          <el-option v-for="(key,value) in dictTypeList" :key="value" :label="key"
          :value="value"></el-option>
              
            </el-select>
            <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows"
              v-model="dialogDict[field.prop]"></el-input>
            <el-input-number v-if="field.type === 'number'" v-model="dialogDict[field.prop]" :min="1"
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
    dict: {
      type: Object,
      default: () => ({})
    },
    dictTypeList: {
      type: Object,
      default: () => []
    },
  },
  computed: {
  },
  data() {
    return {
      rules: {
        DictName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        DictType: [
          { required: true, message: '请输入菜单类型', trigger: 'blur' }
        ],
        // 如果备注是可选的，可以不添加规则
        Remark: [],

      },
      dialogVisible: this.visible,
      dialogTitle: this.title,
      dialogDict: Object,
      dialogDictTypeList: this.DictList,
      formFields: [
      {
          prop: 'DictType',
          label: '字典类型',
          type: 'select',
        },
        {
          prop: 'DictName',
          label: '字典名称',
          type: 'input',
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
    dict(newValue) {
      this.dialogDict = newValue;
    },
    dictTypeList(newValue) {
      this.dialogDictList = newValue;
    },

  },
  created() {
    this.dialogDict = this.dict;
    this.dialogDictTypeList = this.dictTypeList;
  },
  components: {
  },
  mounted() {
  },
  methods: {
   
    confirmAction() {
      // 确认添加或编辑角色的逻辑
      this.$refs.DictForm.validate(valid => {
        if (valid) {
         

          this.$emit('confirmAction', this.dialogDict);

          this.cancelDialog();
        } else {
          // 验证不通过，提示用户
          this.$message.error('请填写必填项');
        }
      });
    },
    cancelDialog() {
      this.$emit('update:visible', false);
      this.$refs.DictForm.resetFields(); // 重置表单
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