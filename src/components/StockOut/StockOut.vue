<template>
  <div>
    <Search @search="handleSearch" @addStockout="showAddStockoutDialog" />
    <StockoutList :rows="stockOutList" :currentPage="currentPage" :pageSize="pageSize" :total="total"
      @editStockout="showEditStockoutDialog" @deleteStockout="handleDeleteStockout" @pageChange="handlePageChange" />
    <AddEditDialog :visible.sync="addEditDialogVisible" :title="dialogTitle" :stockOut="selectedStockout"
      :formFields="formFields" :stockOutTypeList="stockOutTypeList" :customerList="customerList" @confirmAction="confirmAddEditStockout"
      @cancel="cancelAddEditStockout" />
  </div>
</template>

<script>
import Search from './Search';
import StockoutList from './List';
import AddEditDialog from './AddEditDialog';

export default {
  name: 'Stockout',
  components: {
    Search,
    StockoutList,
    AddEditDialog
  },

  created() {
    this.init(); // 在组件创建后立即执行init方法
  },
  data() {
    return {
      stockOutList: [],
      currentPage: 1,
      pageSize: 8,
      total: 0,
      addEditDialogVisible: false,
      dialogTitle: '',
      selectedStockout: {},
      stockOutTypeList: {
        "1":"成品出庫單",
      },
      customerList:{},
      formFields: [
        {
          prop: 'StockOutId',
          label: '出库单号',
          type: 'input',
        },
        {
          prop: 'OrderNo',
          label: '订单号',
          type: 'input',
        },
        {
          prop: 'StockOutNo',
          label: '出库单',
          type: 'select',
        },
        {
          prop: 'CustomerId',
          label: '客户',
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
        keyword: null, // 额外的搜索关键词
        StockOutType : null,
        StockOutStatus:null
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

      this.$axios.post(this.$httpUrl + '/StockOut/List', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.stockOutList = data.rows; // 假设data.rows是你的出库列表
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
        
      const CustomerFormData = new FormData();
      CustomerFormData.append("token", this.$store.state.token);
      CustomerFormData.append("userId", this.$store.state.user.UserId);

      this.$axios.post(this.$httpUrl + '/Customer/GetCustomerList', CustomerFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.customerList = data; // 假设data.rows是你的出库列表
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
      this.parmas.search = searchData.StockoutName;
      this.init();
    },
    showAddStockoutDialog() {
      // 显示新增出库对话框的逻辑
      this.dialogTitle = '新增出库';
      this.selectedStockout = {};
      this.addEditDialogVisible = true;
    },
    confirmAddEditStockout(StockoutData) {
      if (this.dialogTitle === '新增出库') {
        const StockoutDto = {
          StockoutType: StockoutData.StockoutType,
          StockoutName: StockoutData.StockoutName,
          Remark: StockoutData.Remark,
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("Stockout", JSON.stringify(StockoutDto));
        this.$axios.post(this.$httpUrl + '/StockOut/InsertStockout', UserFormData)
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
      else if (this.dialogTitle === '编辑出库') {
        const StockoutDto = {
          StockoutId: StockoutData.StockoutId,
          StockoutType: StockoutData.StockoutType,
          StockoutName: StockoutData.StockoutName,
          Remark: StockoutData.Remark
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("Stockout", JSON.stringify(StockoutDto));
        this.$axios.post(this.$httpUrl + '/StockOut/UpdateStockout', UserFormData)
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
      // 确认添加或编辑出库的逻辑
      this.dialogVisible = false;
      setTimeout(1000);
      this.init(); // 重新获取数据
    },
    showEditStockoutDialog(StockOut) {
      // 显示编辑出库对话框的逻辑
      this.dialogTitle = '编辑出库';
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("StockoutId", StockOut.StockoutId);
      this.$axios.post(this.$httpUrl + '/StockOut/GetMenuByStockoutId', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.menuIds = this.extractIdsFromMenu(data);
            this.addEditDialogVisible = true;
            this.selectedStockout = StockOut;

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
   
    cancelAddEditStockout() {
      // 取消添加或编辑出库的逻辑
      this.dialogVisible = false;
    },
    handleDeleteStockout(StockoutData) {
      const StockoutDto = {
        StockoutId: StockoutData.StockoutId
      };
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("Stockout", JSON.stringify(StockoutDto));
      this.$axios.post(this.$httpUrl + '/StockOut/DeleteStockout', UserFormData)
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