<template>
  <div>
    <Search 
    @search="handleSearch" 
    @addRole="showAddRoleDialog" 
    />
    <RoleList 
    :rows="roleList" 
    :currentPage="currentPage" 
    :pageSize="pageSize" 
    :total="total"
      @editRole="showEditRoleDialog" 
      @deleteRole="handleDeleteRole" 
      @pageChange="handlePageChange" 
      />
    <AddEditRoleDialog 
    :visible.sync="addEditDialogVisible" 
    :title="dialogTitle" 
    :role="selectedRole"
    :formFields="formFields" 
    :menuList="menuList" 
      @confirmAction="confirmAddEditRole" 
      @cancel="cancelAddEditRole" 
    />
  </div>
</template>

<script>
import Search from './Search';
import RoleList from './RoleList';
import AddEditRoleDialog from './AddEditRoleDialog';

export default {
  name: 'RoleManagement',
  components: {
    Search,
    RoleList,
    AddEditRoleDialog
  },
  data() {
    return {
      roleList: [],
      currentPage: 1,
      pageSize: 8,
      total: 0,
      addEditDialogVisible: false,
      dialogTitle: '',
      selectedRole: {},
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
      menuList: []
    }
  },
  methods: {
    handleSearch(searchData) {
      console.log(searchData);
    },
    showAddRoleDialog() {
      // 显示新增角色对话框的逻辑
      this.dialogTitle = '新增角色';
      this.dialogVisible = true;
    },
    confirmAddEditRole(roleData) {
      // 确认添加或编辑角色的逻辑
      // 发送请求到后端
      console.log(roleData);
    },
    showEditRoleDialog(role) {
      // 显示编辑角色对话框的逻辑
      this.dialogTitle = '编辑角色';
      this.dialogVisible = true;
      this.selectedRole = role;
    },
    cancelAddEditRole() {
      // 取消添加或编辑角色的逻辑
      this.dialogVisible = false;
    },
    handleDeleteRole(roleId){

      console.log(roleId);
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.init(); // 重新获取数据
    }
  }
}
</script>