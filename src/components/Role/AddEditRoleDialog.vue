<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :show-close="false">
    <el-form :model="dialogRole" :rules="rules" ref="roleForm">
      <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
        <el-input v-if="field.type === 'input'" v-model="role[field.prop]"></el-input>
        <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows" v-model="role[field.prop]">
        </el-input>
      </el-form-item>
      <el-form-item label="菜单权限" prop="dialogMenuIds">
        <div class="rounded-checkbox-group">
          <el-checkbox-group v-model="dialogMenuIds">
            <el-checkbox v-for="menu in menuList" :label="menu.MenuId" :key="menu.MenuId"
              @change="toggleChildren(menu), handleParentChange(menu)">
              {{ menu.MenuName }}
              <div class="children" v-if="menu.expanded && menu.Children && menu.Children.length > 0">
                <el-checkbox v-for="child in menu.Children" :label="child.MenuId" :key="child.MenuId" @change ="handleChildChange">
                  {{ child.MenuName }}
                </el-checkbox>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
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
  name: 'AddEditRoleDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    role: {
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
        RoleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        RoleType: [
          { required: true, message: '请输入角色类型', trigger: 'blur' }
        ],
        // 如果备注是可选的，可以不添加规则
        Remark: [],

      },
      dialogVisible: this.visible,
      dialogTitle: this.title,
      dialogRole: Object,
      dialogMenuList: this.menuList,
      formFields: [
        {
          prop: 'RoleName',
          label: '角色名称',
          type: 'input',
        },
        {
          prop: 'RoleType',
          label: '角色类型',
          type: 'input',
        },
        {
          prop: 'Remark',
          label: '备注',
          type: 'textarea',
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
    role(newValue) {
      this.dialogRole = newValue;
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
    this.dialogRole = this.role;
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
      console.log('点击父菜单');
      if (this.dialogMenuIds.includes(menu.MenuId)) {
        menu.Children.forEach(child => {
          if (!this.dialogMenuIds.includes(child.MenuId)) {
            this.dialogMenuIds.push(child.MenuId);
          }
        });
      } else {
        // 如果父菜单被取消选中，关闭子菜单并取消选中子菜单
        menu.expanded = false;
        menu.Children.forEach(child => {
          const index = this.dialogMenuIds.indexOf(child.MenuId);
          if (index !== -1) {
            this.dialogMenuIds.splice(index, 1);
          }
        });
      }
      this.$emit('update:menuIds', this.dialogMenuIds);
    },
    handleChildChange(checked, menuId) {
      console.log('点击子菜单');
      if (checked) {
        if (!this.dialogMenuIds.includes(menuId)) {
          this.dialogMenuIds.push(menuId);
        }
      } else {
        const index = this.dialogMenuIds.indexOf(menuId);
        if (index !== -1) {
          this.dialogMenuIds.splice(index, 1);
        }
      }
      // 更新menuIds prop
      this.$emit('update:menuIds', this.dialogMenuIds);
    },

    confirmAction() {
      // 确认添加或编辑角色的逻辑
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          this.$emit('confirmAction', this.dialogRole, this.dialogMenuIds);
          console.log('数据发出');
          console.log(this.dialogRole);
          console.log(this.dialogMenuIds);
          this.cancelDialog();
        } else {
          // 验证不通过，提示用户
          this.$message.error('请填写必填项');
        }
      });
    },
    cancelDialog() {
      // 重置表单的逻辑
      this.dialogRole = null;
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