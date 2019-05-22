<template>
    <section>
        <CommonCRUD :formColumns="formColumns" apiRoot="/identity/patrolRecords" :columns="columns" :queryFormColumns="queryFormColumns"></CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'SafetyEquipmentPatrol',
        data(){
            return {
                formColumns:{},
                columns:{},
                roleCode:'',
                queryFormColumns:[
                    {
                        name:'issueName',
                        visible:true,
                        des:'巡查名称',
                        type:'string'
                    }
                ]
            }
        },
        methods: {
            handleSelect() {
                this.$http('POST', 'identity/projectInfo/list', false).then(
                    data => {
                        this.formColumns.filter(item => item.name === 'proId')[0].options = data.map(item => {
                            return {value: item.id, label: item.name}
                        });
                    }
                )
            },
            //权限控制（列表数据）
            controlAuthority(){
                this.roleCode = JSON.parse(sessionStorage.getItem('userInfo')).roleCode;
                //上报人显示增删改查按钮
                if( this.roleCode === 'PROJECT_MANAGER'){
                    var userId = JSON.parse(sessionStorage.getItem('userInfo')).proId;
                        this.queryFormColumns.push( {
                            name:'proId',
                            value:userId
                        })

                }else{
                    this.queryFormColumns.push( {
                        name:'proId',
                        visible:true,
                        des:'工程名称',
                        type:'select',
                        options:Array
                    })
                    this.$http('POST', 'identity/projectInfo/list', false).then(
                        data => {
                            this.queryFormColumns.filter( item => item.name === 'proId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                        }
                    )
                }
            },
        },
        created(){
            this.formColumns = this.$store.state.classInfo.properties
            this.columns = this.$store.state.classInfo.properties
            this.handleSelect()
            this.controlAuthority();
        },
        components: {
            CommonCRUD
        }
    };
</script>

<style scoped>

</style>
