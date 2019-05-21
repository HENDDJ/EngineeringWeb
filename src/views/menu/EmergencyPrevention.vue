<template>
    <section>
        <CommonCRUD :formColumns="formColumns" apiRoot="/identity/emergencyPrevention" :addBtnVis=addVis
                    :editBtnVis=editVis
                    :delBtnVis=delVis
                    :queryFormColumns="queryFormColumns"
                    :columns="Columns"  >
            <template slot="handle" slot-scope="scope" >
                <div class="encStyle" @click="downLoad(scope.row)">
                    {{(scope.row.enclosure) ? scope.row.enclosure.split("&")[1] : ' ' }}
                </div>
            </template>
        </CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'EmergencyPrevention',
        data() {
            return {
                addVis:true,
                editVis:true,
                delVis:true,
                Columns: [
                    {
                        name: "name",
                        type: 'string',
                        des: "应急名称",
                    },
                    {
                        name: "type",
                        type: 'string',
                        des: "应急针对类别",
                    },
                    {
                        name: "description",
                        type: 'string',
                        des: "描述",
                    },
                    {
                        name: "submitter",
                        type: 'string',
                        des: "提交人",
                    },
                    {
                        name: "modifiedAt",
                        type: 'datetime',
                        des: "最新提交时间",
                        formatter: (row)=>{
                            var timeF =  row.modifiedAt.substr(0,10)
                            var timeB =  row.modifiedAt.substr(11)
                            return timeF+' '+timeB
                        }
                    },
                ],
                formColumns:{},
                typeOptions: [
                    {value:'重大危险源',label:'重大危险源'},
                    {value:'各类事故',label:'各类事故'},
                    {value:'岗位和地点',label:'岗位和地点'},
                    {value:'薄弱环节',label:'薄弱环节'},
                    {value:'重要工程',label:'重要工程'},
                ],
                queryFormColumns:[
                    {
                        name:'name',
                        visible:true,
                        des:'应急名称',
                        type:'string'
                    },
                    {
                        name:'type',
                        visible:true,
                        des:'当事人',
                        type:'select',
                        options:Array
                    }
                ]
            }
        },
        methods: {
            handleSelectOptions() {
                this.formColumns.filter(item => item.name === 'type')[0].options = this.typeOptions
                this.queryFormColumns.filter(item => item.name === 'type')[0].options = this.typeOptions
            },
            handleEnc(){
                var columsItems = {slot:true,name:'enclosure',des:'附件',slotName:'handle'};
                this.Columns.push(columsItems);
            },
            downLoad(row){
                window.open(row.enclosure.split("&")[0],'_self')
            },
            controlAuthority(){
                this.roleCode = JSON.parse(sessionStorage.getItem('userInfo')).roleCode;
                //上报人显示增删改查按钮
                if( this.roleCode === 'PROJECT_MANAGER'){
                    //显示自己上报的内容
                    this.addVis = false,
                        this.editVis = false,
                        this.delVis = false
                }else{

                }
            },
        },
        components:{
            CommonCRUD
        },
        created () {
            this.formColumns =this.$store.state.classInfo.properties;
            this.controlAuthority();
            this.handleSelectOptions();
            this.handleEnc();
        }
    };
</script>

<style scoped>
    .encStyle{
        color: blue;
        text-decoration: none;
        cursor: pointer;
    }

    .encStyle:hover{
        text-decoration: underline;
        cursor: pointer;
    }
</style>
