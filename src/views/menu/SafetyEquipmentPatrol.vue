<template>
    <section>
        <CommonCRUD :formColumns="$store.state.classInfo.properties" apiRoot="/identity/patrolRecords" :columns="$store.state.classInfo.properties" :queryFormColumns="queryFormColumns"></CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'SafetyEquipmentPatrol',
        data(){
            return {
                queryFormColumns:[
                    {
                        name:'issueName',
                        visible:true,
                        des:'巡查名称',
                        type:'string'
                    },
                    {
                        name:'patrolObject',
                        visible:true,
                        des:'巡查对象',
                        type:'string',
                    }
                ]
            }
        },
        components: {
            CommonCRUD
        }
    };
</script>

<style scoped>

</style>
