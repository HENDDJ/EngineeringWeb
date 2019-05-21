<template>
    <div class="search-container">
        <el-input placeholder="位置、公交站、地铁站" clearable size="mini" v-model="queryValue" @change="search" style="width: 150px;">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <div id="r-result" style="text-align: left;max-height: 50vh;overflow: scroll;background-color: white;overflow-x: hidden"></div>
    </div>
</template>

<script>
    export default {
        name: "MapSearch",
        props: {
            map: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                queryValue: '',
                local: null
            }
        },
        methods: {
            search() {
                if (!this.local) {
                    this.local = new BMap.LocalSearch(this.map, {
                        renderOptions: {map: this.map, panel: "r-result"}
                    });
                }
                if (!this.queryValue) {
                    this.local.clearResults();
                    return;
                }
                this.local.search(this.queryValue)
            }
        },
        mounted() {
            // this.search();
        }
    }
</script>

<style scoped>
    .search-container {
        width: 300px;
        position: absolute;
        z-index: 2500;
        padding: 10px;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>
<style>
    .search-container .el-input--mini .el-input__inner {
        width: 150px !important;
    }
    #r-result {
        max-width: 200px;
        -ms-overflow-style:none;/*ie滚动条隐藏*/
        max-height: 300px !important;
    }
    #r-result > div {
        /*font-family: 'STHeiti Light' !important;*/
        border: none !important;
        box-shadow: 1px 1px 1px #999999;
    }
    #r-result::-webkit-scrollbar {
        width: 0 !important;
    }
    .search-container ol > li > div div:nth-child(2),.search-container ol > li > div div:nth-child(3) {
        display: none;
    }
</style>
