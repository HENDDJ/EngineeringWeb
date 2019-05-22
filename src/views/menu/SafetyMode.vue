<template>
    <section>
        <CommonCRUD :formColumns="formColumns" :columns="$store.state.classInfo.properties" apiRoot="/identity/safetyMode" :queryFormColumns="queryFormColumns"
                    :editBtnVis=editVis
                    :addBtnVis = addBVis
                    :delBtnVis=delVis>
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
        name: 'SafetyMode',
        data(){
            return {
                columns:[],
                editVis:true,
                addBVis:true,
                delVis:true,
                formColumns :{},
                queryFormColumns:[
                    {
                        name:'name',
                        visible:true,
                        des:'名称',
                        type:'string'
                    },
                    {
                        name:'type',
                        visible:true,
                        des:'类型',
                        type:'string'
                    },
                ]
            }
        },
        methods :{
            loadDepartmentOptions() {
                this.$http('POST', 'identity/organization/list', false).then(
                    data => {
                        this.formColumns.filter(item => item.name === 'conveningOrg')[0].options = data.map(item => {
                            return {value: item.name, label: item.name}
                        });
                    }
                )
            },
            handleEnc(){
                this.columns = [];
                this.columns.length = 0;
                let temp = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
                this.columns = temp;
                var columsItems = {slot:true,name:'enclosure',des:'附件',slotName:'handle'};
                this.columns.push(columsItems);
            },
            downLoad(row){
                window.open(row.enclosure.split("&")[0],'_self')
            },
            //权限控制（列表数据）
            controlAuthority(){
                this.roleCode = JSON.parse(sessionStorage.getItem('userInfo')).roleCode;
                //上报人显示增删改查按钮
                if( this.roleCode === 'PROJECT_MANAGER'){
                    this.editVis = false
                    this.addBVis = false
                    this.delVis = false
                }
            },
        },
        components :{
            CommonCRUD
        },
        created () {
                this.formColumns = this.$store.state.classInfo.properties;
                this.columns = this.$store.state.classInfo.properties;
                this.loadDepartmentOptions();
                this.handleEnc();
                this.controlAuthority();
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
