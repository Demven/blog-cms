<template>
  <Modal @close="onModalClose">
    <div class="LoginPage">
      <Label green>Login</Label>

      <img
        class="LoginPage__hero-image"
        src="/images/login.jpg"
      />

      <div class="LoginPage__info-background"></div>
      <div class="LoginPage__info-container">
        <h2 class="LoginPage__greeting">Enter the God mode</h2>

        <div class="LoginPage__input-field">
          <TextField
            :name="'username'"
            :label="'Name'"
            :placeholder="'User name'"
            :value="username"
            required
            @change="onFieldChange"
            @enter-key="onEnterKey"
          ></TextField>
        </div>

        <div class="LoginPage__input-field">
          <TextField
            :name="'password'"
            :label="'Password'"
            :placeholder="'Password'"
            :value="password"
            required
            typePassword
            @change="onFieldChange"
            @enter-key="onEnterKey"
          ></TextField>
        </div>
      </div>
    </div>

    <Toast :event-bus="toastEventBus"></Toast>
  </Modal>
</template>

<script>
  import emitter from 'mitt';
  import Modal from '../components/Modal.vue';
  import Label from '../components/Label.vue';
  import TextField from '../components/TextField.vue';
  import Toast from '../components/Toast.vue';
  import userService from '../services/user-service';
  import { env } from '../env';

  export default {
    name: 'LoginPage',
    components: {
      Modal,
      Label,
      TextField,
      Toast,
    },
    data () {
      return {
        username: '',
        password: '',
        toastEventBus: emitter(),
      };
    },
    methods: {
      onFieldChange({ name, value }) {
        if (name) {
          this[name] = value;
        }
      },

      onEnterKey () {
        userService
          .login(this.username, this.password)
          .then(response => {
            if (response) {
              this.$router.push('/homepage');
            } else {
              this.toastEventBus.emit('message', response);
            }
          })
          .catch(error => {
            console.error(error);
            this.toastEventBus.emit('message', error.message);
          });
      },

      onModalClose () {
        window.location.href = env.WWW_HOST;
      }
    }
  };
</script>

<style lang="scss">
  @import '../styles/typography';
  @import '../styles/colors';
  @import '../styles/media';

  $login-modal-offset: 2em;

  .LoginPage {
    display: flex;
    flex-direction: row;
    position: relative;

    @include media($tablet-any) {
      flex-direction: column;
    }

    @include media($mobile-any) {
      flex-direction: column;
    }

    &__hero-image {
      height: 100%;
      min-height: calc(100vh - #{$login-modal-offset} * 2);
      transform: translateX(-4.5em);

      @include media($desktop-narrow) {
        transform: translateX(-10.5em);
      }

      @include media($tablet-any) {
        width: 100%;
        min-height: initial;
        transform: initial;
      }

      @include media($mobile-any) {
        width: 100%;
        min-height: initial;
        transform: initial;
      }
    }

    &__info-background {
      width: 58%;
      height: 145%;
      position: absolute;
      top: 0;
      right: -8%;
      background: white;
      transform: rotate(18deg);
      transform-origin: right;

      @include media($tablet-any) {
        width: 145%;
        height: 30em;
        top: initial;
        right: initial;
        position: static;
        transform: rotate(-14deg);
        transform-origin: left;
      }

      @include media($mobile-any) {
        width: 145%;
        height: 30em;
        top: initial;
        right: initial;
        position: static;
        transform: rotate(-12deg);
        transform-origin: left;
      }
    }

    &__info-container {
      width: 43%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: 0;
      top: 0;
      padding-top: 5em;

      @include media($tablet-any) {
        width: 100%;
        position: relative;
        margin-top: -32em;
        padding-bottom: 60px;
      }

      @include media($mobile-any) {
        width: 100%;
        position: relative;
        margin-top: -32em;
      }

      @include media($sub-mobile) {
        margin-top: -33em;
      }
    }

    &__greeting {
      padding: 0.125em 0.5em 0.3em;
      font-family: $font-dincyr-bold;
      font-size: 4em;
      line-height: 1em;
      letter-spacing: 1px;
      background: $color-black;
      color: $color-white;
      margin-bottom: 0.75em;

      @include media($desktop-narrow) {
        font-size: 3em;
      }

      @include media($tablet-any) {
        margin-left: -0.6em;
      }

      @include media($mobile-any) {
        width: 293px;
        font-size: 2.6em;
        margin-bottom: 0.5em;
        margin-left: 0;
      }

      @include media($sub-mobile) {
        width: 252px;
        font-size: 2.2em;
      }
    }

    &__input-field {
      width: 416px;
      margin-top: 30px;

      @include media($desktop-narrow) {
        width: 317px;
      }

      @include media($tablet-any) {
        margin-left: -24px;
      }

      @include media($mobile-any) {
        width: 319px;
      }

      @include media($sub-mobile) {
        width: 274px;
      }
    }
  }
</style>