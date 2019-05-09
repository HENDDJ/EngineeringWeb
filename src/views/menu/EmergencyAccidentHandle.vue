<template>
    <section>
        <CommonCRUD :formColumns="formColumns" apiRoot="/identity/emergencyAccidentHandle" :columns="$store.state.classInfo.properties"></CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'EmergencyAccidentHandle',
        data() {
            return {
                formColumns :{}

            }
        },
        components :{
            CommonCRUD
        },
        created () {
            this.formColumns =this.$store.state.classInfo.properties;

        }
    };
</script>

<style scoped>

</style>
