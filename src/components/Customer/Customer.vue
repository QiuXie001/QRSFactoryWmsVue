<template>
  <div>
    <Search @search="handleSearch" @addCustomer="showAddCustomerDialog" />
    <CustomerList :rows="CustomerList" :currentPage="currentPage" :pageSize="pageSize" :total="total"
      @editCustomer="showEditCustomerDialog" @deleteCustomer="handleDeleteCustomer" @pageChange="handlePageChange" />
    <AddEditDialog :visible.sync="addEditDialogVisible" :title="dialogTitle" :Customer="selectedCustomer"
      :formFields="formFields" @confirmAction="confirmAddEditCustomer"
      @cancel="cancelAddEditCustomer" />
  </div>
</template>

<script>
import Search from './Search';
import CustomerList from './List';
import AddEditDialog from './AddEditDialog';

export default {
  name: 'Customer',
  components: {
    Search,
    CustomerList,
    AddEditDialog
  },

  created() {
    this.init(); // 在组件创建后立即执行init方法
  },
  data() {
    return {
      CustomerList: [],
      currentPage: 1,
      pageSize: 8,
      total: 0,
      addEditDialogVisible: false,
      dialogTitle: '',
      selectedCustomer: {},
      formFields: [
      {
          prop: 'CustomerNo',
          label: '客户编号',
          type: 'input',
        },
        {
          prop: 'CustomerName',
          label: '客户名称',
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
          prop: 'CustomerPerson',
          label: '联系人',
          type: 'input',
        },
        {
          prop: 'Email',
          label: '邮箱',
          type: 'input',
        },
        {
          prop: 'CustomerLevel',
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
    init() {
      const UserFormData = new FormData();
      this.parmas.offset = (this.currentPage - 1) * this.pageSize;
      UserFormData.append("bootstrap", JSON.stringify(this.parmas));
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);

      this.$axios.post(this.$httpUrl + '/Customer/List', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.CustomerList = data.rows; // 假设data.rows是你的客户列表
            this.total = data.total; // 更新总记录数
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
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.init(); // 重新获取数据
    },
    handleSearch(searchData) {
      console.log(searchData);
      if (!searchData.dateRange || searchData.dateRange.length !== 2) {
        //
      }
      else {
        const startDate = new Date(searchData.dateRange[0]);
        const endDate = new Date(searchData.dateRange[1]);

        if (isNaN(startDate) || isNaN(endDate)) {
          console.error('提供的日期格式不正确');
          return;
        }
        // 验证日期顺序
        if (startDate > endDate) {
          console.error('开始日期不能晚于结束日期');
          return;
        }
        this.parmas.datemin = startDate.toISOString().split('T')[0]; // 格式化为 YYYY-MM-DD
        this.parmas.datemax = endDate.toISOString().split('T')[0]; // 格式化为 YYYY-MM-DD

      }
      this.parmas.search = searchData.CustomerName;
      this.init();
    },
    showAddCustomerDialog() {
      // 显示新增客户对话框的逻辑
      this.dialogTitle = '新增客户';
      this.selectedCustomer = {};
      this.addEditDialogVisible = true;
    },
    confirmAddEditCustomer(CustomerData, menuIds) {
      if (this.dialogTitle === '新增客户') {
        const CustomerDto = {
         CustomerPerson: CustomerData.CustomerPerson,
          CustomerName: CustomerData.CustomerName,
          CustomerLevel: CustomerData.CustomerLevel,
          CustomerId: CustomerData.CustomerId,
          Remark: CustomerData.Remark,
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("Customer", JSON.stringify(CustomerDto));
        UserFormData.append("menuId", menuIds);
        this.$axios.post(this.$httpUrl + '/Customer/InsertCustomer', UserFormData)
          .then(response => {
            const data = response.data;
            if (data.Item1) {
              this.$message({
                type: 'success',
                message: data.Item2
              });
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
      else if (this.dialogTitle === '编辑客户') {
        const CustomerDto = {
          CustomerPerson: CustomerData.CustomerPerson,
          CustomerName: CustomerData.CustomerName,
          CustomerLevel: CustomerData.CustomerLevel,
          CustomerId: CustomerData.CustomerId,
          Remark: CustomerData.Remark,
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("Customer", JSON.stringify(CustomerDto));
        UserFormData.append("menuId", menuIds);
        this.$axios.post(this.$httpUrl + '/Customer/UpdateCustomer', UserFormData)
          .then(response => {
            const data = response.data;
            if (data.Item1) {
              this.$message({
                type: 'success',
                message: data.Item2
              });
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
      // 确认添加或编辑客户的逻辑
      this.dialogVisible = false;
      setTimeout(1000);
      this.init(); // 重新获取数据
    },
    showEditCustomerDialog(Customer) {
      // 显示编辑客户对话框的逻辑
      this.dialogTitle = '编辑客户';
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("CustomerId", Customer.CustomerId);
      this.$axios.post(this.$httpUrl + '/Customer/GetMenuByCustomerId', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.menuIds = this.extractIdsFromMenu(data);
            this.addEditDialogVisible = true;
            this.selectedCustomer = Customer;

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
    },
    cancelAddEditCustomer() {
      // 取消添加或编辑客户的逻辑
      this.dialogVisible = false;
    },
    handleDeleteCustomer(CustomerData) {
      const CustomerDto = {
        CustomerId: CustomerData.CustomerId
      };
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("Customer", JSON.stringify(CustomerDto));
      this.$axios.post(this.$httpUrl + '/Customer/DeleteCustomer', UserFormData)
        .then(response => {
          const data = response.data;
          if (data.Item1) {
            this.init();
            this.$message({
              type: 'success',
              message: data.Item2
            });
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
    },
  }
}
</script>