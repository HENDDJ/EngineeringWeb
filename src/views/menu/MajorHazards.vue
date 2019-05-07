<template>
    <section>
        <CommonCRUD :formColumns="formColumns" apiRoot="/identity/majorHazards" :columns="$store.state.classInfo.properties"></CommonCRUD>
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
        methods: {
            loadDepartmentOptions() {
                this.$http('POST', 'identity/projectInfo/list', false).then(
                    data => {
                        this.formColumns.filter( item => item.name === 'proId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                    }
                )
            }
        },
        components: {
            CommonCRUD
        },
        created() {
            this.formColumns =this.$store.state.classInfo.properties;
            this.loadDepartmentOptions();
        }
    }
</script>

<style scoped>

</style>
