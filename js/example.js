const jsonUrl =
  "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
const app = Vue.createApp({
  data() {
    return {
      data: [],
      pageData: {},
      filterData: [],
    };
  },
  methods: {
    pagination(nowPage) {
      //1.數據總數
      const dataTotal = this.data.length;
      const perPage = 20; //2.設定一頁20筆
      //3.取得總頁數
      const pageTotal = Math.ceil(dataTotal / perPage);
      let currentPage = nowPage;
      //防呆 若currentPage超過總頁數，則重置為最後一頁
      if (currentPage > perPage) {
        currentPage = pageTotal;
      }
      //4.計算每個分頁的數據範圍
      const minData = currentPage * 20 - 20 + 1;
      const maxData = currentPage * 20;

      //5.將範圍的數據存在陣列
      const newData = [];

      this.data.forEach((item, index) => {
        const num = index + 1;
        if (num >= minData && num <= maxData) {
          newData.push(item);
        }
      });

      this.pageData = {
        pageTotal,
        currentPage,
        hasPage: currentPage > 1,
        hasNext: currentPage < pageTotal,
      };
      this.filterData = newData;
    },
  },
  async mounted() {
    await axios
      .get(jsonUrl, {}, {})
      .then((res) => {
        this.data = res.data.result.records;
        this.pagination(1);
        console.log("this.data:" + JSON.stringify(this.data));
      })
      .catch((msg) => {
        console.error("msg:" + JSON.stringify(msg));
      });
  },
});
//6.卡片
app.component("card", {
  name: "Card",
  props: ["item"],
  template: `<div class="col-md-6 py-2">
                        <div class="card">
                            <div class="card  text-left">
                                <img :src="item.Picture1" alt="" class="card-img-top img-cover" height="155">
                                <div class="text-white card-img-overlay d-flex justify-content-between align-items-end p-0 px-3"
                                    style="background-color: rgba(0, 0, 0, .2)">
                                    <h5 class="card-img-title-lg">{{item.Name}}</h5>
                                    <h5 class="card-img-title-sm">{{item.Zone}}</h5>
                                </div>
                            </div>
                            <div class="card-body text-left">
                                <p class="card-text"><i class="far fa-clock fa-clock-time"></i>&nbsp;{{item.Opentime}}
                                </p>
                                <p class="card-text"><i class="fas fa-map-marker-alt fa-map-gps"></i>&nbsp;{{item.Add}}
                                </p>
                                <p class="card-text"><i class="fas fa-mobile-alt fa-mobile"></i>&nbsp;{{item.Tel}}</p>
                                <div v-if="item.Ticketinfo !== ''">
                                    <p class="card-text"><i
                                            class="fas fa-tags text-warning"></i>&nbsp;{{item.Ticketinfo}}</p>
                                </div>
                            </div>
    
                        </div>
                    </div>`,
});
//7.分頁製作
app.component("page", {
  name: "Page",
  // props: {
  //     nowPage: {
  //         type: Object,
  //         default: () => ({
  //             pageTotal: 1,
  //             currentPage: 1,
  //             hasPage: false,
  //             hasNext: false
  //         })
  //     },
  // },
  props: ["nowPage"],
  emits: ["now-page"],
  template: `
    <li class="page-item">
      <button class="page-link"
        :disabled="!nowPage.hasPage"
        @click.prevent="switchPage(nowPage.currentPage - 1)">
        Previous
      </button>
    </li>
    
    <li class="page-item" v-for="(item, index) in nowPage.pageTotal" :key="'item' + index" :class="{ 'active': item === nowPage.currentPage }">
      <button class="page-link" @click.prevent="switchPage(item)">
        {{item}}
      </button>
    </li>
    
    <li class="page-item">
      <button class="page-link"
        :disabled="!nowPage.hasNext"
        @click.prevent="switchPage(nowPage.currentPage + 1)">
        Next
      </button>
    </li>
    `,
  data() {
    return {};
  },
  methods: {
    switchPage(nowPage) {
      this.$emit("now-page", nowPage);
    },
  },
  mounted() {},
});
app.mount("#app");
