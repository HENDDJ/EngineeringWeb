<template>
    <section id="gis-map">
        <el-select v-model="region" size="large" filterable placeholder="输入工程名以筛选" class="search-input" @change="queryProject">
            <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.name"
                :value="item.name">
            </el-option>
        </el-select>
        <el-button size="large" plain class="search-input reset-button" @click="reset">重置</el-button>
        <div id="allmap"></div>
        <div :class="bottomBarClass" :style="bottomBar">
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3.7">
                    <el-card shadow="never" style="width: 100%;height: 100%">
                        <div slot="header">
                            <span>工程信息</span>
                            <el-button style="float: right; padding: 3px 0" type="text">详情</el-button>
                        </div>
                        <vs-row>
                            <vs-col vs-justify="center" vs-align="center" vs-w="6">
                                <p v-for="(item, index) in formColumns" v-if="item.mapVis && index <= mapVisSize" style="font-size: 12px;line-height: 28px;">{{item.des}}：{{form[item.name] === 0 ? '否' : (form[item.name] === 1 ? '是' : form[item.name])}}</p>
                            </vs-col>
                            <vs-col vs-justify="center" vs-align="center" vs-w="6">
                                <p v-for="(item, index) in formColumns" v-if="item.mapVis && index > mapVisSize" style="font-size: 12px;line-height: 28px;">{{item.des}}：{{form[item.name] === 0 ? '否' : (form[item.name] === 1 ? '是' : form[item.name])}}</p>
                            </vs-col>
                        </vs-row>
                    </el-card>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3">
                    <el-card shadow="never" style="width: 100%;height: 100%">
                        <div slot="header">
                            <span>PM2.5实时监测</span>
                            <el-button style="float: right; padding: 3px 0" type="text">详情</el-button>
                        </div>
                        <div id="pm25"></div>
                    </el-card>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3">
                    <el-card shadow="never" style="width: 100%;height: 100%">
                        <div slot="header" class="clearfix">
                            <span>设备信息</span>
                            <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
                        </div>
                        <div>
                            <vs-table stripe :data="equipmentList">
                                <template slot="thead">
                                    <vs-th>
                                        设备名称
                                    </vs-th>
                                    <vs-th>
                                        注册编号
                                    </vs-th>
                                    <vs-th>
                                        安装日期
                                    </vs-th>
                                    <vs-th>
                                        最新检查结果
                                    </vs-th>
                                </template>

                                <template slot-scope="{data}">
                                    <vs-tr :key="indextr" v-for="(tr, indextr) in equipmentList" >
                                        <vs-td :data="equipmentList[indextr].installAddress">
                                            {{`${tr.installAddress}-${tr.equipmentType}`}}
                                        </vs-td>

                                        <vs-td :data="equipmentList[indextr].registrationCode">
                                            {{tr.registrationCode}}
                                        </vs-td>

                                        <vs-td :data="equipmentList[indextr].installDate">
                                            {{tr.installDate}}
                                        </vs-td>

                                        <vs-td :data="equipmentList[indextr].lastInspection" style="text-align: center">
                                            <template v-if="tr.lastInspection == 'true'">
                                                <p style="color: green;"><vs-icon style="vertical-align: sub" icon="done" size="14px" color="green"></vs-icon> 合格</p>
                                            </template>
                                            <template v-else>
                                                <p style="color: red;"><vs-icon style="vertical-align: sub" icon="clear" size="14px" color="red"></vs-icon> 不合格</p>
                                            </template>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </el-card>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2.3">
                    <el-card shadow="never" style="width: 100%;height: 100%">
                        <div slot="header" class="clearfix">
                            <span>预警信息</span>
                            <el-button style="float: right; padding: 3px 0" type="text">详情</el-button>
                        </div>
                        <div style="font-size: 12px;">
                            <vs-list>
                                <vs-list-item v-for="(item,index) in warningList" icon="warning" color="warning" :title="item.warnDescribe"></vs-list-item>
                            </vs-list>
                        </div>
                    </el-card>
                </vs-col>
            </vs-row>
        </div>
        <vs-sidebar parent="#gis-map" default-index="1" click-not-close
                    hidden-background position-right color="primary" class="sidebarx"
                    spacer v-model="active">
            <vs-collapse type="default" open style="text-align: left;font-size: 14px;padding: 0">
                <vs-collapse-item open>
                    <div slot="header">
                        工程信息
                    </div>

                </vs-collapse-item>
                <vs-collapse-item open>
                    <div slot="header">
                        PM2.5实时监测
                    </div>
                </vs-collapse-item>
                <vs-collapse-item>
                    <div slot="header">
                        工程信息
                    </div>
                    <div>
                        22343
                    </div>
                </vs-collapse-item>
            </vs-collapse>

            <!--<div style="position: relative;left: 65%;margin-top: -20px">-->
                <!--<el-button type="text" @click="toDustView">查看扬尘数据</el-button>-->
                <!--<el-button type="text" @click="toCameraView">查看视频监控</el-button>-->
            <!--</div>-->
        </vs-sidebar>
    </section>
</template>

<script>
    import echarts from 'echarts';
    import axios from 'axios';
    export default {
        name: "GISmap",
        data () {
            return {
                form: {},
                formColumns: [
                    {
                        name: 'name',
                        des: '工程名称',
                        type: 'string',
                        mapVis: true
                    },
                    {
                        name: 'number',
                        des: '工程编号',
                        type: 'string',
                        mapVis: true
                    },
                    {
                        name:'property',
                        des:'建设性质',
                        type: 'string',
                        mapVis: true
                    },
                    {
                        name:'type',
                        des:'工程类别',
                        type: 'string',
                        mapVis: true
                    },
                    {
                        name:' responsibility',
                        des:'负责项目组',
                        type: 'string',
                        mapVis: true
                    },
                    {
                        name:'licenseNumber',
                        des:'立项批准文号',
                        type: 'string',
                        mapVis: true
                    },
                    {
                        name:'license',
                        des:'建设用地许可证',
                        type: 'string',
                        mapVis: true
                    },
                    {
                        name:'isDeepExcavation',
                        des:'是否是深基坑',
                        type:'radio',
                        mapVis: true
                    },
                    {
                        name:'isHazard',
                        des:'存在重大危险源',
                        type:'radio',
                        mapVis: true
                    },
                    {
                        name:'isFormwork',
                        des:'是否为模板工程',
                        type:'radio',
                        mapVis: true
                    },
                    {
                        name:'longitude',
                        des: '经度',
                        type: 'string'
                    },
                    {
                        name:'latitude',
                        des:'纬度',
                        type: 'string'
                    },
                    {
                        name:'department',
                        des:'部门',
                        type: 'string'
                    },

                    {
                        name:'address',
                        des:'地址',
                        type: 'string'
                    },
                    {
                        name:'investment',
                        des:'计划总投资',
                        type: 'string'
                    },
                    {
                        name:'size',
                        des:'工程规模',
                        type: 'string'
                    },
                    {
                        name:'sourcesFunds',
                        des:'资金来源',
                        type: 'string'
                    },
                    {
                        name:'startTime',
                        des:'开始时间',
                        type: 'date'
                    },
                    {
                        name:'endTime',
                        des:'结束时间',
                        type: 'date'
                    }
                ],
                options: [],
                region: '',
                dialogVisible: false,
                markers: [],
                map: {},
                markerClusterer: {},
                optionsCopy: {},
                active: false,
                bottomBarClass: 'bottom-bar',
                equipmentList: [],
                warningList: [],
            }
        },
        computed: {
            mapVisSize() {
                return this.formColumns.filter(item => item.mapVis === true).length / 2;
            },
            bottomBar() {
                let leftSiderBarWidth = 200;
                if (this.$store.state.isCollapse) {
                    leftSiderBarWidth = 64;
                }
                // 20px为纵向滚动条宽度
                return {
                    width: `${document.body.clientWidth - leftSiderBarWidth}px`,
                    textAlign: 'left'
                }
            }
        },
        methods: {
            toDustView() {
                this.$store.commit('getProjectId', this.form.id);
                this.$router.push({path: '/siteSupervision/environmentData'});
            },
            toCameraView() {
                this.$store.commit('getProjectName', this.form.name);
                this.$router.push({path: '/siteSupervision/actualMonitor'});
            },
            reset() {
                this.region = '';
                this.initMap()
            },
            addOverlays(arr) {
                this.markers = [];
                arr.forEach( item => {
                    let marker = new BMap.Marker(new BMap.Point(item.longitude, item.latitude)); // 创建点
                    // let label = new BMap.Label(item.name, {offset:new BMap.Size(10,10)});
                    // marker.setLabel(label);
                    marker.addEventListener("click", () => {
                        this.showProjectInfo(item)
                    });
                    this.markers.push(marker);
                });
                this.markerClusterer = new BMapLib.MarkerClusterer(this.map, { markers: this.markers });
            },
            queryProject(name) {
                if (!this.region) {
                    return;
                }
                let arr = this.optionsCopy.filter(item => item.name == name);
                this.map.clearOverlays();
                this.markerClusterer.clearMarkers(this.markers);
                this.addOverlays(arr);
                if (arr.length <= 0) {
                    return;
                }
                this.map.centerAndZoom(new BMap.Point(arr[0].longitude,arr[0].latitude), 16);
            },
            handleClose(done) {
                this.dialogVisible = false;
                done()
            },
            initMap() {
                // 百度地图API功能
                this.map = new BMap.Map("allmap");    // 创建Map实例
                this.map.centerAndZoom(new BMap.Point(119.175002,31.951788), 12);  // 初始化地图,设置中心点坐标和地图级别
                //添加地图类型控件
                this.map.addControl(new BMap.MapTypeControl({
                    mapTypes:[
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]}));
                this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                this.$http('post','/identity/projectInfo/list', false).then(
                    data => {
                        this.options = data;
                        this.optionsCopy = JSON.parse(JSON.stringify(this.options));
                        this.addOverlays(data);
                    }
                );
                //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
            },
            showProjectInfo(row) {
                this.active = true;
                this.form = row;
                this.initPM25(row.id);
                this.loadEquipment(row.id);
                this.loadWarning(row.id);
                this.bottomBarClass += " bottom-bar-active";
                this.$store.commit("getIsCollapse", true);
                document.getElementsByClassName('main-container')[0].style.width = `${document.body.clientWidth - 66}px`;
            },
            initPM25(projectId) {
                axios.get(`http://122.97.218.162:18008/JRPSuperviseService/ThirdParty.svc/getRaiseDustNow?id=${projectId}`, false).then(
                    res => {
                        let dataX = [];
                        let dataY = [];
                        res.data.data2.forEach( item => {
                            dataY.push(item.value);
                            dataX.push(item.time);
                        });
                        let myChart = echarts.init(document.getElementById('pm25'));
                        let option = {
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['PM2.5']
                            },
                            grid:{
                                x:0,
                                y:30,
                                x2:20,
                                y2:0,
                                containLabel: true
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    boundaryGap: false,
                                    data: dataX,
                                    axisLabel: {
                                        formatter: (value) => {
                                            let time = new Date(value);
                                            return time.getHours() + ':' + time.getMinutes();
                                        }
                                    }
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    name: 'μg/m³'
                                }
                            ],
                            series: [
                                {
                                    name: 'PM2.5值',
                                    type: 'line',
                                    data: dataY,
                                    markPoint: {
                                        data: [
                                            { type: 'max', name: '最大值' },
                                            { type: 'min', name: '最小值' }
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            { type: 'average', name: '平均值' }
                                        ]
                                    }
                                }
                            ]
                        };
                        myChart.setOption(option);
                        myChart.resize();
                    }
                )

            },
            loadEquipment(projectId) {
                let param = {
                    projectId: projectId,
                    type: "SPECIAL_EQUIPMENT"
                };
                this.$http('POST',`/identity/safetyEquipment/page?page=0&size=5`, param, false).then(
                    data => {
                        this.equipmentList = data.content;
                    }
                )
            },
            loadWarning(projectId) {
                let param = {
                    proId: projectId,
                };
                this.$http('POST',`/identity/preWarning/page?page=0&size=5`, param, false).then(
                    data => {
                        this.warningList = data.content;
                    }
                )
            }
        },
        mounted() {
            this.initMap();
        }
    }
</script>

<style>
    #gis-map {
        height: calc(100vh - 50px);
        overflow: hidden;
    }
    #allmap {
        width: 100%;
        height: calc(100vh - 50px);
    }
    .search-input {
        position: absolute !important;
        z-index: 2000;
        top: 80px;
        left: 230px;
    }
    .reset-button {
        left: 460px;
    }
    .sidebarx {
        z-index: 9999;
    }
    .vs-sidebar.vs-sidebar-parent {
        margin-top: 55px;
        height: calc(100% - 310px) !important;
    }
</style>
<style>
    .el-dialog__body {
        padding: 10px 20px !important;
    }
    .vs-sidebar--items {
        padding: 0 !important;
    }
    .vs-sidebar {
        max-width: 300px !important;
        background-color: rgba(255, 255, 255, .8) !important;
    }
    .bottom-bar {
        height: 250px;
    }
    .bottom-bar .vs-col:nth-child(1) {
        transition: all .4s;
    }
    .bottom-bar .vs-col:nth-child(2) {
        transition: all .6s;
    }
    .bottom-bar .vs-col:nth-child(3) {
        transition: all .8s;
    }
    .bottom-bar .vs-col:nth-child(4) {
        transition: all 1s;
    }
    .bottom-bar-active > .vs-row > .vs-col {
        transform: translateY(-250px);
    }
    .el-card {
        box-shadow: none !important;
        border-radius: 0 !important;
        background-color: #ffffffe8;
    }
    .el-card__body {
        padding: 10px 20px !important;
        max-height: 210px;
    }
    #pm25 {
        width: 100%;
        height: 190px;
    }
    @media screen and (max-width: 1400px){
        .bottom-bar {
            transition: all .5s;
            height: 200px;
        }
        .bottom-bar-active {
            transform: translateY(-200px);
            display: block;
        }
        .vs-sidebar.vs-sidebar-parent {
            margin-top: 55px;
            height: calc(100% - 260px) !important;
        }
        .el-card {
            box-shadow: none !important;
            border-radius: 0 !important;
            background-color: #ffffffe8;
            max-height: 200px !important;
        }
        .el-card__body {
            padding: 10px 20px !important;
            max-height: 160px;
        }
        #pm25 {
            width: 100%;
            height: 140px;
        }
    }
    .el-card__header {
        padding: 10px 20px !important;
        font-size: 14px;
    }
    .vs-list--icon {
        color: #ffbd26;
    }

</style>
