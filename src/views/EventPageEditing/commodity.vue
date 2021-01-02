<template>
    <div>
        <div class="commodityTool" :style="cssBackground()">
            <img ref="img_height" v-if="commodityTool.module_type === 2 || commodityTool.module_type === 8" style="width:100%" :src="cdn06 + commodityTool.head_img" alt="未配置头图">
            <div class="margin_0_auto" v-if="commodityTool.module_type === 17">
                <span>爆品v4</span>
            </div>
            <div :class="commodityTool.template">
                <div class="commodity_box" v-for="(data, index) in commodityTool.goods" v-if="commodityToolArray(index)" :key="index">
                    <img class="commodity_logo" :src="cdn06+data.logo_url" />
                    <div class="commodity_info">
                        <div class="commodity_name">{{data.goods_name}}</div>
                        <div class="commodity_price">
                            <div class="commodity_price_left">
                                <div class="lineation_price">¥{{data.china_goods_price}}</div>
                                <div class="price">
                                    <i class="price_rmb">¥</i>
                                    <span>{{data.china_vip_price}}</span>
                                    <div class="price_text">
                                        <div class="Group"></div>
                                        <em class="price_text">{{commodityTool.price_text}}</em>
                                    </div>
                                </div>
                            </div>
                            <div class="qianggou" v-if="commodityTool.template === 'rows_1'">
                                <span>去抢购</span>
                                <i></i>
                            </div>
                            <div v-if="commodityTool.template === 'rows_2'">
                                <img :src="cdn04 + 'activity/cart.png'" class="cart" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'commodityTool',
    props: {
        commodityTool: {
            type: Object,
            default: function () {
                return {
                    goods: [],
                };
            }
        }
    },
    watch: {
        commodityTool(val) {
            console.log(val);
        }
    },
    created() {
        if (!this.commodityTool.template) {
            this.commodityTool.template = 'rows_1'
        }
    },
    methods: {
        commodityToolArray(ins) {
            return this.commodityTool.template === "rows_1" && ins < 1 || this.commodityTool.template === "rows_2" && ins < 2 || this.commodityTool.template === "rows_3" && ins < 3 || this.commodityTool.template === "rows_4" && ins < 2 || this.commodityTool.template === "rows_5" && ins < 2;
        },
        cssBackground() {
            return ` background-color: ${this.commodityTool.background_color};`;
        }
    }
};
</script>
<style scoped lang="scss">
.margin_0_auto {
    margin: 0 auto;
}
.commodityTool {
    width: 562.5px;
    // width: 375px;
    height: auto;
    // height: 160px;
    padding: 12px;
    box-sizing: border-box;
    background-color: #cdb182;
    .price {
        color: #ff124d;
        display: flex;
        align-items: baseline;
        flex-direction: row;
    }
    .commodity_name {
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;

        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: -o-ellipsis-lastline;
        color: #474245;
    }
    .lineation_price {
        color: #969696;
        font-size: 12px;
        text-decoration: line-through;
    }
    .Group {
        height: 15px;
    }
    .price_text {
        position: relative;
    }
    .price_text em {
        position: absolute;
        background: url("http://cdn04.dfs800.com/images/htj/activity/Group.png")
            no-repeat;
        overflow: hidden;
        background-size: cover;
        top: 0;
        left: 0;
        font-size: 20px;
        line-height: 30px;
        height: 30px;
        margin: 0 0 0 6px;
        padding: 0 8px 0 12px;
        transform: scale(0.5);
        transform-origin: 0% 0%;
        white-space: nowrap;
        font-style: normal;
    }
    .rows_1 {
        background-color: #fff;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 0 4px;
        .commodity_box {
            padding: 15px 13px;
            border-bottom: 1px #eee;
            display: flex;
        }
        .commodity_logo {
            width: 140px;
            height: 140px;
        }
        .commodity_info {
            flex: 1;
            margin-left: 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 10px 0;
        }
        .commodity_name {
            line-height: 20px;
            font-size: 16px;
        }
        .commodity_price {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .qianggou {
            width: 80px;
            height: 30px;
            border-radius: 4px;
            background-color: #fe0f40;
            color: #fff;
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;

            i {
                display: inline-block;
                margin-left: 5px;
                margin-right: -10px;
                width: 0;
                height: 0;
                border: 5px solid;
                border-color: transparent transparent transparent #fff;
            }
        }
        .price {
            font-weight: bold;
            i {
                font-size: 20px;
            }
            span {
                line-height: 18px;
                font-size: 18px;
            }
        }
    }
    .rows_3 {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .commodity_box {
            box-sizing: border-box;
            border-radius: 8px;
            background-color: #fff;
            width: 170px;
            padding: 11px 0;
            margin-bottom: 5px;
        }
        .commodity_box:nth-last-child(2),
        .commodity_box:nth-last-child(1),
        .commodity_box:nth-last-child(3) {
            margin-bottom: 0;
        }
        .commodity_logo {
            width: 90px;
            height: 90px;
            display: block;
            margin: 0 auto;
        }
        .commodity_info {
            padding: 0 9px;
            padding-top: 14px;
        }
        .commodity_name {
            line-height: 17px;
            font-size: 12px;
        }
        .commodity_price {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 6px;
        }
        .price {
            font-weight: bold;
            i {
                font-size: 12px;
            }
            span {
                line-height: 18px;
                font-size: 18px;
            }
        }
    }
    .rows_2,
    .rows_4,
    .rows_5 {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .commodity_box {
            box-sizing: border-box;
            border-radius: 8px;
            background-color: #fff;
            width: 263px;
            padding: 20px 0;
            margin-bottom: 7px;
        }
        .commodity_box:nth-last-child(2),
        .commodity_box:nth-last-child(1) {
            margin-bottom: 0;
        }
        .cart {
            width: 24px;
            height: 24px;
        }
        .commodity_logo {
            width: 135px;
            height: 135px;
            display: block;
            margin: 0 auto;
        }
        .commodity_info {
            padding: 0 11px;
            padding-top: 14px;
        }
        .commodity_name {
            line-height: 19px;
            font-size: 14px;
        }
        .commodity_price {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 6px;
        }
        .price {
            font-weight: bold;
            i {
                font-size: 12px;
            }
            span {
                line-height: 20px;
                font-size: 20px;
            }
        }
    }
}
</style>
