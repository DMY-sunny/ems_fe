<template>
    <div>
        <div class="carouselMap">
            <div v-for="(data,index) in imgData" :key="index">
                <img :src="data.imgurl" alt="">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'carousel_map',
    props: {
        carouselMap: []
    },
    methods: {
        
    }
};
</script>
<style scoped lang="scss">
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
        display: block;
    }
    .price_text {
        position: relative;
    }
    .price_text em {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 20px;
        line-height: 30px;
        height: 30px;
        padding-left: 12px;
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
    .rows_2 {
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
