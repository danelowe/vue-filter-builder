<template>
  <main>
    <h1>Vue filter builder</h1>
    <Filter v-if="results" v-model:filter="filterData" :config="results.filterConfig" @submit:filter="submitFilter"/>
    <DataTable
      v-if="results"
      v-model:filter="filterData"
      :headings="headings"
      :rows="results ? results.results : []"
      :loading="!results"
      :filter-config="results.filterConfig"
      @click:row="moderateReview($event.id)"
      @submit:filter="submitFilter"
    />

    <h2 class="my-4">Full Filter:</h2>
    <pre>{{ filterData }}</pre>
    <h2 class="my-4">Machine-readable filter string:</h2>
    <pre>{{ filterString }}</pre>
    <h2 class="my-4">Compressed Filter:</h2>
    <pre>{{ compressedFilter }}</pre>
    <h2 class="my-4">Filter Config</h2>
    <pre v-if="results">{{results.filterConfig}}</pre>
  </main>
</template>
<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import Filter from "/@/components/filter/Filter.vue";
import DataTable, {Heading} from "/@/components/common/DataTable.vue";
import DateCell from "/@/components/common/datatable/DateCell.vue";
import StateCell from "/@/components/common/datatable/StateCell.vue";
import RatingCell from "/@/components/review/RatingCell.vue";
import {useResults} from "/@/lib/useResults";
import {ResultSetReviewAdminListView} from "/@/api/model/ResultSetReviewAdminListView";
import {ReviewService} from "/@/api/services/ReviewService";
import {compressFilter} from "/@/lib/filterCompression";
import {filterAsString} from "/@/lib/filters";

export default defineComponent({
  components: {Filter, DataTable},
  setup() {
    const states = {
      approved: {label: 'Approved'},
      not_approved: {label: 'Not Approved'},
      pending: {label: 'Pending'},
      expired: {label: 'Expired'},
    }
    const headings: Heading[] = [
      { key: 'createdAt', label: 'Created', component: DateCell },
      { key: 'status', label: 'Status', component: StateCell, cellComponentProps: { states } },
      { key: 'title', label: 'Title'},
      { key: 'nickname', label: 'Nickname'},
      { key: 'detail', label: 'Review'},
      { key: 'productName', label: 'Product' },
      { key: 'imageCount', label: 'Images'},
      { key: 'rating', label: 'Rating', component: RatingCell },
    ]
    function moderateReview(id: number) {
      console.log(`open moderation modal for review: ${id}`)
    }
    const { results, filterData, submitFilter } = useResults<ResultSetReviewAdminListView>(ReviewService.listReviews)
    const filterString = computed(() => results.value ? filterAsString(filterData.value, results.value?.filterConfig, false) : '')
    const compressedFilter = computed(() => results.value ? compressFilter(filterData.value, results.value?.filterConfig) : '')
    return {results, submitFilter, filterData, headings, moderateReview, filterString, compressedFilter}
  }

})
</script>
