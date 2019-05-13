<template>
        <el-menu background-color="#363C42" text-color="#fff" collapse-transition
                 active-text-color="yellow" router  :default-active="$store.state.routerIndex" unique-opened  class="el-menu-personal" :collapse="$store.state.isCollapse">
            <div v-for="item in routes" :key="item.name" class="menu-container">
                <!-- 有子菜单 -->
                <el-submenu :index="item.path" v-if="item.children&&item.children.length" :key="item.id">
                    <template slot="title">
                        <icon :name="item.meta.icon" scale="2"></icon>
                        <span slot="title" style="margin-right: 20px;">{{item.meta && item.meta.title}}</span>
                    </template>
                    <el-menu-item :index="item.path+'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                        <icon :name="subItem.meta.icon" scale="1.6"></icon>
                        <span slot="title" style="margin-right: 20px;">{{subItem.meta && subItem.meta.title}}</span>
                    </el-menu-item>
                </el-submenu>
                <!-- 没有子菜单 -->
                <el-menu-item :index="item.path" v-else>
                    <icon :name="item.meta.icon" scale="2"></icon>
                    <span slot="title" style="margin-right: 20px;">{{item.meta && item.meta.title}}</span>
                </el-menu-item>
            </div>
        </el-menu>
</template>
<script>
    export default {
        name: 'sidebar',
        data() {
            return {
            }
        },
        computed: {
            routes() {
                return this.$store.state.menuList;
            }
        },
        watch: {
            '$route.name' : function () {
                let matched = this.$route.matched;
                this.$store.commit("getClassInfo", matched[matched.length-1].meta.classInfo);
            }
        },
        methods: {
        }
    }
</script>
<style>
    .scrollbar_view {
        height: 100%;
    }
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .el-menu-personal {
        height: 100%;
        text-align: left;
        transition: all .5s;
        background: url("/static/img/menu-background-img.png");
        background-size: cover;
    }
    svg {
        margin: 0 16px 0 5px;
    }
    .el-submenu__title {
        /*transition: width .5s;*/
    }
    .menu-container {
        transition: width .5s;
    }
    ul ul {
        background: transparent !important;
    }
    ul li {
        background: transparent !important;
    }
    .el-submenu__title {
        background: transparent !important;
    }
    .el-submenu__icon-arrow {
        color: #fff !important;
    }
    .el-menu--vertical ul {
        background: url("/static/img/menu-background-img.png") !important;
        background-size: cover !important;
    }
    .el-menu--vertical ul li {
        background: transparent !important;
    }

</style>

