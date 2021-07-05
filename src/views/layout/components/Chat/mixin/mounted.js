import EmojiData from "../database/emoji";
export default {
  mounted() {
    this.$nextTick(() => {
      const { IMUI } = this.$refs;
      console.log(IMUI.$refs.editor.getFormatValue());
      this.$watch(
        function() {
          return IMUI.getEditorValue();
        },
        (val, oval) => {
          console.log(val);
        },
        {
          deep: true
        }
      );
      //初始化表情包。
      IMUI.initEmoji(EmojiData);
      IMUI.setLastContentRender("forward", message => {
        return <span>[会话记录]</span>;
      });
      IMUI.setLastContentRender("video", message => {
        return <span>[视频]</span>;
      });
      //初始化工具栏
      IMUI.initEditorTools([
        {
          name: "emoji"
        },
        {
          name: "uploadImage",
          click: () => {
            this.$refs["picUploadCom"].$refs[
              "fileUpload"
            ].$children[0].$refs.input.click();
          }
        },
        {
          name: "uploadVideo",
          click: () => {
            this.$refs["videoUploadCom"].$refs[
              "fileUpload"
            ].$children[0].$refs.input.click();
          },
          title: "视频上传",
          render: () => {
            return <svg-icon class-name="search-icon" icon-class="video" />;
          }
        },
        {
          name: "uploadFile",
          click: () => {
            this.$refs["fileUploadCom"].$refs[
              "fileUpload"
            ].$children[0].$refs.input.click();
          }
        },
        {
          name: "history_message",
          isRight: true,
          title: "历史记录",
          click: () => {
            this.historyMessageDialogData.visible = true;
            this.$refs["historyMessageRef"].init();
          },
          render: () => {
            return (
              <svg-icon class-name="search-icon" icon-class="history_message" />
            );
          }
        }
      ]);
      IMUI.initMenus([
        {
          name: "messages"
        },
        {
          name: "contacts"
        },
        {
          name: "setting",
          title: "设置",
          unread: 0,
          click: () => {
            this.settingDialogData.visible = true;
          },
          render: menu => {
            return <i class="el-icon-setting"></i>;
          },
          isBottom: true
        }
      ]);
      this.initMultiMenu();

      let that = this;
      // $(".lemon-editor__input").on("DOMCharacterDataModified", function(e) {
      // let content = $(".lemon-editor__input").text();
      // if (content.charAt(content.length - 1) === "@") {
      //   console.log(1);
      //   console.log($("#linyiyuan"));
      //   if ($("#linyiyuan").length > 0) {
      //     console.log(123);
      //     $("#linyiyuan").show();
      //     return;
      //   }

      //   let imgTag = `<div id="linyiyuan" class="linyiyuan" style="position: absolute;top: 20px;left: 20px;"><select><option>用户1</option><option>用户2</option><option>用户3</option><option>用户4</option><option>用户5</option></select><div>`;
      //   that.insertContent(imgTag);
      // } else {
      //   console.log(2);
      //   $("#linyiyuan").hide();
      // }
      // });
      // document.onkeyup = e => {
      //   if (e.shiftKey && e.key == "@") {
      //     let imgTag = `<div id="linyiyuan" class="linyiyuan" style="position: absolute;top: 20px;left: 20px;"><select><option>用户1</option><option>用户2</option><option>用户3</option><option>用户4</option><option>用户5</option></select><div>`;
      //     that.insertContent(imgTag);
      //   } else {
      //     $("#linyiyuan").hide();
      //   }
      // };
    });
  }
};
