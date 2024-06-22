<template>
    <div>
      <Search @search="handleSearch" @addRole="showAddRoleDialog" />
      <RoleList :rows="roleList" :currentPage="currentPage" :pageSize="pageSize" :total="total"
        @editRole="showEditRoleDialog" @deleteRole="handleDeleteRole" @pageChange="handlePageChange" />
      <AddEditRoleDialog :visible.sync="addEditDialogVisible" :title="dialogTitle" :role="selectedRole"
        :formFields="formFields" :menuList="menuList" :menuIds="menuIds" @confirmAction="confirmAddEditRole"
        @cancel="cancelAddEditRole" />
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
  
    created() {
      this.init(); // 在组件创建后立即执行init方法
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
        menuIds: [],
        menuList: [],
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
        parmas: {
          offset: (this.currentPage - 1) * this.pageSize, // 或者 (页码 - 1) * 每页显示的行数
          limit: 8, // 每页显示的行数
          sort: 'CreateDate', // 排序字段
          order: 'desc', // 排序方式
          search: null, // 搜索关键词
          _: Date.now(), // 时间戳或随机数
          datemin: '2023-01-01', // 日期范围搜索的最小日期
          datemax: null, // 日期范围搜索的最大日期
          keyword: null // 额外的搜索关键词
        },
      }
    },
    methods: {
      
    }
  }
  </script>