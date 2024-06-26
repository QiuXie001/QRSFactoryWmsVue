<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogStorageRack" :rules="rules" ref="StorageRackForm">
      <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
        <el-input v-if="field.type === 'input'" v-model="dialogStorageRack[field.prop]"></el-input>
        <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows" v-model="dialogStorageRack[field.prop]">
        </el-input>
        <el-select v-if="field.type === 'select' && field.label === '所属仓库'" v-model="dialogStorageRack[field.prop]"
          placeholder="请选择仓库" @change="handleSelectChange('reservoirArea')"> 
          <el-option v-for="(key, value) in dialogWarehouseList" :key="value" :label="key" :value="value"></el-option>
        </el-select>
        <el-select v-if="field.type === 'select' && field.label === '所属库区'" v-model="dialogStorageRack[field.prop]"
          placeholder="请选择库区">
          <el-option v-for="(key, value) in dialogReservoirAreaList" :key="value" :label="key" :value="value"></el-option>
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
    storageRack: {
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

  },
  computed: {
  },
  data() {
    return {
      rules: {
        StorageRackName: [
          { required: true, message: '请输入货架名称', trigger: 'blur' }
        ],
        // 如果备注是可选的，可以不添加规则
        Remark: [],

      },
      dialogVisible: this.visible,
      dialogTitle: this.title,
      dialogStorageRack: Object,
      dialogReservoirAreaList: this.reservoirAreaList,
      dialogWarehouseList: this.warehouseList,
      formFields: [
        {
          prop: 'StorageRackNo',
          label: '货架编号',
          type: 'input',
        },
        {
          prop: 'StorageRackName',
          label: '货架名称',
          type: 'input',
        },
        {
          prop: 'WarehouseId',
          label: '所属仓库',
          type: 'select',
        },
        {
          prop: 'ReservoirAreaId',
          label: '所属库区',
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
    storageRack(newValue) {
      this.dialogStorageRack = newValue;
    },
    warehouseList(newValue) {
      this.dialogWarehouseList = newValue;
    },
    reservoirAreaList(newValue) {
      this.dialogReservoirAreaList = newValue;
    },

  },
  created() {
    this.dialogStorageRack = this.storageRack;
    this.dialogWarehouseList = this.warehouseList;
    this.dialogReservoirAreaList = this.reservoirAreaList;

  },
  mounted() {
  },
  methods: {
    handleSelectChange(selectedSelect) {
      const SelectFormData = new FormData();
      SelectFormData.append("token", this.$store.state.token);
      SelectFormData.append("userId", this.$store.state.user.UserId);
      if (selectedSelect === "reservoirArea") {
        SelectFormData.append("Id", this.dialogStorageRack.WarehouseId);
        this.$axios.post(this.$httpUrl + '/StorageRack/GetReservoirarea', SelectFormData)
          .then(response => {
            const data = response.data;
            if (data) {
              this.dialogReservoirAreaList = data; // 假设data.rows是你的物料列表

              // 其他需要更新的数据...
            } else {
              this.$message({
                type: 'error',
                message: data.Item2
              });
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: error
            });
          });
      }
    },
    confirmAction() {
      // 确认添加或编辑货架的逻辑
      this.$refs.StorageRackForm.validate(valid => {
        if (valid) {
          this.$emit('confirmAction', this.dialogStorageRack, this.menuIds);
          console.log('数据发出');
          console.log(this.dialogStorageRack);
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
      this.dialogStorageRack = {};

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