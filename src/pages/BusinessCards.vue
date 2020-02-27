<template>
  <q-page class="q-pa-md">
    <!-- <div class="row q-gutter-sm">
      <q-btn
        color="info"
        label="Invertir Selección"
        icon="flip"
        @click="flipSelection"
        >
      </q-btn>
      <q-btn
        color="primary"
        label="Descargar"
        icon="cloud_download"
        @click="downloadTags"
        :disabled="!selected.length"
        :loading="btnLoaders.downloadTags"
        >
      </q-btn>
      <q-btn
        color="primary"
        label="Compartir"
        icon="share"
        @click="downloadTags"
        :disabled="!selected.length"
        :loading="btnLoaders.shareTags"
        >
      </q-btn>
    </div> -->
    <div class="row q-gutter-md q-mt-lg justify-center" v-if="staff">
      <template v-for="person in staff.managers">
        <q-card
          v-for="schedule in person.schedules"
          :key="person.id + schedule.id"
          :class="{'bussiness-card': true, 'selected': selected.includes(schedule.id)}"
          @click="toggleSelected(schedule.id)"
          >
          <q-card-section :class="['first']">
            <div class="name">{{ person.profile.full_name }}</div>
            <div class="job">{{ schedule.job_type.name }}</div>
          </q-card-section>
          <q-card-section :class="['second']">
            <div class="clinic line1">{{ scopeFullClinic.real_address.address_line_1 + ', ' + scopeFullClinic.postal_code + ' ' + scopeFullClinic.city}}</div>
            <div class="clinic line2">{{ 'Tel.: ' + scopeFullClinic.real_phone.number }}</div>
            <div class="clinic line3">{{ schedule.job_type.name }}</div>
          </q-card-section>
          <q-card-section :class="['third']">
            <div class="web">{{ 'www.dentix.com' }}</div>
          </q-card-section>
        </q-card>
      </template>
    </div>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'
import { PageMixins } from '../mixins/pageMixins'
import { StationaryMixins } from '../mixins/stationaryMixins'

export default {
  name: 'business-cards',
  mixins: [ModelsFetcher, PageMixins, StationaryMixins],
  data () {
    return {
      selected: []
    }
  }
}
</script>

<style lang="stylus">
  .bussiness-card {
    display: inline-block;
    width: 300px;
    text-align: center;
    color: $primary;
    &:hover {
      background-color: $primary;
      color: white;
      .q-card__section {
        &.second {
          color: $primary;
        }
      }
    }
    .q-card__section {
      padding: 0;
      &.first {
        margin-top: 25px;
        margin-bottom: 12px;
      }
      &.second {
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: $secondary;
        font-size: 10px;
        font-weight: 300;
      }
      &.third {
        margin-top: 10px;
        margin-bottom: 20px;
      }
      &.selected {
        background-color: $primary;
        color: white;
        border-color: white !important;
      }
    }
    .name {
      font-size: 20px;
      font-weight: 500;
    }
    .job {
      font-size: 12px;
      line-height 10px;
    }
  }
</style>
