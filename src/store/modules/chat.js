import {
  setStore,
  getStore,
  removeStore
} from '@/utils/store'


const chat = {

state: {
  theme: getStore({
    name: 'theme'
  }) || '#409EFF',
    bg:"主题颜色"
},
mutations: {
    SET_THEME: (state, color) => {
    state.theme = color
    setStore({
      name: 'theme',
      content: state.theme
    })
  },

}
}
export default chat