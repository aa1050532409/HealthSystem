<template>
  <!-- <div id="message"> -->
  <div id="message" v-scroll-bottom="sessions">
    <template v-for="item in sessions">
      <ul class="ul" v-if="currentSessionId == item.id" :key="item.id">
        <li class="li" v-for="entry in item.messages" :key="entry.id">
          <!-- <p class="time">
            <span
              v-show="index==0 || entry.date.getTime()-item.messages[index-1].date.getTime()>150000"
            >{{entry.date | time}}</span>
          </p>-->
          <div class="main" :class="{ self: entry.self }">
            <img
              class="avatar"
              :src="entry.self ? portrait : item.user.img"
              alt
            />
            <img
              class="widthControl"
              v-if="entry.type == 'img'"
              :src="entry.message"
              alt
            />

            <audio
              v-else-if="entry.type == 'audio'"
              controls="controls"
              preload="auto"
              style="height:20px;width:300px"
              class="widthControl"
              :src="entry.message"
            ></audio>

            <video
              v-else-if="entry.type == 'video'"
              controls="controls"
              class="widthControl"
              :src="entry.message"
            >
              your browser does not support the video tag.
            </video>
            <div v-else class="text">
              <p length="150px">{{ entry.message }}</p>
            </div>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "message",
  data() {
    return {
      img:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",

      recorderConfig: {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        mimeType: "video/mp4"
      },
      recorder: ""
    };
  },
  computed: {
    ...mapState({
      portrait: state => state.user.userInfo.portrait,
      sessions: state => state.patientCommunication.sessions,
      currentSessionId: state => state.patientCommunication.currentSessionId
    })
  },
  filters: {
    time(date) {
      if (date) {
        date = new Date(date);
      }
      return `${date.getHours()}:${date.getMinutes()}`;
    }
  },
  directives: {
    /*这个是vue的自定义指令,官方文档有详细说明*/
    // 发送消息后滚动到底部,这里无法使用原作者的方法，也未找到合理的方法解决，暂用setTimeout的方法模拟
    "scroll-bottom"(el) {
      setTimeout(function() {
        el.scrollTop += 9999;
      }, 20);
    }
  },
  mounted() {
    // let constraints = { audio: true, video: { width: 1280, height: 720 } };
    // navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    //   let mediaRecorder = new MediaRecorder(stream, this.recorderConfig);
    //   this.recorder = mediaRecorder;
    // });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
#message {
  padding: 15px;
  height: 250px;
  // max-height: 68%;
  overflow-y: scroll;
  ul {
    list-style-type: none;
    li {
      margin-bottom: 15px;
    }
  }
  .time {
    text-align: right;
    margin: 7px 0;
    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #fff;
      background-color: #dcdcdc;
      border-radius: 2px;
    }
  }
  .main {
    .widthControl {
      max-width: 150px;
    }
    audio {
      z-index: 1000;
    }
    .avatar {
      float: left;
      margin: 0 10px 0 0;
      border-radius: 3px;
      width: 30px;
      height: 30px;
    }
    .text {
      display: inline-block;
      padding: 0 10px;
      max-width: 200px;
      background-color: #b2e281;
      border-radius: 4px;
      line-height: 30px;
    }
  }
  .self {
    text-align: right;

    .avatar {
      float: right;
      margin: 0 0 0 10px;
      border-radius: 3px;
      width: 30px;
      height: 30px;
    }
    .text {
      display: inline-block;
      padding: 0 10px;
      max-width: 200px;
      background-color: #b2e281;
      border-radius: 4px;
      line-height: 30px;
      p {
        text-align: left;
      }
    }
  }
}
</style>
