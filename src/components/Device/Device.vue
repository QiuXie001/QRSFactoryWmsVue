<template>
  <div>
    <Search @search="handleSearch" @addDevice="showAddDeviceDialog" :currentPage="currentPage" @update-page="updatePage" />
    <List :rows="deviceList" :currentPage="currentPage" :pageSize="pageSize" :total="total" @editDevice="showEditDeviceDialog"
      @deleteDevice="handleDeleteDevice" @pageChange="handlePageChange" />
    <AddEditDialog :visible.sync="addEditDialogVisible" :title="dialogTitle" :device="selectedDevice"
      :parentDeviceList="parentDeviceList" :formFields="formFields" @confirmAction="confirmAddEditDevice"
      @cancel="cancelAddEditDevice" />
  </div>
</template>

<script>
import Search from './Search';
import List from './List';
import AddEditDialog from './AddEditDialog';

export default {
  name: 'Device',
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
      deviceList: [],
      currentPage: 1,
      pageSize: 8,
      total: 0,
      addEditDialogVisible: false,
      dialogTitle: '',
      selectedDevice: {},
      parentDeviceList: [],
      formFields: [
        {
          prop: 'DeviceName',
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

      this.$axios.post(this.$httpUrl + '/Device/GetPageList', UserFormData)
        .then(response => {
          const data = response.data;
          if (data) {
            this.deviceList = data.rows;
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
      this.parmas.search = searchData.deviceName;
      this.init(); // 重新获取数据
    },
    showAddDeviceDialog() {
      // 显示新增部门对话框的逻辑
      this.dialogDevice = { 
        DeviceParent : 1,
       };
      this.dialogTitle = '新增部门';
      this.addEditDialogVisible = true;
    },
    confirmAddEditDevice(deviceData) {
      if (this.dialogTitle === '新增部门') {
        const deviceDto = {
          DeviceType: deviceData.DeviceType,
          DeviceName: deviceData.DeviceName,
          Remark: deviceData.Remark,
          DeviceParent: deviceData.DeviceParent,
          DeviceUrl: deviceData.DeviceUrl,
          DeviceIcon: deviceData.DeviceIcon,
          DeviceOrder: deviceData.DeviceOrder,
        };
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        UserFormData.append("device", JSON.stringify(deviceDto));
        this.$axios.post(this.$httpUrl + '/Device/InsertDevice', UserFormData)
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
    showEditDeviceDialog(device) {
      // 显示编辑部门对话框的逻辑
      this.dialogTitle = '编辑部门';
      this.selectedDevice = device;
      this.addEditDialogVisible = true;
    },
    cancelAddEditDevice() {
      // 取消添加或编辑部门的逻辑
      this.dialogVisible = false;
    },
    handleDeleteDevice(deviceData) {
      const deviceDto = {
        DeviceId: deviceData.DeviceId
      };
      const UserFormData = new FormData();
      UserFormData.append("token", this.$store.state.token);
      UserFormData.append("userId", this.$store.state.user.UserId);
      UserFormData.append("device", JSON.stringify(deviceDto));
      this.$axios.post(this.$httpUrl + '/Device/DeleteDevice', UserFormData)
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