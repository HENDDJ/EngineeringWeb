<template>
    <section>
        <CommonCRUD :formColumns="$store.state.classInfo.properties" apiRoot="/identity/patrolRecords" :columns="$store.state.classInfo.properties"></CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'SafetyEquipmentPatrol',
        components: {
            CommonCRUD
        }
    };
</script>

<style scoped>

</style>
