<template>
  <div>
    <Search @search="handleSearch" @addProductionOrder="showAddProductionOrderDialog" :currentPage="currentPage" @update-page="updatePage" />
    <List :rows="productionOrderList" :currentPage="currentPage" :pageSize="pageSize" :total="total" @editProductionOrder="showEditProductionOrderDialog"
      @deleteProductionOrder="handleDeleteProductionOrder" @pageChange="handlePageChange" />
    <AddEditDialog :visible.sync="addEditDialogVisible" :title="dialogTitle" :productionOrder="selectedProductionOrder"
      :parentProductionOrderList="parentProductionOrderList" :formFields="formFields" @confirmAction="confirmAddEditProductionOrder"
      @cancel="cancelAddEditProductionOrder" />
  </div>
</template>

<script>
import Search from './Search';
import List from './List';
import AddEditDialog from './AddEditDialog';

export default {
  name: 'ProductionOrder',
  components: {
    Search,
    List,
    AddEditDialog
  },

  created() {
    this.init(); // 在组件创建后立即执行init方法
  },
  data() {
    return {
      productionOrderList: [],
      currentPage: 1,
      pageSize: 8,
      total: 0,
      addEditDialogVisible: false,
      dialogTitle: '',
      selectedProductionOrder: {},
      parentProductionOrderList: [],
      formFields: [
        {
          prop: 'ProductionOrderName',
          label: '部门名称',
          type: 'input',
        },{
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
        search: '', // 搜索关键词
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

      this.$axios.post(this.$httpUrl + '/ProductionOrder/List', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.productionOrderList = data.rows;
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
      this.parmas.search = searchData.productionOrderName;
      this.init(); // 重新获取数据
    },
    showAddProductionOrderDialog() {
      // 显示新增部门对话框的逻辑
      this.dialogProductionOrder = { 
        ProductionOrderParent : 1,
       };
      this.dialogTitle = '新增部门';
      this.addEditDialogVisible = true;
    },
    confirmAddEditProductionOrder(productionOrderData) {
      if (this.dialogTitle === '新增部门') {
        const productionOrderDto = {
          ProductionOrderType: productionOrderData.ProductionOrderType,
          ProductionOrderName: productionOrderData.ProductionOrderName,
          Remark: productionOrderData.Remark,
          ProductionOrderParent: productionOrderData.ProductionOrderParent,
          ProductionOrderUrl: productionOrderData.ProductionOrderUrl,
          ProductionOrderIcon: productionOrderData.ProductionOrderIcon,
          ProductionOrderOrder: productionOrderData.ProductionOrderOrder,
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("productionOrder", JSON.stringify(productionOrderDto));
        this.$axios.post(this.$httpUrl + '/ProductionOrder/InsertProductionOrder', UserFormData)
          .then(response => {
            const data = response.data;
            if (data.Item1) {
              this.$message({
                type: 'success',
                message: data.Item2
              });
              console.log()
              this.init(); // 重新获取数据
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
      else if (this.dialogTitle === '编辑部门') {
        //
      }

      this.dialogVisible = false;
      setTimeout(1000);
      this.init(); // 重新获取数据
    },
    showEditProductionOrderDialog(productionOrder) {
      // 显示编辑部门对话框的逻辑
      this.dialogTitle = '编辑部门';
      this.selectedProductionOrder = productionOrder;
      this.addEditDialogVisible = true;
    },
    cancelAddEditProductionOrder() {
      // 取消添加或编辑部门的逻辑
      this.dialogVisible = false;
    },
    handleDeleteProductionOrder(productionOrderData) {
      const productionOrderDto = {
        ProductionOrderId: productionOrderData.ProductionOrderId
      };
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("productionOrder", JSON.stringify(productionOrderDto));
      this.$axios.post(this.$httpUrl + '/ProductionOrder/DeleteProductionOrder', UserFormData)
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
    updatePage(newPage) {
      this.currentPage = newPage;
    },

  }
}
</script>