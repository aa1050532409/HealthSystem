<template>
  <!-- <div>
    <div class="videoPlayer"> -->
  <video
    poster="../../assets/img/default/loading.jpg"
    :width="width"
    :height="height"
    style="max-height: 200px"
    ref="video"
    controls
    :src="src"
  ></video>
  <!-- </div>
  </div> -->
</template>

<script>
import { blobDownload } from "../../http/request.js";
export default {
  // watch: {
  //   src(newValue, preValue) {
  //     if (newValue != preValue) {
  //       this.download(newValue);
  //     }
  //   }
  // },
  props: {
    src: {
      type: String,
      default: () => {
        return "";
      },
    },
    width: String,
    height: String,
  },
  // methods: {
  //   download(url) {
  //     let fileName = url.split("/").pop();
  //     this.$localforage.getItem(fileName).then(res => {
  //       if (res) {
  //         this.$refs["video"].src = URL.createObjectURL(res);
  //       } else {
  //         blobDownload(url, { responseType: "blob" }).then(res => {
  //           console.log(res);
  //           this.$localforage.setItem(fileName, res.data);
  //           if (this.$refs["video"]) {
  //             this.$refs["video"].src = URL.createObjectURL(res.data);
  //           } else {
  //             console("页面已经跳转");
  //           }
  //           // try {
  //           //   this.$refs["video"].src = URL.createObjectURL(res.data);
  //           // } catch {
  //           //   console("页面已经跳转");
  //           // }
  //         });
  //       }
  //     });
  //   }
  // },
  // mounted() {
  //   if (this.src) {
  //     this.download(this.src);
  //   }
  // }
};
</script>

<style lang="scss" scoped>
</style>