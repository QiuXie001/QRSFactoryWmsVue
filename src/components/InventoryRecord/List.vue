<template>
    <div>
        <el-table :data="this.rows" border style="width: 100%">
            <el-table-column prop="StockInNo" label="入库单号"></el-table-column>
            <el-table-column prop="MaterialNo" label="物料编号"></el-table-column>
            <el-table-column prop="MaterialName" label="物料名称"></el-table-column>\
            <el-table-column prop="Qty" label="入库数量"></el-table-column>
            <el-table-column prop="StorageRackNo" label="货架编号"></el-table-column>
            <el-table-column prop="StorageRackName" label="货架名称"></el-table-column>
            <el-table-column prop="Remark" label="备注"></el-table-column>
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
        handlePageChange(newPage) {
            // 触发分页变化事件，传递新的页码
            this.$emit('pageChange', newPage);
        }
    }
}
</script>