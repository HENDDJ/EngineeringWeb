<template>
    <section id="gis-map">
        <el-select v-model="region" size="large" filterable placeholder="输入工程名以筛选" class="search-input" @change="queryProject">
            <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.name"
                :value="JSON.stringify(item)">
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
                            <el-button @click="toDustView" style="float: right; padding: 3px 0" type="text">详情</el-button>
                        </div>
                        <div id="pm25" v-show="hasData"></div>
                        <div id="noData" v-if="!hasData">
                            <p style="margin: 50px 0;text-align: center">暂无数据</p>
                        </div>
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
            <div slot="header">
                实时监控
            </div>
            <div class="ActiveX" style="padding: 15px 0">
                <object classid="clsid:9ECD2A40-1222-432E-A4D4-154C7CAB9DE3" id="spv" class="video-realtime"></object>
            </div>
            <ul class="leftx">
                <p style="color: #3A3A3A;font-weight: 700">监控列表:</p>
                <li v-for="(item, index) in cameraList" :key="item.id">
                    <el-radio v-model="currentCamera" :label="item.cameraName" fill="#79FF40" text-color="#79FF40">{{item.cameraName}}</el-radio>
                </li>
            </ul>

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
    import md5 from '@/utils/md5';
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
                cameraList: [],
                spv: {}, //海康监控视频播放插件对象
                currentCamera: '',
                hasData: false, //PM2.5是否有数据
            }
        },
        watch: {
            currentCamera: {
                handler: function (n,o) {
                    if (n!==o) {
                        let temp = this.cameraList.filter(item => item.cameraName === n)[0];
                        this.startPreviewByCameraUuid(temp.cameraUuid)
                    }
                }
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
                name = JSON.parse(name);
                let arr = this.optionsCopy.filter(item => item.name == name.name);
                this.map.clearOverlays();
                this.markerClusterer.clearMarkers(this.markers);
                this.addOverlays(arr);
                if (arr.length <= 0) {
                    return;
                }
                this.map.centerAndZoom(new BMap.Point(arr[0].longitude,arr[0].latitude), 16);
                this.showProjectInfo(name)
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
                this.hasData = false;
                this.active = true;
                this.form = row;
                this.initPM25(row.id);
                this.loadEquipment(row.id);
                this.loadWarning(row.id);
                this.loadCamera(row.id);
                this.bottomBarClass += " bottom-bar-active";
                this.$store.commit("getIsCollapse", true);
                document.getElementsByClassName('main-container')[0].style.width = `${document.body.clientWidth - 66}px`;
            },
            initPM25(projectId) {
                axios.get(`http://122.97.218.162:18008/JRPSuperviseService/ThirdParty.svc/getRaiseDustNow?id=${projectId}`, false).then(
                    res => {
                        let dataX = [];
                        let dataY = [];
                        if (res.data.data1) {
                            this.hasData = true;
                            res.data.data2.forEach( item => {
                                dataY.push(item.value);
                                dataX.push(item.time);
                            });
                        }
                        this.$nextTick(() => {
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
                                    y:40,
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
                        })
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
            },
            /**  视频处理部分
             */
            loadCamera(projectId) {
                let param = {
                    pId: projectId
                };
                this.$http("POST", `/identity/camera/list`, param, false).then(
                    data => {
                        this.cameraList = data;
                        this.startPreviewByCameraUuid(this.cameraList[0].cameraUuid);
                        this.currentCamera = this.cameraList[0].cameraName;
                    }
                )
            },
            startPreviewByCameraUuid(cameraUuid) {
                let time = new Date().getTime();
                const IP_PORT = "http://122.97.218.162:18080";
                const APP_KEY = "a592d676";
                const opUserUuid = 'c26a811c141a11e79aeeb32ef95273f2';
                // const netZoneUuid = 'f5816cf43fcc41d880d9f636fa8bc443';
                const netZoneUuid = '5b994421aced4e2d9a76179e8cc70734';
                this.$http('POST', IP_PORT + "/openapi/service/vss/preview/getPreviewParamByCameraUuid?token=" + this.getSinglePreviewToken(time, cameraUuid),
                    {appkey: APP_KEY, time: time, pageNo: 1, pageSize: 10, opUserUuid: opUserUuid, cameraUuid: cameraUuid, netZoneUuid: netZoneUuid}).then(
                    data => {
                        this.startPreview(data.data);
                    })
            },
            initSpvx(spv) {
                let ret = spv.MPV_Init(1);
                if (ret !== 0) {
                    alert("单路预览初始化失败");
                }
            },
            setLocalParam(spv) {
                let xml = '<?xml version="1.0" encoding="UTF-8"?> ' +
                    '<localParam> ' +
                    '<width>600</width> ' +
                    '<height>500</height> ' +
                    '<picType>1</picType> ' +
                    '<capturePath>C:\\Hikvision</capturePath> ' +
                    '<recordSize>2</recordSize> ' +
                    '<recordPath>C:\\Hikvision</recordPath> ' +
                    '<limitPreviewTime>1800</limitPreviewTime> ' +
                    '</localParam>';
                let ret = spv.MPV_SetLocalParam(xml);
                if (ret !== 0) {
                    alert("单路预览设置本地参数失败");
                }
            },
            startPreview(xml) {
                this.spv.MPV_SetPlayWndCount(1);
                this.spv.MPV_StartPreview(xml);
            },
            getSinglePreviewToken(time, uuid) {
                const APP_KEY = "a592d676";
                const SECRET = "69681c3587194a50a2b11f1335ad6f41";
                const opUserUuid = 'c26a811c141a11e79aeeb32ef95273f2';
                const netZoneUuid = '5b994421aced4e2d9a76179e8cc70734';
                let uri = "/openapi/service/vss/preview/getPreviewParamByCameraUuid";
                let strParam = {
                    appkey: APP_KEY,
                    time: time,
                    pageNo: 1,
                    pageSize: 10,
                    opUserUuid: opUserUuid,
                    cameraUuid: uuid,
                    netZoneUuid: netZoneUuid
                };
                return this.genToken(uri, JSON.stringify(strParam), SECRET);
            },
            genToken(uri, strParam, mySecret) {
                let srcStr = uri + strParam + mySecret;
                return md5.hex_md5(srcStr).toUpperCase();
            }
        },
        mounted() {
            this.initMap();
            this.spv = document.getElementById('spv');
            this.initSpvx(this.spv);
            this.setLocalParam(this.spv);
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
        top: -50px;
    }
    .search-input {
        position: relative !important;
        z-index: 1889;
        top: 10px;
        left: 10px;
        float: left;
    }
    .sidebarx {
        z-index: 1888;
    }
    .vs-sidebar.vs-sidebar-parent {
        margin-top: 55px;
        height: calc(100% - 320px) !important;
    }
    .video-realtime {
        width: 95%;
        height: 300px;
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
        max-width: 400px !important;
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
        transform: translateY(-303px);
    }
    #gis-map .el-card {
        box-shadow: none !important;
        border-radius: 0 !important;
        background-color: #ffffffe8;
    }
    #gis-map .el-card__body {
        padding: 10px 20px !important;
        max-height: 210px;
    }
    #pm25 {
        width: 420px;
        height: 190px;
    }
    #noData {
        width: 100%;
        height: 190px;
        vertical-align: middle;
    }
    @media screen and (max-width: 1400px){
        .bottom-bar {
            transition: all .5s;
            height: 200px;
        }
        .bottom-bar-active > .vs-row > .vs-col {
            transform: translateY(-253px);
        }
        .vs-sidebar.vs-sidebar-parent {
            margin-top: 55px;
            height: calc(100% - 260px) !important;
        }
        #gis-map .el-card {
            box-shadow: none !important;
            border-radius: 0 !important;
            background-color: #ffffffe8;
            max-height: 200px !important;
        }
        #gis-map .el-card__body {
            padding: 10px 20px !important;
            max-height: 160px;
        }
        #pm25 {
            width: 275px;
            height: 140px;
        }
    }
    .el-card__header {
        padding: 10px 20px !important;
        font-size: 14px;
    }
    .leftx {
        padding: 0 30px;
        text-align: left;
        background: transparent;
    }
    .leftx li {
        list-style: none;
        margin: 10px 0;
        padding: 0 60px;
    }
    .vs-list--icon i {
        color: gold;
    }
    .reset-button {
        margin-left: 10px;
    }
</style>
