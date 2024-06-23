<template>
    <div>
        <el-table :data="this.rows" border style="width: 100%">
            <el-table-column prop="Tool" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="UserName" label="用户名"></el-table-column>
            <el-table-column prop="UserNickname" label="昵称"></el-table-column>
            <el-table-column prop="DeptName" label="部门"></el-table-column>
            <el-table-column prop="RoleName" label="角色"></el-table-column>
            <el-table-column prop="Tel" label="手机"></el-table-column>
            <el-table-column prop="Email" label="邮箱"></el-table-column>
            <el-table-column prop="Sex" label="性别">
                <template slot-scope="scope">
                    {{ scope.row.IsDel === 0 ? '男' : '女' }}
                </template>
            </el-table-column>
            <el-table-column prop="IsDel" label="是否禁用">
                <template slot-scope="scope">
                    {{ scope.row.IsDel === 0 ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column prop="Reamrk" label="备注"></el-table-column>
            <el-table-column prop="CreateDate" label="创建日期" :formatter="formatDate"></el-table-column>
            <el-table-column prop="ModifiedDate" label="修改日期" :formatter="formatDate"></el-table-column>
            <!-- 添加更多列，根据需要定义 -->
        </el-table>
        <el-pagination @current-change="handlePageChange" :current-page="currentPage" :page-size="pageSize"
            :total="total" layout="total, prev, pager, next, jumper" style="margin-top: 10px">
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: 'List',
    props: {
        rows: Array,
        currentPage: Number,
        pageSize: Number,
        total: Number,
    },
    data() {
        return {

            localTotal: this.total,
            tableData: [],
        }
    },
    created() {
        this.init(); // 在组件创建后立即执行init方法
    },
    methods: {
        init() {

        },
        formatDate(row, column, cellValue) {
            return new Date(cellValue).toLocaleString();
        },
        formatIsDel(row, column, cellValue) {
            return cellValue === 1 ? "是" : "否";
        },
        handleEdit(index, row) {
            // 触发编辑用户事件，传递当前行数据
            this.$emit('editUser', row);
        },
        handleDelete(index, row) {
            // 触发删除用户事件，传递当前行数据
            this.$emit('deleteUser', row);
        },
        handlePageChange(newPage) {
            // 触发分页变化事件，传递新的页码
            this.$emit('pageChange', newPage);
        }
    }
}
</script>