<template>
    <div id="app">
        <div class="container">
            <h1>Simple Vue Uploader</h1>
            <form action="" enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
                <div class="dropbox">
                    <input type="file" 
                        :name="uploadFieldName" 
                        :disabled="isSaving"
                        @change="fileChange($event.target.name, $event.target.files);" 
                        class="input-file"
                    >
                    <p v-if="isInitial">
                        Drag your file here or click to browse.
                    </p>
                    <p v-if="isSaving">
                        Uploading file...
                    </p>
                </div>
            </form>
            <!-- SUCCESS -->
            <div v-if="isSuccess">
                <h4 class="text-success">File uploaded successfully.</h4>
                <p><a href="javascript:void(0)" @click="reset()">Upload other file</a></p>
                <p v-if="isImage">
                    <img :src="uploadedFile.url" class="img-responsive img-thumbnail"
                    :alt="uploadedFile.originalName">
                </p>
                <p>{{ uploadedFile.originalName }} - <a :href="uploadedFile.url"
                        target="_blank">{{ uploadedFile.url }}</a></p>
            </div>
            <!-- FAILED -->
            <div v-if="isFailed">
                <h4 class="text-danger">Upload failed.</h4>
                <p><a href="javascript:void(0)" @click="reset()">Try again</a></p>
                <pre>{{ uploadError }}</pre>
            </div>
        </div>
    </div>
</template>

<script>
import Config from '../config';
import { upload } from './file-upload';
// import { wait } from './utils';
const BASE_URL = Config.url || 'http://localhost:3000';
const STATUS_INITIAL = 0;
const STATUS_SAVING = 1;
const STATUS_SUCCESS = 2;
const STATUS_FAILED = 3;


export default {
    name: 'app',
    data() {
        return {
            uploadedFile: {},
            uploadError: null,
            currentStatus: null,
            uploadFieldName: 'file'
        }
    },
    computed: {
        isInitial() {
            return this.currentStatus === STATUS_INITIAL;
        }, 
        isSaving() {
            return this.currentStatus === STATUS_SAVING;
        },
        isSuccess() {
            return this.currentStatus === STATUS_SUCCESS;
        },
        isFailed() {
            return this.currentStatus === STATUS_FAILED;
        },
        isImage(){
            const arr = this.uploadedFile.fileName.split('.');
            return arr[1] === 'jpg' || arr[1] === 'jpeg' || arr[1] === 'gif' || arr[1] === 'png';
        }
    },
    methods: {
        reset() {
            // Reset to initial state
            this.currentStatus = STATUS_INITIAL;
            this.uploadedFile = {};
            this.uploadError = null;
        },
        save(formData) {
            // Upload data to server
            this.currentStatus = STATUS_SAVING;
            const url = `${BASE_URL}/upload`;

            upload(formData)
                .then(x => {
                    this.uploadedFile = x;
                    this.currentStatus = STATUS_SUCCESS;
                })
                .catch(err => {
                    this.uploadError = err.response;
                    this.currentStatus = STATUS_FAILED;
                });
        },
        fileChange(name, fileList) {
            // Handle files changes
            const formData = new FormData();

            if (!fileList.length) return;

            Array
              .from(Array(fileList.length).keys())
              .map(x => {
                formData.append(name, fileList[x], fileList[x].name);
              });
            this.save(formData);
        }
    },
    mounted() {
        this.reset();
    },
}
</script>

<style lang="scss">
    .input-file {
        opacity: 0;
        width: 100%;
        height: 200px;
        position: absolute;
        cursor: pointer;
    }
    .dropbox {
        outline: 2px dashed grey;
        outline-offset: -10px;
        background: #ccc;
        color: #999;
        padding: 10px;
        min-height: 200px;
        position: relative;
        cursor: pointer;
    }
    .dropbox:hover {
        background: #eee;
    }
    .dropbox p {
        font-size: 1.2em;
        text-align: center;
        padding: 50px 0;
    }
    h4 .success {
        
    }
</style>
