<template>
    <section>
        <CommonCRUD :queryFormColumns="queryColumns" :columns="$store.state.classInfo.properties" apiRoot="/identity/majorHazards"
                    :formColumns="formColumns" >
        </CommonCRUD>
        <!--<CommonCRUD :columns="$store.state.classInfo.properties" apiRoot="/identity/sysClass" :formColumns="$store.state.classInfo.properties"></CommonCRUD>-->
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "MajorHazards",
        data() {
            return {
                formColumns: [],
            }
        },
        components: {
            CommonCRUD
        },
        created() {
            this.formColumns =this.$store.state.classInfo.properties;
        }
    }
</script>

<style scoped>

</style>
