<template>
  <div :class="className">
    <label
       class="TextArea__label"
       :for="name"
       v-if="label"
    >
      {{label}}
    </label>

    <textarea
      class="TextArea__field"
      ref="textAreaElement"
      :id="name"
      :placeholder="placeholder"
      :rows="rows"
      :required="required"
      @focus="onFocus"
      @input="onInput"
      @blur="onBlur"
      v-model="value"
    ></textarea>

    <div class="TextArea__error">{{errorText}}</div>
  </div>
</template>

<script>
  import { ref, onMounted } from 'vue';
  import classNames from 'classnames';

  export default {
    name: 'TextArea',
    props: {
      name: String,
      label: String,
      rows: Number,
      initialValue: String,
      placeholder: String,
      required: Boolean,
      errorText: String,
    },
    data () {
      return {
        value: this.initialValue,
        EVENT: {
          FOCUS: 'focus',
          CHANGE: 'change',
          BLUR: 'blur',
        },
      };
    },
    setup () {
      const textAreaElement = ref(null);

      function resize () {
        textAreaElement.value.style.height = 'auto';
        textAreaElement.value.style.height = `${textAreaElement.value.scrollHeight}px`;
      }

      onMounted(() => {
        resize();
      });

      return {
        textAreaElement,
        resize,
      };
    },
    computed: {
      className () {
        return classNames('TextArea', {
          'TextArea--with-error': this.errorText,
        });
      },
    },
    methods: {
      onFocus (event) {
        this.resize();

        this.$emit(this.EVENT.FOCUS, event);
      },

      onInput () {
        this.resize();

        if (this.name) {
          this.$emit(this.EVENT.CHANGE, { name: this.name, value: this.value });
        }
      },

      onBlur (event) {
        this.$emit(this.EVENT.BLUR, event);
      },
    },
  };
</script>

<style lang="scss">
  @import '../styles/colors';
  @import '../styles/media';
  @import '../styles/typography';

  $componentName: 'TextArea';

  .#{$componentName} {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    &__label {
      font-family: $font-dincyr-bold;
      font-size: 14px;
      color: $color-aquamarine;

      .#{$componentName}--with-error & {
        color: $color-red;
      }
    }

    &__field {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      max-width: 100%;
      padding: 8px 10px 8px 0;
      outline: none;
      font-family: $font-dincyr-regular;
      font-size: 16px;
      border: 0;
      border-bottom: 1px solid $color-dark-grey;
      color: $color-black-darker;
      transition: border-color 0.3s;
      box-sizing: border-box;

      &:focus {
        border-bottom: 2px solid $color-aquamarine;
      }

      &::placeholder {
        color: $color-dark-grey;
      }

      .#{$componentName}--with-error & {
        border-color: $color-red;
      }
    }

    &__error {
      display: none;
      padding-top: 5px;
      font-family: $font-dincyr-regular;
      font-size: 12px;
      color: $color-red;

      .#{$componentName}--with-error & {
        display: block;
      }
    }
  }
</style>
