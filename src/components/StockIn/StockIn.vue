<template>
  <div>
    <Search @search="handleSearch" @addStockIn="showAddStockInDialog" />
    <StockInList :rows="StockInList" :currentPage="currentPage" :pageSize="pageSize" :total="total"
      @detailStockIn="showDetailStockInDialog" @editStockIn="showEditStockInDialog" @deleteStockIn="handleDeleteStockIn"
      @pageChange="handlePageChange" />
    <AddEditDialog :visible.sync="addEditDialogVisible" :title="dialogTitle" :StockIn="selectedStockIn"
      :formFields="formFields" :supplierList="supplierList" :stockInTypeList="stockInTypeList"
      @confirmAction="confirmAddEditStockIn" @cancel="cancelAddEditStockIn" />
    <Detail :visible.sync="detailVisible" :addVisible.sync="addDetailVisible" :StockIn="selectedStockIn"
      :StockInDetail="selectedStockInDetail" @cancel="cancelDetailStockIn" style="width: 120%" />
    <DetailAddDialog :visible.sync="addDetailVisible" :StockIn="selectedStockIn" :MaterialList="materialList"
      @confirmAction="confirmAddStockInDetail" />
  </div>
</template>

<script>
import Search from './Search';
import StockInList from './List';
import AddEditDialog from './AddEditDialog';
import Detail from './Detail';
import DetailAddDialog from './DetailAddDialog';

export default {
  name: 'StockIn',
  components: {
    Search,
    StockInList,
    AddEditDialog,
    Detail,
    DetailAddDialog
  },

  created() {
    this.init(); // 在组件创建后立即执行init方法
  },
  data() {
    return {
      StockInList: [],
      currentPage: 1,
      pageSize: 8,
      total: 0,
      addEditDialogVisible: false,
      addDetailVisible: false,
      dialogTitle: '',
      selectedStockIn: {},
      selectedStockInDetail: [],
      detailVisible: false,
      stockInTypeList: {
        "1": "采购入库单",
        "2": "退货入库单",
        "3": "试用入库",
      },
      supplierList: {},
      materialList: {},
      formFields: [

        {
          prop: 'OrderNo',
          label: '订单编号',
          type: 'input',
        },
        {
          prop: 'StockInNo',
          label: '入库单号',
          type: 'input',
        },
        {
          prop: 'StockInTypeId',
          label: '入库单类型',
          type: 'select',
        },
        {
          prop: 'SupplierId',
          label: '供应商',
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
        StockInType: null,
        StockInStatus: null
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

      this.$axios.post(this.$httpUrl + '/StockIn/List', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.StockInList = data.rows; // 假设data.rows是你的入库列表
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

      const MaterialListFormData = new FormData();
      MaterialListFormData.append("token", this.$store.state.token);
      MaterialListFormData.append("userId", this.$store.state.user.UserId);

      this.$axios.post(this.$httpUrl + '/Material/GetMaterialList', MaterialListFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.materialList = data;
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

      const stockInTypeFormData = new FormData();
      stockInTypeFormData.append("token", this.$store.state.token);
      stockInTypeFormData.append("userId", this.$store.state.user.UserId);
      stockInTypeFormData.append("type", "3");
      this.$axios.post(this.$httpUrl + '/Dict/GetDictListByType', stockInTypeFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.stockInTypeList = data;
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

      const supplierFormData = new FormData();
      supplierFormData.append("token", this.$store.state.token);
      supplierFormData.append("userId", this.$store.state.user.UserId);
      this.$axios.post(this.$httpUrl + '/Supplier/GetSupplierList', supplierFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.supplierList = data;
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

      if (this.selectedStockIn) {
        const DetailFormData = new FormData();
        DetailFormData.append("token", this.$store.state.token);
        DetailFormData.append("userId", this.$store.state.user.UserId);
        DetailFormData.append("pid", this.selectedStockIn.StockInId);
        this.$axios.post(this.$httpUrl + '/StockIn/ListDetail', DetailFormData)
          .then(response => {
            const data = response.data;
            if (data) {
              this.selectedStockInDetail = data.rows;
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
      this.parmas.search = searchData.StockInName;
      this.init();
    },
    showAddStockInDialog() {
      // 显示新增入库对话框的逻辑
      this.dialogTitle = '新增入库';
      this.selectedStockIn = {};
      this.addEditDialogVisible = true;
    },
    confirmAddEditStockIn(StockInData) {
      if (this.dialogTitle === '新增入库') {
        const StockInDto = {
          StockInNo: StockInData.StockInNo,
          OrderNo: StockInData.OrderNo,
          StockInTypeId: StockInData.StockInTypeId,
          SupplierId: StockInData.SupplierId,
          Remark: StockInData.Remark
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("model", JSON.stringify(StockInDto));

        this.$axios.post(this.$httpUrl + '/StockIn/AddOrUpdate', UserFormData)
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
      else if (this.dialogTitle === '编辑入库') {
        const StockInDto = {
          StockInId: StockInData.StockInId,
          StockInNo: StockInData.StockInNo,
          OrderNo: StockInData.OrderNo,
          StockInTypeId: StockInData.StockInTypeId,
          SupplierId: StockInData.SupplierId,
          Remark: StockInData.Remark
        };

        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("model", JSON.stringify(StockInDto));
        UserFormData.append("id", StockInData.StockInId);

        this.$axios.post(this.$httpUrl + '/StockIn/AddOrUpdate', UserFormData)
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
      // 确认添加或编辑入库的逻辑
      this.dialogVisible = false;
      setTimeout(1000);
      this.init(); // 重新获取数据
    },
    confirmAddStockInDetail(StockInDetail) {
      const StockInDetailDto = {
        StockInId: StockInDetail.StockInId,
        MaterialId: StockInDetail.MaterialId,
        ActInQty: StockInDetail.ActInQty,
        PlanInQty: StockInDetail.PlanInQty,
        Remark: StockInDetail.Remark,
      };

      const StockInDetailFormData = new FormData();
      StockInDetailFormData.append("token", this.$store.state.token);
      StockInDetailFormData.append("userId", this.$store.state.user.UserId);
      StockInDetailFormData.append("model", JSON.stringify(StockInDetailDto));

      this.$axios.post(this.$httpUrl + '/StockIn/AddOrUpdateDetail', StockInDetailFormData)
        .then(response => {
          const data = response.data;
          if (data.Item1) {
            this.$message({
              type: 'success',
              message: data.Item2
            });
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

    },
    showEditStockInDialog(StockIn) {
      // 显示编辑入库对话框的逻辑
      this.dialogTitle = '编辑入库';
      this.addEditDialogVisible = true;
      this.selectedStockIn = StockIn;
    },
    showDetailStockInDialog(stockIn) {
      this.selectedStockIn = stockIn;
      this.detailVisible = true;

      const DetailFormData = new FormData();
      DetailFormData.append("token", this.$store.state.token);
      DetailFormData.append("userId", this.$store.state.user.UserId);
      DetailFormData.append("pid", stockIn.StockInId);
      this.$axios.post(this.$httpUrl + '/StockIn/ListDetail', DetailFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.selectedStockInDetail = data.rows;
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
    cancelAddEditStockIn() {
      // 取消添加或编辑入库的逻辑
      this.dialogVisible = false;
    },
    cancelDetailStockIn() {
      // 取消添加或编辑入库的逻辑
      this.detailVisible = false;
    },
    handleDeleteStockIn(StockInData) {
      const StockInDto = {
        StockInId: StockInData.StockInId
      };
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("StockIn", JSON.stringify(StockInDto));
      this.$axios.post(this.$httpUrl + '/StockIn/DeleteStockIn', UserFormData)
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