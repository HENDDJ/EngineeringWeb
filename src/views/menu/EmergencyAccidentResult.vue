<template>
    <section>
        <CommonCRUD :formColumns="formColumns" apiRoot="/identity/emergencyAccidentResult" :columns="columns"></CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'EmergencyAccidentResult',
        data() {
            return {
                formColumns :[],
                columns: []
            }
        },
        methods: {
            timeTransfer() {
                this.columns.forEach(item => {
                    if(item.name == 'createdAt'){
                        item.formatter = (row, cell,val,index) => {
                            var timeF =  row.modifiedAt.substr(0,10)
                            return timeF
                        }
                    }
                });
            }
        },
        components :{
            CommonCRUD
        },
        created () {
            this.formColumns =this.$store.state.classInfo.properties;
            this.columns = this.$store.state.classInfo.properties;
            this.timeTransfer();
        }
    };
</script>

<style scoped>

</style>
