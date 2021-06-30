export default {
  methods: {
    changeDrawer(contact) {
      const IMUI = this.$refs.IMUI;
      if (IMUI.drawerVisible === true) {
        IMUI.closeDrawer();
      } else {
        const params = {
          render: contact => {
            return <group-drawer contact={contact}></group-drawer>;
          }
        };
        params.offsetY = 1;
        IMUI.openDrawer(params);
      }
    },
    initMultiMenu() {
      //初始化多选工具
      var dom = document.createElement("div");
      dom.setAttribute("class", "multi");
      dom.setAttribute("style", "display:none");
      dom.innerHTML =
        '<div class="multi-select"><div class="multi-title"><span">已选中：<span id="checkMessage">0</span> 条消息</span></div><div class="multi-main"><div class="btn-group"><div class="multi-icon pointer"  onClick="mergeForward()"><i class="el-icon-position"></i></div><p>合并转发</p></div><div class="btn-group"><div class="multi-icon pointer" onClick="oneByoneForward()"><i class="el-icon-position"></i></div><p>逐条转发</p></div><div class="btn-group"><div class="multi-icon pointer" onclick="multiDeleteContact()"><i class="el-icon-delete"></i></div><p >批量删除</p></div><div class="btn-group"><div class="multi-icon pointer" onClick="closeMulti()"><i class="el-icon-close" ></i></div><p >关闭</p></div></div></div>';
      const that = this;
      window.closeMulti = function() {
        that.closeMulti();
      };
      window.mergeForward = function() {
        that.mergeForward();
      };
      window.oneByoneForward = function() {
        that.oneByoneForward();
      };
      window.multiDeleteContact = function() {
        that.multiDeleteContact();
      };
      document.querySelector(".lemon-editor").appendChild(dom);
    },
    closeMulti() {
      $(".lemon-editor")
        .find("*")
        .each(function(i, o) {
          if ($(o).hasClass("lemon-editor__tool")) $(this).show();
          if ($(o).hasClass("lemon-editor__inner")) $(this).show();
          if ($(o).hasClass("lemon-editor__footer")) $(this).show();
          if ($(o).hasClass("multi")) $(this).hide();
        });
      $(".lemon-container")
        .find("*")
        .each(function(i, o) {
          if (
            $(o).hasClass("lemon-message-text") ||
            $(o).hasClass("lemon-message-file") ||
            $(o).hasClass("lemon-message-image") ||
            $(o).hasClass("lemon-message-forward") ||
            $(o).hasClass("lemon-message-video")
          ) {
            $(this).css("border", "");
            $(this).css("margin-top", "");
          }
        });
      $(".lemon-container")
        .find("*")
        .each(function(i, o) {
          if (
            ($(o).hasClass("lemon-message-text") ||
              $(o).hasClass("lemon-message-file") ||
              $(o).hasClass("lemon-message-image") ||
              $(o).hasClass("lemon-message-forward") ||
              $(o).hasClass("lemon-message-video")) &&
            !$(o).hasClass("lemon-message--reverse")
          ) {
            $(this).css("padding-left", "");
          }
        });
      this.multiMessage = [];
      this.multi = false;
      $("#checkMessage").html(0);
    },
    messageInitEvent(data, IMUI) {
      this.user = data.user_info;
      //初始化联系人 (使用lastContentRender将图片 文件类型转换)
      for (let i = 0; i < data.user_contact.length; i++) {
        if (
          data.user_contact[i].lastContent != "" &&
          data.user_contact[i].lastContentType != ""
        ) {
          data.user_contact[i].lastContent = IMUI.lastContentRender({
            type: data.user_contact[i].lastContentType,
            content: data.user_contact[i].lastContent
          });
        }
      }
      for (let i = 0; i < data.user_group.length; i++) {
        if (
          data.user_group[i].lastContent != "" &&
          data.user_group[i].lastContentType != ""
        ) {
          data.user_group[i].lastContent = IMUI.lastContentRender({
            type: data.user_group[i].lastContentType,
            content: data.user_group[i].lastContent
          });
        }
      }
      let contact = data.user_contact.concat(data.user_group);
      //初始化用户
      IMUI.initContacts(contact);
      //自动定位到最新消息
      IMUI.messageViewToBottom();
    },
    messageFriendHistoryEvent(data, IMUI) {
      this.messages = data;
      this.next(this.messages.friend_history_message, true);
    },
    messageGroupHistoryEvent(data, IMUI) {
      this.messages = data;
      this.next(this.messages.group_history_message, true);
    },
    friendWithdrawMessageEvent(data, IMUI) {
      let message = data.message;
      const appendMessag = {
        id: generateRandId(),
        type: "event",
        content: '"' + message.fromUser.displayName + '" 撤回了一条消息',
        toContactId: message.fromUser.id,
        sendTime: getTime()
      };
      IMUI.removeMessage(message.id);
      IMUI.appendMessage(appendMessag, true);
    },
    friendOnlineMessageEvent(data, IMUI) {
      //判断是否显示消息通知
      if (
        this.settingDialogData.friendOnlineNotice &&
        !data.message.is_reconnection
      ) {
        this.$notify.warning({
          title: '你的好友 "' + data.message.user_info.desc + '" 已上线',
          duration: 2000,
          position: "bottom-right",
          offset: 100,
          message: "来自系统通知"
        });
      }
      //播放收到信息音频
      if (
        this.settingDialogData.friendOnlineNoticeTone &&
        !data.message.is_reconnection
      ) {
        this.playAudio("friendOnlineTone.mp3");
      }
      IMUI.updateContact({
        id: data.message.uid,
        status: data.message.online_status
      });
    },
    friendOfflineMessageEvent(data, IMUI) {
      IMUI.updateContact({
        id: data.message.uid,
        status: data.message.online_status
      });
    },
    createGroupEvent(data, IMUI) {
      let contact = data.message.group_info;
      IMUI.appendContact(contact);
    },
    editGroupEvent(data, IMUI) {
      //判断是否是创建组
      let groupInfo = data.message.group_info;
      IMUI.updateContact({
        id: data.message.toContactId,
        avatar: groupInfo.avatar,
        displayName: groupInfo.group_name,
        introduction: groupInfo.introduction,
        size: groupInfo.size,
        validation: groupInfo.validation
      });
      IMUI.appendMessage(data.message, true);
    },
    newMemberJoinGroupEvent(data, IMUI) {
      let contact = data.message.group_info;
      IMUI.appendContact(contact);
    },
    groupMemberExitEvent(data, IMUI) {
      IMUI.appendMessage(data.message, true);
      IMUI.updateContact({
        id: data.message.toContactId,
        group_member: data.message.group_member,
        member_total: data.message.member_total
      });
      if (this.user.id == data.message.uid) {
        IMUI.removeContact(data.message.toContactId);
      }
    },
    deleteGroupMemberEvent(data, IMUI) {
      IMUI.appendMessage(data.message, true);
      IMUI.updateContact({
        id: data.message.toContactId,
        group_member: data.message.group_member,
        member_total: data.message.member_total
      });
      if (this.user.id == data.message.uid) {
        IMUI.removeContact(data.message.toContactId);
        this.$confirm(
          '你已被移除 "' + data.message.displayName + '" 群聊',
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
      }
    },
    deleteGroup(data, IMUI) {
      IMUI.removeContact(data.message.toContactId);
      if (this.user.id != data.message.uid) {
        this.$confirm(data.message.content, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
      }
    },
    changeGroupMemberLevel(data, IMUI) {
      IMUI.appendMessage(data.message, true);
      IMUI.updateContact({
        id: data.message.toContactId,
        group_member: data.message.group_member,
        member_total: data.message.member_total
      });
      if (data.message.uid == this.user.id) {
        IMUI.updateContact({
          id: data.message.toContactId,
          level: data.message.level
        });
      }
    },
    changeGroupAvatar(data, IMUI) {
      IMUI.updateContact({
        id: data.message.toContactId,
        avatar: data.message.avatar
      });
    },
    getSendMessage(data, IMUI) {
      IMUI.appendMessage(data.message, true);
      //判断是否显示消息通知
      if (this.settingDialogData.messagePagePrompt) {
        this.$notify.warning({
          title: "你有一条新的消息",
          duration: 2000,
          position: "bottom-right",
          offset: 100,
          message: '来自："' + data.message.fromUser.displayName + '"'
        });
      }
      //播放收到信息音频
      if (this.settingDialogData.messageTone) {
        this.playAudio(this.settingDialogData.messageToneType);
      }
      IMUI.messageViewToBottom();
    },
    handlePullMessages(contact, next) {
      const that = this;
      let uri =
        contact.is_group == 0 ? "/friend/pull_message" : "/group/pull_message";
      let data = {
        message: {
          contact_id: contact.id,
          user_id: this.user.id
        },
        uri: uri
      };
      this.socket.send(JSON.stringify(data));
      this.next = next;
    },
    handleSend(message, next, file) {
      //执行到next消息会停止转圈，如果接口调用失败，可以修改消息的状态 next({status:'failed'});
      //调用你的消息发送业务接口
      //先判断是否为图片上传，此处主要针对粘贴图片无法重写组件

      if (message.content.indexOf("blob:") != -1) {
        fileByBase64(file, base64 => {
          let params = {
            savePath: "chat/group",
            file: base64
          };
          uploadPicByBase64(params)
            .then(response => {
              if (response.code == 200) {
                message.content = response.data.url;
                let uri =
                  typeof message.toContactId == "number"
                    ? "/friend/send_message"
                    : "/group/send_message";
                this.send(message, uri);
                next();
              }
            })
            .catch(() => {
              next({ status: "failed" });
            });
        });
      } else {
        let uri =
          typeof message.toContactId == "number"
            ? "/friend/send_message"
            : "/group/send_message";
        this.send(message, uri);
        next();
      }
    },
    handleChangeContact(contact, instance) {
      instance.updateContact({
        id: contact.id,
        unread: 0
      });
      this.historyMessageDialogData.contact_id = contact.id;
      instance.closeDrawer();
      instance.messageViewToBottom();
      this.closeMulti();
    },
    handleMessageClick(event, key, Message, instance) {
      if (Message.type == "image") {
        this.imageSrc = Message.content;
        while (this.srcList.length > 0) {
          this.srcList.pop();
        }
        for (let i = 0; i < instance.getCurrentMessages().length; i++) {
          if (instance.getCurrentMessages()[i].type == "image")
            this.srcList.push(instance.getCurrentMessages()[i].content);
        }
        this.$refs.preview.clickHandler();
      }
    },
    handleCreateGroup(instance) {
      this.createGroupDialogData.visible = true;
      this.createGroupDialogData.contacts = instance.contacts.filter(function(
        item
      ) {
        if (item.is_group != 1) return item;
      });
      this.createGroupDialogData.creator = instance.user;
    },
    handleOpenGroupTool(type, contact) {
      if (type == "group_file") this.groupTool.groupFileDialogVisible = true;
      if (type == "group_notice")
        this.groupTool.groupNoticeDialogVisible = true;
      if (type == "group_album") this.groupTool.groupAlbumDialogVisible = true;
      if (type == "group_invite")
        this.groupTool.groupInviteDialogVisible = true;
      if (type == "group_member_manage")
        this.groupTool.groupMemberManageDialogVisible = true;
      if (type == "group_edit") this.groupTool.groupEditDialogVisible = true;
      if (type == "group_exit") {
        this.$confirm("确认退出该群，操作不可逆, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let message = {
              group_id: contact.id,
              uid: this.user.id
            };
            this.send(message, "/group/exit_group", "POST");
          })
          .catch(() => {});
      }
      if (type == "group_delete") {
        this.$confirm("确认解散该群，操作不可逆, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let message = {
              group_id: contact.id,
              uid: this.user.id
            };
            this.send(message, "/group/delete_group", "POST");
          })
          .catch(() => {
            this.msgError("操作失败，请重试");
          });
      }
      this.groupTool.contact = contact;
      this.groupTool.type = type;
      this.groupTool.user = this.user;
      this.$refs["groupToolRef"].init();
    },
    composeValue(type, row) {
      return {
        command: type,
        contact: row
      };
    },
    handleCommand(command) {
      this.handleOpenGroupTool(command.command, command.contact);
    },
    sendEditGroup(group) {
      group.uid = this.user.id;
      this.send(group, "/group/edit_group", "POST");
      this.msgSuccess("修改群公告成功");
    },
    sendCreateGroup(group) {
      group.creator = this.createGroupDialogData.creator;
      this.send(group, "/group/create_group", "POST");
    },
    sendInviteGroupMember(group, newJoinGroupMember) {
      const { IMUI } = this.$refs;
      let newGroup = JSON.parse(JSON.stringify(group));
      newGroup.newJoinGroupMember = newJoinGroupMember;
      this.send(newGroup, "/group/invite_group_member", "POST");
    },
    sendDeleteGroupMember(group) {
      this.send(group, "/group/delete_group_member", "POST");
      this.msgSuccess("删除组员成功");
    },
    sendChangeGroupLevel(group) {
      this.send(group, "/group/change_group_member_level", "POST");
      this.msgSuccess("更改组员等级成功");
    },
    beforeFileUpload(file, dataObj, type) {
      const { IMUI } = this.$refs;
      const message = {
        id: dataObj.messageId,
        status: "going",
        type: type,
        sendTime: Date.parse(new Date()),
        content: "",
        fileSize: file.size,
        fileName: file.name,
        fileExt: "",
        toContactId: IMUI.getCurrentContact().id,
        fromUser: {
          id: this.user.id,
          displayName: this.user.displayName,
          avatar: this.user.avatar
        }
      };
      this.$set(this.messagesToBeSend, message.id, message);
      this.$set(this.fileIdToMessageId, file.uid, message.id);
      IMUI.appendMessage(message, true);
    },
    afterFileUpload(res, file) {
      const { IMUI } = this.$refs;
      if (res.code != 200) {
        this.$message({
          showClose: true,
          message: res.msg,
          type: "error"
        });
        IMUI.updateMessage({
          id: this.fileIdToMessageId[file.uid],
          status: "failed"
        });
      } else {
        IMUI.updateMessage({
          id: res.data.messageId,
          content: res.data.url,
          fileExt: res.data.fileExt,
          status: "succeed"
        });
        let messageId = res.data.messageId;
        let uri =
          typeof this.messagesToBeSend[messageId].toContactId == "number"
            ? "/friend/send_message"
            : "/group/send_message";
        this.send(this.messagesToBeSend[messageId], uri);
      }
      delete this.messagesToBeSend[res.data.messageId];
      delete this.fileIdToMessageId[file.uid];
    },
    querySearch(queryString, cb) {
      const { IMUI } = this.$refs;
      var contacts = IMUI.getContacts();

      var results = queryString
        ? contacts.filter(this.createFilter(queryString))
        : contacts;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return contact => {
        return (
          contact.displayName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      const { IMUI } = this.$refs;
      IMUI.changeContact(item.id);
    },
    handleChangeMenu() {
      const { IMUI } = this.$refs;
      IMUI.closeDrawer();
      this.closeMulti();
    },
    mergeForward() {
      const { IMUI } = this.$refs;
      //如果选中消息大于两条才显示
      if (this.multiMessage.length >= 2) {
        for (let i = 0; i < this.multiMessage.length; i++) {
          if (this.multiMessage[i].type == "forward") {
            this.$notify({
              title: "消息转发",
              message: "会话记录不支持合并转发",
              type: "warning",
              offset: 100
            });
            return;
          }
        }
        this.forwardTool.dialogVisible = true;
        this.forwardTool.contact = IMUI.getContacts();
        this.forwardTool.contactsSource = IMUI.getContacts();
        this.forwardTool.multiMessage = this.multiMessage;
        this.forwardTool.type = "mergeForward";
        this.forwardTool.user = this.user;
      }
    },
    oneByoneForward(message) {
      const { IMUI } = this.$refs;
      if (message != "" && message != undefined && message != null) {
        //如果选中消息大于两条才显示
        this.forwardTool.dialogVisible = true;
        this.forwardTool.contact = IMUI.getContacts();
        this.forwardTool.contactsSource = IMUI.getContacts();
        this.forwardTool.multiMessage = [message];
        this.forwardTool.type = "oneByOneForward";
        this.forwardTool.user = this.user;
      } else {
        //如果选中消息大于两条才显示
        if (this.multiMessage.length >= 2) {
          this.forwardTool.dialogVisible = true;
          this.forwardTool.contact = IMUI.getContacts();
          this.forwardTool.contactsSource = IMUI.getContacts();
          this.forwardTool.multiMessage = this.multiMessage;
          this.forwardTool.type = "oneByOneForward";
          this.forwardTool.user = this.user;
        }
      }
    },
    multiDeleteContact() {
      const { IMUI } = this.$refs;
      for (let i = 0; i < this.multiMessage.length; i++) {
        IMUI.removeMessage(this.multiMessage[i].id);
      }
      this.closeMulti();
    },
    insertContent(content) {
      if (!content) {
        //如果插入的内容为空则返回
        return;
      }
      let sel = null;
      if (document.selection) {
        //IE9以下
        sel = document.selection;
        sel.createRange().pasteHTML(content);
      } else {
        sel = window.getSelection();
        if (sel.rangeCount > 0) {
          let range = sel.getRangeAt(0); //获取选择范围
          range.deleteContents(); //删除选中的内容
          let el = document.createElement("div"); //创建一个空的div外壳
          el.innerHTML = content; //设置div内容为我们想要插入的内容。
          let frag = document.createDocumentFragment(); //创建一个空白的文档片段，便于之后插入dom树

          let node = el.firstChild;
          let lastNode = frag.appendChild(node);
          range.insertNode(frag); //设置选择范围的内容为插入的内容
          let contentRange = range.cloneRange(); //克隆选区
          contentRange.setStartAfter(lastNode); //设置光标位置为插入内容的末尾
          contentRange.collapse(true); //移动光标位置到末尾
          sel.removeAllRanges(); //移出所有选区
          sel.addRange(contentRange); //添加修改后的选区
        }
      }
    }
  }
};
