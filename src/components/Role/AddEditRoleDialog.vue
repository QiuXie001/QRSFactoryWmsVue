<template>
  <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
    <el-form :model="role" ref="roleForm">
      <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
        <el-input v-if="field.type === 'input'" v-model="role[field.prop]"></el-input>
        <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows" v-model="role[field.prop]">
        </el-input>
      </el-form-item>
      <el-form-item label="菜单权限" prop="menuIds">
        <div class="rounded-checkbox-group">
          <el-checkbox-group v-model="menuIds">
            <el-checkbox v-for="menu in menuList" :label="menu.MenuId" :key="menu.MenuId"
              @change="toggleChildren(menu), handleParentChange(menu)">
              {{ menu.MenuName }}
              <div class="children" v-if="menu.expanded && menu.Children && menu.Children.length > 0">
                <el-checkbox v-for="child in menu.Children" :label="child.MenuId" :key="child.MenuId">
                  {{ child.MenuName }}
                </el-checkbox>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false, resetForm()">取消</el-button>
      <el-button type="primary" @click="confirmAction">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddEditRoleDialog',
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      role: {
        RoleType: null,
        RoleName: null,
        Remark: null
      },
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
          type: 'textarea', // 假设这是一个文本域
          rows: 3,
        },
      ],
      menuIds: [],
      menuList: []
    }
  },
  methods: {
    toggleChildren(menu) {
      // 展开或收起子菜单的逻辑
      console.log(menu);
    },
    handleParentChange(menu) {
      // 处理父菜单变化的逻辑
      console.log(menu);
    },
    confirmAction() {
      // 确认添加或编辑角色的逻辑
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          // 验证通过，发送请求到后端
          // ...
        } else {
          // 验证不通过，提示用户
        }
      });
    },
    resetForm() {
      // 重置表单的逻辑
      this.$refs.roleForm.resetFields();
      this.dialogVisible = false;
    }
  }
}
</script>