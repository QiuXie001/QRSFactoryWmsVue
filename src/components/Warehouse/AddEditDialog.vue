<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogWarehouse" :rules="rules" ref="WarehouseForm">
      <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
        <el-input v-if="field.type === 'input'" v-model="Warehouse[field.prop]"></el-input>
        <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows" v-model="Warehouse[field.prop]">
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
    menuList: {
      type: Array,
      default: () => []
    },
    menuIds: {
      type: Array,
      default: () => []
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
      dialogMenuList: this.menuList,
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
    Warehouse(newValue) {
      this.dialogWarehouse = newValue;
    },
    menuList(newValue) {
      this.dialogMenuList = newValue;
    },
    menuIds(newValue) {
      this.dialogMenuIds = newValue;
      this.dialogMenuList.forEach(menu => {
        if (this.dialogMenuIds.includes(menu.MenuId)) {
          menu.expanded = true;
        } else {
          menu.expanded = false;
        }
      });
    },
  },
  created() {
    this.dialogWarehouse = this.Warehouse;
    this.dialogMenuList = this.menuList;
    this.dialogMenuIds = this.menuIds;

  },
  mounted() {
  },
  methods: {
    toggleChildren(menu) {
      menu.expanded = !menu.expanded;
    },
    handleParentChange(menu) {
      if (this.menuIds.includes(menu.MenuId)) {
        menu.Children.forEach(child => {
          if (!this.menuIds.includes(child.MenuId)) {
            this.dialogMenuIds.push(child.MenuId);
          }
        });
      } else {
        // 如果父菜单被取消选中，关闭子菜单并取消选中子菜单
        menu.expanded = false;
        menu.Children.forEach(child => {
          const index = this.menuIds.indexOf(child.MenuId);
          if (index !== -1) {
            this.dialogMenuIds.splice(index, 1);
          }
        });
      }
    },
    confirmAction() {
      // 确认添加或编辑仓库的逻辑
      this.$refs.WarehouseForm.validate(valid => {
        if (valid) {
          this.$emit('confirmAction', this.dialogWarehouse, this.menuIds);
          console.log('数据发出');
          console.log(this.dialogWarehouse);
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
      this.dialogWarehouse = null;
      this.dialogMenuIds = [];
      this.menuList.forEach(menu => {
        menu.expanded = false;
      });

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