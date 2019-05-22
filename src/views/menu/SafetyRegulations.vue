<template>
    <section>
        <CommonCRUD :queryFormColumns="queryColumns" :columns="columns" apiRoot="/identity/safetyRegulations"
                    :formColumns="formColumns" :editBtnVis=editVis
                    :addBtnVis = addBVis
                    :delBtnVis=delVis>
            <template slot="handle" slot-scope="scope" >
                <div class="encStyle" @click="downLoad(scope.row)">
                    {{(scope.row.enclosure) ? scope.row.enclosure.split("&")[1] : ' ' }}
                </div>
            </template>
        </CommonCRUD>
        <!--<CommonCRUD :columns="$store.state.classInfo.properties" apiRoot="/identity/sysClass" :formColumns="$store.state.classInfo.properties"></CommonCRUD>-->
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';

    export default {
        name: 'SafetyRegulations',
        data() {
            return {
                formColumns: [],
                columns:[],
                editVis:true,
                addBVis:true,
                delVis:true,
                queryColumns:[
                    {
                        des: '名称',
                        name: 'name',
                        visible:true,
                        type: 'string'
                    }
                ],
            }
        },
        methods:{
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
        components: {
            CommonCRUD
        },
        created() {
            this.formColumns = this.$store.state.classInfo.properties;
            this.columns = this.$store.state.classInfo.properties;
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
