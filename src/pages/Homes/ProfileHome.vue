<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-sm-12 col-md-3">
        <q-card class="my-card">
          <q-img :src="profile.imageData ? profile.imageData : require('../../assets/profile.png')">
          </q-img>
          <q-uploader
            class="full-width hidden"
            ref="uploader"
            no-thumbnails
            auto-upload
            url=""
            :upload-factory="uploadFile"
            label="Elige una imagen de Perfil"
            :hide-upload-button="true"
            :hide-upload-progress="true"
            @added="uploadFilesAdded($event)"
          />
          <q-card-actions class="justify-between">
            <q-btn text-color="primary" flat icon="edit" @click="startUploader"></q-btn>
            <q-btn color="primary"  @click="restoreImage" v-if="imageChanged">Deshacer</q-btn>
            <q-btn color="primary"  @click="updateImage" v-if="imageChanged">Guardar Cambios</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-sm-12 col-md-9">
        <div class="" style="max-width: 400px">
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
            >
            <q-input
              filled
              v-model="profile.name"
              label="Your name *"
              hint="Name"
              lazy-rules
              :rules="[ val => val && val.length > 0 && val.length < 32 || 'Please type something']"
            />
            <q-input
              filled
              v-model="profile.lastname1"
              label="Your surname *"
              hint="Surname"
              lazy-rules
              :rules="[ val => val && val.length > 0 && val.length < 32 || 'Please type something']"
            />
            <q-input
              filled
              v-model="profile.lastname2"
              label="Your second surname *"
              hint="Surname"
              lazy-rules
              :rules="[ val => val !== null ? val.length > 3 && val.length < 32 : !val || 'Please type something']"
            />
            <q-select
              filled
              v-model="profile.gender"
              label="Your second surname *"
              hint="Surname"
              :options="[{'label': 'Varón', value: 'Varón'}, {'label': 'Mujer', value: 'Mujer'}]"
            />
            <div>
              <q-btn label="Submit" type="submit" color="primary"/>
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ModelsFetcher, ModelController } from '../../mixins/modelMixin'

export default {
  name: 'ProfileHome',
  mixins: [ ModelsFetcher, ModelController ],
  data () {
    return {
      profile: {
        name: null,
        lastname1: null,
        lastname2: null,
        gender: null,
        avatar: null,
        imageData: null
      },
      modelsNeeded: {
        profiles: {
          full: true,
          ids: [this.$store.state.User.profile.id]
        }
      }
    }
  },
  computed: {
    imageChanged () {
      return this.profile['avatar'] !== this.$store.state.User.profile.avatar
    },
    quasarData () {
      if (!this.modelsReady) return {}
      return this.$store.state.Model.models.profiles.quasarData
    }
  },
  methods: {
    startUploader () {
      this.$refs.uploader.pickFiles()
    },
    uploadFilesAdded (e) {
      // console.log(e)
      this.profile['avatar'] = e[0]
      this.profile['imageData'] = URL.createObjectURL(e[0])
      this.$refs.uploader.reset()
    },
    uploadFile (file, updateProgress) {
      return new Promise((resolve, reject) => {
        console.log('Cambiando Imagen...')
        resolve(file)
      })
    },
    updateImage () {
      this.onSubmit(true)
    },
    restoreImage () {
      this.profile.avatar = this.$store.state.User.profile.avatar
      this.profile.imageData = null
    },
    onSubmit (file = false) {
      this.$q.loading.show()
      let payload = { name: 'profiles', model: this.fieldsObjectValueExtrator(this.profile) }
      if (file) payload.model['file'] = this.profile.avatar
      this.saveModel(payload, 'update').then(() => {
        this.$q.loading.hide()
        this.$store.commit('User/UpdateProfile', { profile: this.profile })
      }).catch((response) => {
        this.$q.loading.hide()
      })
    },
    onReset () {
      this.resetProfile()
    },
    resetProfile () {
      this.profile.id = this.$store.state.User.profile.id
      this.profile.name = this.$store.state.User.profile.name
      this.profile.lastname1 = this.$store.state.User.profile.lastname1
      this.profile.lastname2 = this.$store.state.User.profile.lastname2
      this.profile.gender = this.$store.state.User.profile.gender
      this.profile.avatar = this.$store.state.User.profile.avatar ? this.$store.state.User.profile.avatar : null
    }
  },
  created () {
    this.resetProfile()
  }
}
</script>
