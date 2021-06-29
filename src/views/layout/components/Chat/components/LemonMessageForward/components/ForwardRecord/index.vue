<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="600px"
    :close-on-click-modal="true"
    :append-to-body="true"
    :close-on-press-escape="false"
    class="field-dialog"
  >
    <div class="filter-container">
      <div class="selected-fields">
        <div class="selected-box" ref="selectedBox">
          <div class="selected-group">
            <div v-for="(item, index) in records" :key="index">
              <div class="message">
                <div class="message__avatar">
                  <span
                    class="avatar avatar--circle"
                    shape="square"
                    style="width: 36px; height: 36px; line-height: 36px; font-size: 18px"
                  >
                    <img :src="item.fromUser.avatar" />
                  </span>
                </div>
                <div class="message__inner">
                  <div class="message__title">
                    <span>{{ item.fromUser.displayName }}</span>

                    <span class="message__time">
                      <span>|</span>
                      {{parseTime(item.send_time) }}
                    </span>
                  </div>
                  <div class="message__content-flex">
                    <div class="message__content" v-if="item.type == 'text' ">
                      <span v-html="item.content"></span>
                    </div>
                    <div class="message__content" v-if="item.type == 'file' ">
                      <el-button
                        icon="el-icon-link"
                        @click="downLoad(item)"
                      >{{ item.file_name}} ( {{ getfilesize(item.file_size)}})</el-button>
                    </div>
                    <div class="lemon-message__content" v-if="item.type == 'image' ">
                      <img
                        :src="item.content"
                        alt
                        @click="clickImage(item, records)"
                        style="cursor: pointer;"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-image
              class="previewImage"
              ref="preview"
              :fit="scale-down"
              :src="imageSrc"
              :preview-src-list="srcList"
              z-index="2050"
            ></el-image>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { download } from '@/utils/file'
export default {
  name: 'ForwardRecord',
  data() {
    return {
      // 记录列表
      records: [],
      // 窗口是否显示
      visible: false,
      //标题
      title: '',
      //图片列表
      srcList: [],
      //图片源
      imageSrc: '',
    }
  },
  methods: {
    // 显示窗口
    open(content) {
      this.records = content.message
      this.title = '会话记录(' + content.total + ')'
      console.log(this.records)
      this.visible = true
    },
    downLoad(message) {
      const fileExtension = message.content.substring(
        message.content.lastIndexOf('.') + 1
      )
      download(message.content, message.file_name, fileExtension, true)
    },
    clickImage(item, message) {
      while (this.srcList.length > 0) {
        this.srcList.pop()
      }
      for (let i = 0; i < message.length; i++) {
        if (message[i].type == 'image') this.srcList.push(message[i].content)
      }
      this.imageSrc = item.content
      this.$refs.preview.clickHandler()
    },
  },
}
</script>
<style lang="scss" scoped>
.lum-dialog-mask {
  z-index: 99999;
}

.lum-dialog-box {
  width: 500px;
  max-width: 500px;
  height: 600px;
}
.previewImage ::v-deep .el-image__preview {
  display: none;
}
.previewImage ::v-deep .el-image__error {
  display: none;
}
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
.message {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding: 10px 0;
}
.message__avatar {
  padding-right: 10px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.message__avatar .avatar {
  cursor: pointer;
}
.avatar {
  font-variant: tabular-nums;
  line-height: 1.5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  display: inline-block;
  text-align: center;
  background: #ccc;
  color: hsla(0, 0%, 100%, 0.7);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  border-radius: 4px;
}
.avatar img {
  width: 100%;
  height: 100%;
  display: block;
}
.message__inner {
  position: relative;
}
.message__content-flex,
.message__title {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.message__title {
  font-size: 12px;
  line-height: 16px;
  height: 16px;
  padding-bottom: 4px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #666;
}
.message__content-flex,
.message__title {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.message__title {
  font-size: 12px;
  line-height: 16px;
  height: 16px;
  padding-bottom: 4px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #666;
}

.message__time {
  color: #b9b9b9;
  padding: 0 5px;
  /* float: right; */
}
.message__content-flex,
.message__title {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.message__content {
  font-size: 14px;
  line-height: 20px;
  padding: 8px 10px;
  background: #fff;
  border-radius: 4px;
  position: relative;
  margin: 0;
}
.message-file__inner {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.filter-container::after {
  content: '';
  display: block;
  clear: both;
}

.box-head {
  margin-bottom: 15px;
  padding: 10px 0;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.all-fields,
.selected-fields {
  padding: 5px 10px;
  border: 1px solid #ddd;
  overflow-y: scroll;
  height: 500px;
}

.all-fields {
  margin-right: 2%;
  //width: 69%;
}

.checkAll {
  display: block;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #f7f9fc;
}

.all-fields ::v-deep .el-checkbox__label {
  font-size: 16px;
}
.all-fields ::v-deep .el-checkbox__inner {
  width: 16px;
  height: 16px;
  &::before {
    top: 6px;
  }
  &::after {
    top: 2px;
    left: 5px;
  }
}
.checkAll ::v-deep .el-checkbox__label {
  font-weight: bold;
}

.checkItem {
  margin: 0 0 10px 0;
  width: 33.333333%;
}
.checkItem:hover ::v-deep .el-checkbox__inner {
  border-color: #409eff;
}

.selected-group {
  margin-bottom: 15px;
  padding-bottom: 15px;
  &:last-child {
    border-bottom: none;
  }
}

.selected-item {
  position: relative;
  margin-bottom: 10px;
  padding: 10px 20px;
  background-color: #f8f8f8;
  border-radius: 10px;
  cursor: move;
  &--active {
    background-color: #ddd;
  }
  &:last-child {
    margin-bottom: 0;
  }

  .cancelItemBtn {
    position: absolute;
    top: 50%;
    right: 20px;
    margin-top: -8px;
    width: 16px;
    height: 16px;
    cursor: pointer;

    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      margin-top: -1px;
      width: 100%;
      height: 2px;
      background-color: #9f9f9f;
      transition: all 0.3s;
    }
    &::before {
      transform: rotate(45deg);
    }
    &::after {
      transform: rotate(-45deg);
    }

    &:hover {
      &::before,
      &::after {
        background-color: #f00;
      }
    }
  }
}
</style>
