import {
  setStore,
  getStore,
  removeStore
} from '@/utils/store'


const chat = {

state: {
  sendKey: getStore({name:'lemon-sendKey'}) || ((e) => e.keyCode == 13 && e.ctrlKey),
  sendText:  getStore({name:'lemon-sendText'}) || "",
  theme: getStore({name: 'lemon-theme'}) || 'blue',
  avatarCricle: getStore({name: 'lemon-avatarCricle'}) || false,
  hideMessageName: getStore({name: 'lemon-hideMessageName'}) || false,
  hideMessageTime: getStore({name: 'lemon-hideMessageTime'}) || false,
  messagePagePrompt: getStore({name: 'lemon-messagePagePrompt'}) && true,
  messageTone: getStore({name: 'lemon-messageTone'}) && true,
  messageToneType: getStore({name: 'lemon-messageToneType'}) || 'messageTone1.mp3',
},
mutations: {
  SET_SEND_KEY: (state, sendKey) => {
    state.sendKey = sendKey
    setStore({
      name: 'lemon-sendKey',
      content: state.sendKey
    })
  },

  SET_LEMON_THEME: (state, theme) => {
    state.theme = theme
    setStore({
      name: 'lemon-theme',
      content: state.theme
    })
  },

  SET_AVATAR_CRICLE: (state, avatarCricle) => {
    state.avatarCricle = avatarCricle
    setStore({
      name: 'lemon-avatarCricle',
      content: state.avatarCricle
    })
  },
  
  SET_HIDE_MESSAGE_NAME: (state, hideMessageName	) => {
    state.hideMessageName	 = hideMessageName	
    setStore({
      name: 'lemon-hideMessageName',
      content: state.hideMessageName	
    })
  },
  SET_HIDE_MESSAGE_TIME: (state, hideMessageTime	) => {
    state.hideMessageTime	 = hideMessageTime	
    setStore({
      name: 'lemon-hideMessageTime',
      content: state.hideMessageTime	
    })
  },
  SET_MESSAGE_PAGE_PROMPT: (state, messagePagePrompt	) => {
    state.messagePagePrompt	 = messagePagePrompt	
    setStore({
      name: 'lemon-messagePagePrompt',
      content: state.messagePagePrompt	
    })
  },
  SET_MESSAGE_TONE: (state, messageTone	) => {
    state.messageTone	 = messageTone	
    setStore({
      name: 'lemon-messageTone',
      content: state.messageTone	
    })
  },
  SET_MESSAGE_TONE_TYPE: (state, messageToneType	) => {
    state.messageToneType	 = messageToneType	
    setStore({
      name: 'lemon-messageToneType',
      content: state.messageToneType	
    })
  },

}

}
export default chat