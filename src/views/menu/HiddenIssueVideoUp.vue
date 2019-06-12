<template>
    <div class="container"  style="text-align: left;">
        <input id='shot' type="text" v-model="shotUrl"  style="display: none">
        <div style="margin-top: 20px;margin-left: 10px;height: calc(100vh - 75px);width:55%;display: inline-block;">
            <object classid="clsid:9ECD2A40-1222-432E-A4D4-154C7CAB9DE3" id="spv" width="100%" height="100%"></object>
        </div>
        <div style="display: inline-block;width: 40%;vertical-align: top;overflow: hidden;padding: 20px 20px;">
            <el-form :inline="false" label-width="80px" :rules="rules">
                <el-form-item label="项目名称" prop="selectValue">
                    <el-select v-model="selectValue" filterable clearable placeholder="请选择" @change="showChildren" size="small">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="监控列表">
                    <template v-for="(item,index) in videoList">
                        <el-button color="primary" type="flat" style="margin-bottom: 6px;"
                                   @click="childrenClick(item.id)">{{item.name}}
                        </el-button>
                    </template>
                    <el-button type="primary" @click="shotPic">截图</el-button>
                </el-form-item>
            </el-form>

            <div id="mesUp">
                <el-form :inline="true" :model="form" :rules="rules" ref="form" class="demo-form-inline"
                         label-width="80px">
                    <el-form-item v-for="item in formColumns" :key="item.des" :label="item.des" :prop="item.name"
                                  v-if="item.formShow !== 'false'">
                        <el-input v-model="form[item.name]"  v-if="item.type === 'string'"
                                  :disabled="item.disabled || disabled"></el-input>
                        <el-select v-model="form[item.name]" v-else-if="item.type === 'select'"
                                   filterable :disabled="item.disabled || disabled">
                            <el-option v-for="opItem in item.options" :value="opItem.value" :label="opItem.label"
                                       :key="opItem.value"></el-option>
                        </el-select>
                        <el-date-picker v-if="item.type === 'date'"
                                        v-model="form[item.name]"
                                        type="date"
                                        :disabled="item.disabled || disabled"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期"
                                        style="width: 160px">
                        </el-date-picker>
                        <el-input v-model="form[item.name]" type="textarea" class="issue-area"
                                  :rows="3" v-if="item.type === 'textarea'"
                                  :disabled="item.disabled || disabled"></el-input>
                        <CommonUpload v-if="item.type === 'image'" :value="form[item.name]" :disabled="item.disabled || disabled" @getValue="form[item.name] = $event"></CommonUpload>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button type="primary" :loading="submitLoading" @click="submit('form')">确 定</el-button>
                        <el-button @click="handleClose">取 消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!--<div style="flex: 1;margin: 12px 5px;height: 100%">-->
        <!--<el-scrollbar>-->
        <!--<el-tree-->
        <!--:data="treeData"-->
        <!--@node-click="handleNodeClick"-->
        <!--:filter-node-method="filterNode"-->
        <!--:highlight-current="true"-->
        <!--ref="tree"-->
        <!--class="tree-sl"-->
        <!--@node-expand="showChildren">-->
        <!--</el-tree>-->
        <!--</el-scrollbar>-->
        <!--</div>-->



    </div>

</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import LookUp from '@/lookup';
    import CommonUpload from '@/components/UpLoad';
    import CommonFileUpload from '@/components/FileUpLoad';
    import {tansfer} from '../../lookup/transfer';
    import md5 from '@/utils/md5';

    export default {
        name: 'HiddenIssueVideoUp',
        data () {
            return {
                formColumns: [],
                columns: [],
                roleCode: '',
                uploadBtn: true,
                dealBtn: true,
                dialogVisible: false,
                form: {
                    projectId: '',
                    userId: '',
                    departmentId: ''
                },
                submitLoading: false,
                title: '隐患上报',
                disabled: false,
                selected: [],
                rules: {
                },
                options: [],
                srcUrl: '',
                recordsForm: {issueId: '', preNodeId: '', nextNodeId: '', actionType: '', des: ''},
                treeData: [],
                filterText: '',
                spv: {},
                selectValue: '',
                videoList: [],
                shotUrl:'Copy These Text'
            };

        },
        watch: {
            filterText (val) {
                if (!val) {
                    this.loadTreeData();
                }
                this.$refs.tree.filter(val);
            },
            shotUrl(val){
                if(val){
                    this.$copyText(val).then(function (e) {

                        console.log(e)
                    }, function (e) {

                        console.log(e)
                    })
                }
            }
        },
        methods: {
            handleSelectOptions () {
                let items = [
                    ['issueGrade', 'IssueType']
                ].forEach(item => {
                        this.formColumns.filter(sub => sub.name === item[0])[0].options = LookUp[item[1]];
                    }
                );
                tansfer(this.columns);
            },
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.from = {};
                        this.$refs['form'].resetFields();
                        this.dialogVisible = false;
                        done();
                    })
                    .catch(_ => {
                    });
            },
            add (val) {

                this.dialogVisible = true;
            },
            controlAuthority () {
                this.roleCode = JSON.parse(sessionStorage.getItem('userInfo')).roleCode;
                //  console.log(JSON.parse(sessionStorage.getItem('userInfo')));
                if (this.roleCode === 'PROJECT_MANAGER') {
                    this.queryFormColumns[0].value = JSON.parse(sessionStorage.getItem('userInfo')).id;
                    this.dealBtn = false;
                    this.uploadBtn = true;
                }
                if (this.roleCode === 'MAJOR_HAZARDS_CONFIRM') {
                    this.uploadBtn = false;
                    this.dealBtn = true;
                }
            },
            submit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true;
                        this.$nextTick(() => {
                            let type = 'Post';
                            let path = '/identity/hiddenIssue/';
                            this.form.status = '3dfa705b-c5ec-4e95-9838-0045022358bb';
                            this.$http(type, path, Object.assign({}, this.form), false).then((data) => {

                                this.$nextTick(() => {
                                    let type = 'Post';
                                    let path = '/identity/hiddenRecords/';
                                    this.recordsForm.issueId = data.id;
                                    this.recordsForm.actionType = 'UPLOAD';
                                    this.recordsForm.preNodeId = '';
                                    this.recordsForm.nextNodeId = '3dfa705b-c5ec-4e95-9838-0045022358bb';
                                    this.recordsForm.des = '隐患上报';
                                    this.$http(type, path, this.recordsForm, false).then(() => {
                                        this.recordsForm = {};
                                        this.submitLoading = false;
                                        this.dialogVisible = false;
                                        this.form = {
                                            projectId: '',
                                            userId: '',
                                            departmentId: ''
                                        };
                                        this.$message({type: 'success', message: '下发成功'})
                                    });
                                });
                            });
                        });
                    } else {
                        this.dialogVisible = true;
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            loadDepartmentOptions () {
                this.$http('POST', 'identity/organization/list', false).then(
                    data => {
                        this.formColumns.filter(item => item.name === 'departmentId')[0].options = data.map(item => {
                            return {value: item.id, label: item.name};
                        });
                        this.form.departmentId = JSON.parse(sessionStorage.getItem('userInfo')).organizationId;
                    }
                );
                this.$http('POST', 'identity/projectInfo/list', false).then(
                    data => {
                        this.formColumns.filter(item => item.name === 'projectId')[0].options = data.map(item => {
                            return {value: item.id, label: item.name};
                        });
                    }
                );
                this.$http('POST', 'identity/principal/list', false).then(
                    data => {
                        this.formColumns.filter(item => item.name === 'userId')[0].options = data.map(item => {
                            return {value: item.id, label: item.name};
                        });
                    }
                );

            },
            loadOptionsData () {
                this.$http('post', '/identity/projectRegion/list', false).then(
                    data => {
                        this.options = data.map(item => {
                            return {value: item.regionUuid, label: item.name};
                        });
                        this.$store.commit('getProjectName', '');
                        this.spv = document.getElementById('spv');
                        this.initSpvx(this.spv);
                        this.setLocalParam(this.spv);
                    }
                );
            },
            showChildren () {
                if (this.selectValue) {
                    this.$http('post', '/identity/camera/list', {regionUuid: this.selectValue}, false).then(
                        data => {
                            this.videoList = data.map(item => {
                                return {
                                    id: item.cameraUuid,
                                    label: item.cameraName,
                                    name: item.cameraName
                                };
                            });
                        }
                    );
                    this.$http('post', `/identity/projectInfo/list`, {regionId: this.selectValue}, false)
                        .then( data => {
                            if (data.length === 1) {
                                this.form.projectId = data[0].id;
                                this.$http('post', `/identity/principal/list`, {proId: this.form.projectId}, false)
                                    .then( data => {
                                        if (data.length === 1) {
                                            this.form.userId = data[0].id;
                                        } else {
                                            this.form.userId = '';
                                        }
                                    })
                            } else {
                                this.form.projectId = '';
                            }
                        });
                }
            },
            initSpvx (spv) {
                let ret = spv.MPV_Init(1);
                if (ret !== 0) {
                    alert('单路预览初始化失败');
                }
            },
            setLocalParam (spv) {
                let xml = '<?xml version="1.0" encoding="UTF-8"?> ' +
                    '<localParam> ' +
                    '<width>600</width> ' +
                    '<height>500</height> ' +
                    '<picType>0</picType> ' +
                    '<capturePath>C:\\Hikvision</capturePath> ' +
                    '<recordSize>2</recordSize> ' +
                    '<recordPath>C:\\Hikvision</recordPath> ' +
                    '<limitPreviewTime>1800</limitPreviewTime> ' +
                    '</localParam>';
                let ret = spv.MPV_SetLocalParam(xml);
                if (ret !== 0) {
                    alert('单路预览设置本地参数失败');
                }
            },
            childrenClick (val) {
                this.initVideoDialogVue(val);
            },
            initVideoDialogVue(cameraUuid) {
                this.$http('POST', `/identity/camera/getPreviewXml/${cameraUuid}`,false)
                    .then(data => {
                        data.replace('/', '');
                        let xml = JSON.parse(data).data;
                        this.startPreview(xml);
                    }).catch( e => {
                        console.log(e);
                })
            },
            startPreview (xml) {
                this.spv.MPV_SetPlayWndCount(4);
                this.spv.MPV_StartPreview(xml);
                // this.spv.setCaptureParam(0,'',1,1000,4)
            },
            shotPic() {
                var ocxObj = document.getElementById("spv");
                var ret = ocxObj.MPV_SnapShot(-1);
                if (ret != 0){
                    alert("选中窗口预览抓图失败");
                }
            }
                //this.srcUrl = 'http://172.16.0.199:8888/g1/M00/00/00/rBAAx1ycPeaAJwcvAABGYipskI4596.jpg'
        },
        components: {
            CommonCRUD,
            CommonUpload,
            CommonFileUpload
        },
        created () {
            this.formColumns = [];
            this.formColumns.length = 0;
            let temp1 = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            this.formColumns = temp1;
            this.handleSelectOptions();
            //this.controlAuthority();
            this.loadDepartmentOptions();
            this.loadOptionsData();
            window.videoUp = this
        }
    };
</script>

<style>
    .issue-area .el-textarea__inner {
        width: 490px !important;
    }
    @media screen and (max-width: 1400px){
        .issue-area .el-textarea__inner {
            width: 200px !important;
        }
    }


    /*#mesUp  .el-form-item--mini.el-form-item{*/
    /*width: 150px !important;*/
    /*}*/

</style>

