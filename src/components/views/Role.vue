<template>
    <div>
      <div>
        <el-row>
          <el-col :span="12">
            <el-form :model="searchForm" ref="searchForm">
  
              <el-col :span="6">
                <el-form-item prop="roleName">
                  <el-input v-model="searchForm.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="2">
                <el-form-item prop="dateRange">
                  <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
          <el-col :span="2" :offset="0">
            <el-button type="primary" @click="handleSearch()">搜索</el-button>
          </el-col>
          <el-col :span="6" :offset="4">
            <el-button type="primary" @click="handleAdd()">新增角色</el-button>
          </el-col>
        </el-row>
        <!-- 对话框 -->
        <el-dialog :visible.sync="insertDialogVisible" title="新增角色">
          <el-form :model="newRole" ref="newRoleForm">
            <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
              <el-input v-if="field.type === 'input'" v-model="newRole[field.prop]"></el-input>
              <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows"
                v-model="newRole[field.prop]"></el-input>
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
            <el-button @click="insertDialogVisible = false, init()">取消</el-button>
            <el-button type="primary" @click="confirmAdd">确定</el-button>
          </span>
        </el-dialog>
        <el-dialog :visible.sync="editDialogVisible" title="修改角色">
          <el-form :model="newRole" ref="newRoleForm">
            <el-form-item v-for="field in formFields" :key="field.prop" :label="field.label" :prop="field.prop">
              <el-input v-if="field.type === 'input'" v-model="newRole[field.prop]"></el-input>
              <el-input v-if="field.type === 'textarea'" type="textarea" :rows="field.rows"
                v-model="newRole[field.prop]"></el-input>
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
            <el-button @click="editDialogVisible = false, init()">取消</el-button>
            <el-button type="primary" @click="confirmAdd">确定</el-button>
          </span>
        </el-dialog>
  
      </div>
      <el-table :data="rows" border style="width: 100% ;margin-top: 10px">
        <el-table-column prop="Tool" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="RoleType" label="角色类型"></el-table-column>
        <el-table-column prop="RoleName" label="角色名称"></el-table-column>
        <el-table-column prop="CreateDate" label="创建日期" :formatter="formatDate"></el-table-column>
        <el-table-column prop="ModifiedDate" label="修改日期" :formatter="formatDate"></el-table-column>
        <el-table-column prop="IsDel" label="是否启用" :formatter="formatIsDel"></el-table-column>
      </el-table>
      <el-pagination @current-change="handlePageChange" :current-page="currentPage" :page-size="pageSize" :total="total"
        layout="total, prev, pager, next, jumper" style="margin-top: 10px">
      </el-pagination>
    </div>
  
  </template>
  
  <script>
  export default {
    name: 'Role',
    data() {
      return {
        currentPage: 1, // 当前页码
        pageSize: 8, // 每页显示的行数
        total: 0, // 总行数
        insertDialogVisible: false,
        editDialogVisible: false,
        parmas: {
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
        newRole: {
          RoleType: null,
          RoleName: null,
          Remark: null
        },
        menuIds: [],
        menuList: [],
        searchForm: {
          search: '' ,
          dateRange: ''
        }
      }
    },
    computed: {
      rows() {
        return this.$store.state.things.rows;
      }
    },
    methods: {
      init() {
        this.menuIds = [];
        const UserFormData = new FormData();
        UserFormData.append("bootstrap", JSON.stringify(this.parmas));
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        this.$axios.post(this.$httpUrl + '/Role/GetPageList', UserFormData)
          .then(response => {
            const data = response.data;
            if (data) {
              this.total = data.total;
              this.$store.commit('setThings', data);
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
      extractIdsFromMenu(menuData) {
        let ids = [];
        menuData.forEach(item => {
          ids.push(item.Id); // 添加当前菜单项的Id
          if (item.Children && item.Children.length > 0) {
            // 如果有子菜单，递归调用
            ids = ids.concat(this.extractIdsFromMenu(item.Children));
          }
        });
        return ids;
      },
      handlePageChange(newPage) {
        this.currentPage = newPage;
        this.init(); // 重新获取数据
      },
      initFormFields() {
        this.formFields = Object.keys(this.$store.state.dto).map(key => {
          return {
            prop: key,
            label: key,
            type: 'input',
          };
        });
      },
      toggleChildren(menu) {
        menu.expanded = !menu.expanded;
      },
      handleParentChange(menu) {
        if (this.menuIds.includes(menu.MenuId)) {
          menu.Children.forEach(child => {
            if (!this.menuIds.includes(child.MenuId)) {
              this.menuIds.push(child.MenuId);
            }
          });
        } else {
          // 如果父菜单被取消选中，关闭子菜单并取消选中子菜单
          menu.expanded = false;
          menu.Children.forEach(child => {
            const index = this.menuIds.indexOf(child.MenuId);
            if (index !== -1) {
              this.menuIds.splice(index, 1);
            }
          });
        }
      },
      formatIsDel(row, column, cellValue) {
        return cellValue === 1 ? "是" : "否";
      },
      formatDate(row, column, cellValue) {
        return new Date(cellValue).toLocaleString();
      },
      handleEdit(index, row) {
        this.$store.commit('SetDto', { ...row });
        this.menuIds = []; // 清除之前的选中状态
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        this.$axios.post(this.$httpUrl + '/Menu/GetMenus', UserFormData)
          .then(response => {
            const data = response.data;
            if (data) {
              this.menuList = data.rows;
              this.menuList.forEach(menu => {
                if (this.menuIds.includes(menu.MenuId)) {
                  // 如果menuId存在于menuIds中，设置expanded为true以展开子菜单
                  menu.expanded = true;
                } else {
                  // 否则，设置expanded为false
                  menu.expanded = false;
                }
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
        UserFormData.append("roleId", row.RoleId);
        this.$axios.post(this.$httpUrl + '/Role/GetMenuByRoleId', UserFormData)
          .then(response => {
            const data = response.data;
            if (data) {
              this.menuIds = this.extractIdsFromMenu(data);
              this.menuList.forEach(menu => {
                if (this.menuIds.includes(menu.MenuId.toString())) {
                  console.log('成功选中' + menu.MenuId);
                  menu.expanded = true;
                }
                else {
                  console.log('未选中' + menu.MenuId);
                }
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
        this.editDialogVisible = true; // 显示对话框
      },
      confirmEdit() {
        // 验证表单
        this.$refs.newRoleForm.validate(async valid => {
          if (valid) {
            // 构建请求参数
            const roleDto = {
              RoleType: this.$store.state.dto.RoleType,
              RoleName: this.$store.state.dto.RoleName,
              Remark: this.$store.state.dto.Remark
            };
            const UserFormData = new FormData();
            UserFormData.append("token", this.$store.state.token);
            UserFormData.append("userId", this.$store.state.user.UserId);
            UserFormData.append("role", JSON.stringify(roleDto));
            UserFormData.append("menuId", this.menuIds.join(','));
  
            // 调用更新角色的接口
            try {
              const response = await this.$axios.post(this.$httpUrl + '/Role/UpdateRole', UserFormData);
              const data = response.data;
              if (data.Item1) {
                this.$message.success(data.Item2);
                this.editDialogVisible = false;
                this.init(); // 重新加载角色列表
              } else {
                this.$message.error(data.Item2);
              }
            } catch (error) {
              this.$message.error(error);
            }
          } else {
            this.$message.error('请填写必要的表单字段');
          }
        });
      },
      handleDelete(index, row) {
        // 实现删除逻辑
        console.log('删除', index, row);
      },
      handleAdd() {
        
        const UserFormData = new FormData();
        UserFormData.append("token", this.$store.state.token);
        UserFormData.append("userId", this.$store.state.user.UserId);
        this.$axios.post(this.$httpUrl + '/Menu/GetMenus', UserFormData)
          .then(response => {
            const data = response.data;
            if (data) {
              this.menuList = data.rows;
              this.insertDialogVisible = true;
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
      confirmAdd() {
        this.$refs.newRoleForm.validate(valid => {
          if (valid) {
            this.$store.commit('SetDto', createEmptySysRole(this.$store.state.things)); 
            const roleDto = {
              RoleType: this.$store.state.dto.RoleType,
              RoleName: this.$store.state.dto.RoleName,
              Remark: this.$store.state.dto.Remark
            };
            const UserFormData = new FormData();
            UserFormData.append("token", this.$store.state.token);
            UserFormData.append("userId", this.$store.state.user.UserId);
            UserFormData.append("role", JSON.stringify(roleDto));
            UserFormData.append("menuId", this.menuIds);
            console.log(roleDto);
            this.$axios.post(this.$httpUrl + '/Role/InsertRole', UserFormData)
              .then(response => {
                const data = response.data;
                if (data.Item1) {
                  this.$message({
                    type: 'success',
                    message: data.Item2
                  });
                  this.insertDialogVisible = false;
                  this.$refs.newRoleForm.resetFields();
                  this.init();
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
          } else {
            this.$message.error('请填写必要的表单字段');
            return false;
          }
        });
      },
      handleSearch() {
        // 检查角色名称搜索框的值
        if (this.searchForm.roleName) {
          this.parmas.search = this.searchForm.roleName;
        } else {
          this.parmas.search = null; // 如果没有值，则清除搜索关键词
        }
  
        // 检查日期范围搜索框的值
        if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
          const [start, end] = this.searchForm.dateRange;
          this.parmas.datemin = start;
          this.parmas.datemax = end;
        } else {
          this.parmas.datemax = null; // 如果没有值，则清除日期范围搜索的最大日期
        }
  
        // 重新获取数据
        this.init();
      }
    },
    created() {
      this.init();
    }
  };
  function createEmptySysRole(things) {
    const emptyRole = things.rows[0];
    for (const key in things.rows[0]) {
      emptyRole[key] = null;
    }
    return emptyRole;
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