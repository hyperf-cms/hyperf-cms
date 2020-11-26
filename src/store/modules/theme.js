/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

import {
    setStore,
    getStore,
    removeStore
} from '@/utils/store'
import {
    validatenull
} from '@/utils/validate'


const theme = {

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
export default theme