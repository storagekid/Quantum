// import something here
import ModelTable from '../components/model/ModelTable'
import GenericDataLoading from '../components/loaders/GenericDataLoading'

// leave the export, even if you don't use it
export default async ({ app, router, Vue }) => {
  Vue.use(ModelTable)
  Vue.use(GenericDataLoading)
  Vue.component('model-table', ModelTable)
  Vue.component('generic-data-loading', GenericDataLoading)
}
