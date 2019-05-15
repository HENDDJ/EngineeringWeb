<template>
    <section class="nav-bar">
        <div class="menu-bar">
            <div class="fl">
                <!-- 面包屑导航 -->
                <span @click="toggleMenu">
                    <icon class="menu-icon" name="list" scale="2.3" style="margin: 17px 8px -5px 2px;vertical-align: top; cursor: pointer"></icon>
                </span>
                <el-breadcrumb separator-class="el-icon-arrow-right"  style="display: inline-block">
                    <el-breadcrumb-item :to="{path: '/MainView'}"> 首页</el-breadcrumb-item>
                    <el-breadcrumb-item v-for="item in breadList" :key="item.path">{{item.meta.title}}
                    </el-breadcrumb-item>
                </el-breadcrumb>
           </div>

            <!-- 右侧菜单项 -->
            <div class="fr menu-right">
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen ? '取消全屏' : '全屏'" placement="bottom">
                        <icon :name="fullscreen ? 'cancel_fullscreen' : 'fullscreen'" scale="2"></icon>
                    </el-tooltip>
                </div>
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                        <img class="person-img fl"  alt="" :src="userInfo.photo">
                        <vs-button type="line" style="padding: 5px 10px">{{user}} ▼</vs-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="myMessage">我的消息</el-dropdown-item>
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>

        </div>
        <!-- 我的消息 -->
        <el-dialog :visible.sync="msgVisible">
            <el-table :data="msgList">
                <el-table-column label="消息" prop="msg"></el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-button type="primary" @click="goMsg(scope.row.url)">确认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </section>
</template>

<script>
export default {
    data () {
        return {
            msgVisible: false,
            user: {},
            fullscreen: false,
            msgList: [{
                url: '/component/test?id=12-123-sda&status=Handle',
                msg: '新增组件测试'
            }, {
                url: '/component/test?id=12-123-sda&status=List',
                msg: '列表组件测试'
            }],
            userInfo: JSON.parse(sessionStorage.getItem('userInfo'))
        };
    },
    computed: {
        breadList () {
            let arr = [];
            // 如果有重定向，则是由于没有子菜单(因此过滤掉)
            let matched = this.$route.matched.filter(route => !route.redirect);
            console.log('123', this.$store.state.menuList, this.$route.matched);
            this.$store.state.menuList.map(item => {
                if (item.name === matched[0].name) {
                    arr.push(item);
                }
                item.children.map(subItem => {
                    if (matched[1] && subItem.name === matched[1].name) {
                        arr.push(subItem);
                    }
                });
            });
            return arr;
        }
    },
    methods: {
        // 改变左侧菜单收缩
        toggleMenu () {
            this.$store.commit('getIsCollapse', !this.$store.state.isCollapse);
            if (this.$store.state.isCollapse) {
                // 折叠
                document.getElementsByClassName('main-container')[0].style.width = `${document.body.clientWidth - 66}px`;
            } else {
                // 不折叠
                document.getElementsByClassName('main-container')[0].style.width = `${document.body.clientWidth - 202}px`;
            }
        },
        // 我的消息
        myMessage () {
            this.msgVisible = true;
        },
        // 跳转到我的消息
        goMsg (url) {
            this.$router.push(url);
            this.msgVisible = false;
        },
        // 退出登录
        logOut () {
            sessionStorage.removeItem('menu');
            sessionStorage.removeItem('token');
            location.reload();
        },
        //全屏
        handleFullScreen(){
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    },
    mounted () {
       // console.log(sessionStorage.getItem('userInfo'));
        this.user=JSON.parse(sessionStorage.getItem('userInfo')).name;
       // this.user = sessionStorage.getItem('user');
    }
};
</script>

<style lang="scss" scoped>
.nav-bar {
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.15);
}

.menu-bar {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 12px;
    .fl {
        vertical-align: center;
    }
    .fa {
        color: #363c42;
        cursor: pointer;
        transition: all 0.4s;
    }
    .fa-arrows-alt {
        line-height: 50px;
        font-size: 20px;
    }
    .menu-right {
        height: 50px;
        margin-right: 20px;
    }
    .person-img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin: 10px 10px;
        border: 1px solid rgba(153, 159, 255, 0.36);
    }
}
</style>
<style>
    .el-breadcrumb {
        line-height: 4;
    }
    .el-dropdown-menu {
        z-index: 99999 !important;
    }
    .menu-icon:hover {
        transform: scale(1.2);
        transition: all .5s;

    }
    .btn-fullscreen{
        width: 26px;
        display: inline-block;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        vertical-align: top;
    }
    .btn-fullscreen:hover{
        transform: scale(1.2);
        transition: all .5s;
    }
</style>
