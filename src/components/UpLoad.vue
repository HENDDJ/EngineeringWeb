<template>
    <div class="file-upload">
        <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :auto-upload="true"
            :http-request="uploadFile"
            :disabled="disabled">
            <div v-for="(item,index) in images" class="img-container" @click.stop="stopEvent" @mouseover="moveIn(item)" @mouseout="moveOut(item)">
                <img class="img-pre" :src="item.path">
                <div v-show="item.active" style="background-color: rgba(255,255,255,.6);position: relative;top: -77px;width: 70px;height: 70px">
                    <i class="el-icon-delete ico-po-del" @click.stop="deleteImg(index)"></i>
                    <i class="el-icon-zoom-in ico-po-zoom" @click.stop="zoomIn(item.path)"></i>
                </div>
            </div>
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-dialog
            title="预览"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            width="50%"
            style="text-align: center">
            <img :src="dialogUrl" style="max-width: 500px"/>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "UpLoad",
        props: {
            value: {
                //成功上传后的返回的文件地址
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
        },
        created() {
            if (!this.value) {
                this.images = [];
                return;
            }
            this.value.split(',').forEach(item => {
                this.images.push({path: item, active: false})
            })

        },
        data() {
            return {
                images: [],
                dialogUrl: '',
                dialogVisible: false,
                app:this
            };
        },
        methods: {
            // base64转文件
            dataURItoBlob(dataURI) {
                let temp = dataURI.split(",");
                var byteString = atob(temp[1]);
                var mimeString = temp[0].split(":")[1].split(";")[0];
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                return new Blob([ab], { type: mimeString });
            },
            uploadFile(http) {
                var app = this.app
                var image = http.file;
                var reader = new FileReader();
                reader.readAsDataURL(image);
                var img = new Image();
                reader.onload = function (e) {
                    var width = 1080, //图像大小
                        quality = 0.8, //图像质量
                        canvas = document.createElement("canvas"),
                        drawer = canvas.getContext("2d");
                        img.src = e.target.result
                        img.onload = function () {
                        canvas.width = width;
                        canvas.height = width * (img.height / img.width);
                        drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
                        var dataURL = canvas.toDataURL("image/jpeg", quality);
                        console.log(app.dataURItoBlob(dataURL))
                    let files = new File([app.dataURItoBlob(dataURL)], image.name, {type: image.type})
                    let formData = new FormData();
                    formData.append('file', files);
                    app.$http('POST', '/identity/accessory/', formData, false).then(
                        res => {
                            app.images.push({path: res.path, active: false});
                            app.$emit('getValue', app.images.map(item => item.path).join(','));
                        }
                    )
                }
                }

            },

            moveIn(item) {
                item.active = true;
            },
            moveOut(item) {
                item.active = false;
            },
            deleteImg(index) {
                this.images.splice(index);
                this.$emit('getValue', this.images.map(item => item.path).join(','));
            },
            zoomIn(path) {
                this.dialogUrl = path;
                this.dialogVisible = true;
            },
            stopEvent(){
                return;
            }
        }
    }
</script>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 70px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        display: inline-block;
        border: #b7b7b7 1px dashed;
        border-radius: 5px;
        vertical-align: top
    }
    .img-container {
        display: inline-block;
        vertical-align: top;
        width: 70px;
        height: 70px;
    }
    .ico-po-del {
        font-size: 22px;
        color: #565656;
        top: 16px;
        z-index: 999;
        position: relative;
    }
    .ico-po-zoom {
        font-size: 22px;
        z-index: 999;
        top: 16px;
        color: #565656;
        position: relative;
    }
    .ico-po-del:hover {
        color: #ff4522;
    }
    .ico-po-zoom:hover {
        color: #409EFF;
    }
    .img-pre {
        width: 70px;
        height: 70px;
        display: inline-block;
        border: #b7b7b7 1px dashed;
        border-radius: 5px;
    }
    .file-upload{
        width:600px;
    }
</style>
