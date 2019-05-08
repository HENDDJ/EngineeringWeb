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
        <vs-sidebar parent="#gis-map" default-index="1" click-not-close
                    hidden-background position-right color="primary" class="sidebarx"
                    spacer v-model="active">
            <vs-collapse type="default" open style="text-align: left;font-size: 14px;padding: 0">
                <vs-collapse-item open>
                    <div slot="header">
                        工程信息
                    </div>
                    <div v-for="item in formColumns" v-if="item.mapVis">
                        <p style="font-size: 12px">{{item.des}}：{{form[item.name] === 0 ? '否' : (form[item.name] === 1 ? '是' : form[item.name])}}</p>
                    </div>
                </vs-collapse-item>
                <vs-collapse-item open>
                    <div slot="header">
                        PM2.5实时监测
                    </div>
                    <div id="pm25">
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
                active: false
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
                                y:35,
                                x2:30,
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

            }
        },
        mounted() {
            this.initMap();
        }
    }
</script>

<style>
    #allmap {
        width: 100%;
        height: 610px;
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
        height: calc(100% - 55px) !important;
    }
    #pm25 {
        width: 100%;
        height: 180px;
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
</style>
