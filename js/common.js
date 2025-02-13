// 側選單
const App = {
  data() {
    return {
      dataStore:[], 
    };
  },
  methods:{
    async fetchApi(){
      try{
        const response = await axios.get(
          "https://dummyjson.com/recipes"
        );
        console.log("success");
        this.dataStore = response.data.recipes
      }
      catch(error){
        console.error("error", error)
      };
    }
  },
  created(){
    this.fetchApi();
  }
};
Vue.createApp(App).mount("#app");
