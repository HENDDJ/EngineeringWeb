<template>
    <section style="display: flex">
        <div style="flex: 1;margin: 12px 5px;height: 100%">
            <el-input
                placeholder="输入关键字进行过滤"
                size="large"
                v-model="filterText"
                style="width: 98%;margin-left: 12px;margin-bottom: 10px;">
            </el-input>
            <el-scrollbar>
                <el-tree
                    :data="treeData"
                    @node-click="handleNodeClick"
                    :filter-node-method="filterNode"
                    :highlight-current="true"
                    ref="tree"
                    class="tree-sl"
                    @node-expand="showChildren">
                </el-tree>
            </el-scrollbar>
        </div>
        <div style="flex: 3;margin: 12px 5px;height: calc(100vh - 75px)">
            <object classid="clsid:9ECD2A40-1222-432E-A4D4-154C7CAB9DE3" id="spv" width="100%" height="100%"></object>
        </div>
    </section>
</template>

<script>
    import md5 from '@/utils/md5';
    export default {
        name: "ActualMonitor",
        data() {
            return {
                treeData: [],
                filterText: '',
                spv: {}
            }
        },
        watch: {
            filterText(val) {
                if (!val) {
                    this.loadTreeData();
                }
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            showChildren(obj, node) {
                if (obj.children[0].label !== '加载中...') {
                    return;
                }
                this.$http("post", '/identity/camera/list', {regionUuid: obj.id}, false).then(
                    data => {
                        obj.children = data.map(item => {
                           return {
                               id: item.cameraUuid,
                               label: item.cameraName,
                               name: item.cameraName
                           }
                        })
                    }
                );
            },
            filterNode(value, data) {
                if (!value) {
                    this.loadTreeData();
                    return true;
                }
                return data.name.indexOf(value) !== -1;
            },
            handleNodeClick(obj) {
                if (obj.children) {
                    return;
                }
                this.initVideoDialogVue(obj.id);
            },
            loadTreeData() {
                this.$http('post', '/identity/projectRegion/list', false).then(
                    data => {
                        if (this.$store.state.projectName) {
                            this.filterText = this.$store.state.projectName;
                            data.forEach((item) => {
                                if (item.name === this.filterText) {
                                    this.treeData.push({ id: item.regionUuid, label: item.name, name: item.name,children: [{label: '加载中...', name: ''}]});
                                }
                            })
                        } else {
                            data.forEach(item => {
                                this.treeData.push({ id: item.regionUuid, label: item.name, name: item.name,children: [{label: '加载中...', name: ''}]});
                            });
                        }
                        this.$store.commit('getProjectName', '');
                        this.spv = document.getElementById('spv');
                        this.initSpvx(this.spv);
                        this.setLocalParam(this.spv);
                    }
                )
            },
            initVideoDialogVue(cameraUuid) {
                this.$http('POST', `/identity/camera/getPreviewXml/${cameraUuid}`,false)
                    .then(data => {
                            data.replace('/', '');
                            let xml = JSON.parse(data).data;
                            this.startPreview(xml);
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
                this.spv.MPV_SetPlayWndCount(4);
                this.spv.MPV_StartPreview(xml);
            },
        },
        mounted() {
            this.loadTreeData();
        },
        deactivated() {
            this.spv.StopAllPreview();
        }
    }
</script>

<style scoped>
.tree-sl {
    margin: 0 12px;
    height: calc(100vh - 120px);
}
</style>
