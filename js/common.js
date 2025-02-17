// 側選單
const App = Vue.createApp({
  data() {
    return {
      dataStore: [],
      currentPage: 1,
      cacheSearch: "",
      searchData: "",
    };
  },
  methods: {
    async fetchApi() {
      try {
        const response = await axios.get("https://dummyjson.com/recipes");
        console.log("success");
        this.dataStore = response.data.recipes;
      } catch (error) {
        console.error("error", error);
      }
    },
    switchPage(page) {
      this.currentPage = page;
    },
    searchFunc(){
      this.cacheSearch = this.searchData;
    },
  },
  computed: {
    // 不需要在 data() 內宣告 totalPage，因為 computed 會一直監聽並動態計算
    // computed 會產生新的值 不會改動到原始data值
    // totalPage 是一個新的變數
    filterData() {
      // 如果cacheSearch有值 則開始搜索過濾
      if (this.cacheSearch) {
        // filter 搭配 includes 會回傳true 或 false
        // toLowerCase 是代表無論大小寫都匹配
        return this.dataStore.filter((item) =>
          item.name.toLowerCase().includes(this.cacheSearch.toLowerCase())
        );
      }
      // 如果 cacheSearch是空值則直接return
      return this.dataStore;
    },
    totalPage() {
      return Math.ceil(this.filterData.length / 8);
    },
    // nowPageStore 是一個新的變數 儲存用過濾過後的array
    // 並且再依據數量分頁
    nowPageStore() {
      // slice 寫法
      const start = (this.currentPage - 1) * 8;
      const end = start + 8;
      // return nowPageStore一個array 這個array是從filterData slice過後的array
      return this.filterData.slice(start, end);
    },
  },
  created() {
    this.fetchApi();
  },
});
App.component("recipeCard", {
  // 只有要從父層接收資料render
  props: ["recipe"],
  template: `
          <div class="project" v-for="(i,key) in recipe" :key="i">
            <!-- banner -->
            <div class="banner">
              <a target="_blank"> <img :src="i.image" /></a>
              <div class="mask">
                <label class="seemore">see more</label>
              </div>
            </div>
            <!-- text -->
            <div class="secText">
              <h2 class="projectTitle">{{i.name}}</h2>
              <p>Rating<span>{{i.rating}}</span></p>
              <div class="skillWrap">
                <label v-for="(tag,key) in i.tags" :key="i + 'tag'"
                  >{{ tag }}</label
                >
              </div>
            </div>
          </div>`,
}),
  App.component("pagination", {
    data() {
      return {
        page: 1,
      };
    },
    props: ["totalPage", "currentPage"],
    methods: {
      switchPage(page) {
        this.$emit("emit-switchPage", page);
      },
    },
    template: `      
      <div class="pageNavigation">
        <ul class="pagination">
          <li class="page-item" :class="{'disabled': currentPage === 1}">
            <a href="#" @click.prevent="switchPage(currentPage-1)">Previous</a>
          </li>
          <li class="page-item" v-for="(page , key) in totalPage" :key="'page'+ key" :class= "{'active': currentPage === page }" >
            <a href="#" @click.prevent="switchPage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{'disabled': currentPage === totalPage }">
            <a href="#" @click.prevent="switchPage(currentPage+1)">Next</a>
          </li>
        </ul>
      </div>`,
  });
App.mount("#app");
