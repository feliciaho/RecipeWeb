// 側選單
const App = Vue.createApp({
  data() {
    return {
      dataStore:[],
      currentPage: 1,
      nowPageStore:[],
    };
  },
  methods:{
    async fetchApi(){
      try{
        const response = await axios.get(
          "https://dummyjson.com/recipes"
        );
        console.log("success");
        this.dataStore = response.data.recipes;
        this.pageFunc();
      }
      catch(error){
        console.error("error", error)
      };
    },
    pageFunc(){
      this.nowPageStore=[];
      const minData = ((this.currentPage-1)*8)+1;
      const maxData = this.currentPage*8;
      this.dataStore.forEach((el, index) => {
        if( maxData>= index && index >= minData){
          this.nowPageStore.push(el)
        }
      });
    },
    switchPage(page){
      this.currentPage = page;
      this.pageFunc();
    }
  },
  created(){
    this.fetchApi();
  },
  computed:{
    // 不需要在 data() 內宣告 totalPage，因為 computed 會一直監聽並動態計算
    // computed 會產生新的值 不會改動到原始data值
    // totalPage 是一個新的變數
    totalPage(){
      return  Math.ceil(this.dataStore.length / 8 );
    },
  },
});
App.component("recipeCard",{
  // 只有要從父層接收資料render
  props:['recipe'],
  template:`
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
App.component("pagination",{

})
App.mount("#app");
