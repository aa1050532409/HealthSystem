import { Get } from '../../http/request.js'
import store from '../../store/index.js';
// import { keyFor } from 'core-js/fn/symbol';

//获取推荐广告函数
export function getAdvertisement() {

    if (store.getters.recommend.imgList == false) {
        store.state.loadingState = true
        Get('/api/recommend').then(res => {
            store.state.loadingState = false
            //commit只能传一个参数，把两个参数组成一个数组传递进去
            store.commit('recommend', [res.data.imgList, res.data.collapseDate])
        })
    }
}
