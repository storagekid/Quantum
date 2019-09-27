<template>
  <div>
    <q-card id="login" class="bg-white relative-position">
      <q-card-section class="text-center bg-secondary text-primary">
        {{$t('login.title')}}
      </q-card-section>
      <q-separator />
      <q-card-section>
        <form action="" @submit.prevent="sendLogin">
          <q-input
            :label="$t('login.user')"
            stack-label
            type="email"
            v-model="name"
            @blur="$v.name.$touch"
            bottom-slots
            :error="$v.name.$error"
            :error-message="$v.name.$error ? getErrors($v.name) : ''"
            >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
            </q-input>
            <q-input
            :label="$t('login.password')"
            stack-label
            type="password"
            v-model="password"
            @blur="$v.password.$touch"
            bottom-slots
            :error="$v.password.$error"
            :error-message="$v.password.$error ? getErrors($v.password) : ''"
            >
            <template v-slot:prepend>
              <q-icon name="vpn_key" />
            </template>
            </q-input>
          <q-btn color="primary" type="submit" label="Entrar" class="q-mt-md full-width"/>
        </form>
      </q-card-section>
      <q-inner-loading :showing="visible">
        <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
      </q-inner-loading>
    </q-card>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import { FormMixins } from '../../mixins/formMixins'

export default {
  name: 'loginForm',
  mixins: [FormMixins],
  data () {
    return {
      visible: false,
      name: '',
      password: ''
    }
  },
  methods: {
    sendLogin () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        this.visible = true
        this.$axios.post(this.$store.state.App.dataWarehouse + 'auth/login', {
          name: this.name,
          password: this.password
        })
          .then(({ data }) => {
            // console.log(data)
            localStorage.setItem('token', data.access_token)
            this.$store.commit('Auth/setToken', data.access_token)
            this.$emit('logged', data)
            this.visible = false
          })
          .catch((error) => {
            this.visible = false
            this.$store.dispatch('Auth/logOut')
            if (error.response) {
              this.$store.dispatch('Response/responseErrorManager', error.response)
            } else {
              this.$store.dispatch('Response/responseNoResponse')
            }
          })
      }
    }
  },
  validations: {
    name: { required, email },
    password: { required, minLength: minLength(8) }
  }
}
</script>

<style>
</style>
