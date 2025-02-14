const app = Vue.createApp({
  data() {
    return {
      jsonData: [],
      currentPage: 1,
      perPage: 20,
    };
  },
  created() {
    this.getDatas();
  },
  computed: {
    totalPage() {
      return Math.ceil(this.jsonData.length / this.perPage);
    },
    filterData() {
      return this.jsonData.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
  },
  methods: {
    getDatas() {
      const jsonUrl =
        "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
      fetch(jsonUrl, { method: "get" })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.jsonData = data.result.records;
        });
    },
    changePage(page) {
      this.currentPage = page;
    },
  },
});

app.component("cardbody", {
  props: ["item"],
  template: `
                <div class="py-2">
                          <div class="card h-100">
                            <div class="card bg-dark text-white text-left">
                              <img class="card-img-top img-cover" height="155" :src="item.Picture1">
                              <div class="card-img-overlay d-flex justify-content-between align-items-end p-0 px-3" style="background-color: rgba(0, 0, 0, .2)">
                                <h5 class="card-img-title-lg">{{item.Name}}</h5><h5 class="card-img-title-sm">{{item.Zone}}</h5>
                              </div>
                            </div>
                            <div class="card-body text-left">
                                <p class="card-text"><i class="far fa-clock fa-clock-time  text-primary"></i>&nbsp;{{item.Opentime}}</p>
                                <p class="card-text"><i class="fas fa-map-marker-alt fa-map-gps text-danger"></i>&nbsp;{{item.Add}}</p>
                                <p class="card-text"><i class="fas fa-mobile-alt fa-mobile text-info"></i>&nbsp;{{item.Tel}}</p>
                                <p class="card-text"><i class="fas fa-tags text-warning"></i>&nbsp;{{item.Ticketinfo ? item.Ticketinfo:'尚無資料'}}</p>
                            </div>
                          </div>
                        </div>
                        </div>
                        </div>
                        </div>`,
});
app.component("pagination", {
  props: ["currentPage", "totalPage"],
  methods: {
    changePage(page) {
      this.$emit("changePage", page);
    },
  },
  template: `<nav aria-label="Page navigation example">
                          <ul class="pagination">
                            <li class="page-item" :class="{disabled :currentPage == 1}">
                                <a class="page-link" href="#" @click.prevent="changePage(currentPage-1)">Previous</a>
                            </li>
                            <li class="page-item" :class="{active :currentPage == nowpage}" v-for="nowpage in totalPage" :key="nowpage">
                                <a class="page-link" href="#" @click.prevent="changePage(nowpage)">{{nowpage}}</a>
                            </li>
                            <li class="page-item" :class="{disabled :currentPage == totalPage}">
                                <a class="page-link" href="#" @click.prevent="changePage(currentPage+1)">Next</a>
                            </li>
                          </ul>
                        </nav>`,
});

app.mount("#app");

