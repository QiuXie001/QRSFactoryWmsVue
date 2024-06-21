<template>
    <div>
        <el-table :data="rows" border style="width: 100%">
            <!-- 表格列定义 -->
        </el-table>
        <el-pagination 
        @current-change="handlePageChange" 
        :current-page="currentPage" 
        :page-size="pageSize"
        :total="total" 
        layout="total, prev, pager, next, jumper" 
        style="margin-top: 10px">
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: 'RoleList',
    props: {
        rows: Array,
        currentPage: Number,
        pageSize: Number,
        total: Number
    },
    methods: {
        formatDate(row, column, cellValue) {
            return new Date(cellValue).toLocaleString();
        },
        formatIsDel(row, column, cellValue) {
            return cellValue === 1 ? "是" : "否";
        },
        handleEdit(index, row) {
            // 触发编辑角色事件，传递当前行数据
            this.$emit('editRole', row);
        },
        handleDelete(index, row) {
            // 触发删除角色事件，传递当前行数据
            this.$emit('deleteRole', row);
        },
        handlePageChange(newPage) {
            // 触发分页变化事件，传递新的页码
            this.$emit('pageChange', newPage);
        }
    }
}
</script>