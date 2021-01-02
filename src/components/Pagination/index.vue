<template>
<div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
            :background="background"
            :current-page.sync="currentPage"
            :page-size.sync="pageSize"
            :layout="layout"
            :page-sizes="pageSizes"
            :total="total"
            v-bind="$attrs"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
    />
</div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
export default {
    name: 'Pagination',
    props: {
        total: {
            required: true,
            type: Number
        },
        page: {
            type: Number,
            default: 1
        },
        pagesize: {
            type: Number,
            default: 30
        },
        pageSizes: {
            type: Array,
            default() {
                return [10, 30, 50, 70, 90,120]
            }
        },
        layout: {
            type: String,
            default: 'total, sizes, prev, pager, next, jumper'
            // default: ' sizes, prev, pager, next'
        },
        background: {
            type: Boolean,
            default: true
        },
        autoScroll: {
            type: Boolean,
            default: true
        },
        hidden: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        currentPage: {
            get() {
                return this.page
            },
            set(val) {
                this.$emit('update:page', val)
            }
        },
        pageSize: {
            get() {
                return this.pagesize
            },
            set(val) {
                this.$emit('update:pagesize', val)
            }
        }
    },
    methods: {
        handleSizeChange(val) {
            this.$emit('pagination', {page: this.currentPage, pagesize: val})
            if (this.autoScroll) {
                scrollTo(0, 600)
            }
        },
        handleCurrentChange(val) {
            this.$emit('pagination', {page: val, pagesize: this.pageSize})
            if (this.autoScroll) {
                scrollTo(0, 600)
            }
        }
    }
}
</script>

<style scoped>
.pagination-container {
    background: #fff;
    padding: 32px 16px;
}

.pagination-container.hidden {
    display: none;
}
</style>
