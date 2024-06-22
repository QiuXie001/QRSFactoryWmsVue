<template>
    <div>
        <el-table :data="this.rows" border style="width: 100%">
            <el-table-column prop="Tool" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="MenuName" label="菜单名称"></el-table-column>
            <el-table-column prop="MenuUrl" label="菜单路径"></el-table-column>
            <el-table-column prop="MenuIcon" label="图标" width="300"></el-table-column>
            <el-table-column prop="MenuType" label="菜单类型"></el-table-column>
            <el-table-column prop="CreateDate" label="创建日期" :formatter="formatDate"></el-table-column>
            <el-table-column prop="ModifiedDate" label="修改日期" :formatter="formatDate"></el-table-column>
            <el-table-column prop="Status" label="是否禁用">
                <template slot-scope="scope">
                    {{ scope.row.IsDel === 0 ? '是' : '否' }}
                </template>
            </el-table-column>
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
        this.init(); 
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
            this.$emit('editMenu', row);
        },
        handleDelete(index, row) {
            this.$emit('deleteMenu', row);
        },
        handlePageChange(newPage) {
            this.$emit('pageChange', newPage);
        }
    }
}
</script>