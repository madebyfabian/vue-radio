<template>
  <div class="SliderInput">
    <div class="SliderInput__track-progress" :style="{ 'width': trackProgressCSS }"></div>
    <input 
      :min="min"
      :max="max" 
      :step="step"
      v-model.number="compValue"
      type="range"
    />
  </div>
</template>

<script>
  export default {
    props: {
      min:        { type: String, default: '1' },
      max:        { type: String, default: '100' },
      step:       { type: String, default: '1' },
      modelValue: { type: Number, required: true }
    },

    computed: {
      'trackProgressCSS'() {
        const width = Math.round((this.modelValue - this.min) / (this.max - this.min) * 100),
              pos   = ((50 - width) * 2 / 100 * 8)

        return `calc(${width}% + ${pos}px)`
      },

      'compValue': {
        get() { return this.modelValue },
        set(newValue) { this.$emit('update:modelValue', newValue) }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .SliderInput {
    --track: var(--color-bg-tertiary);
    --primary: var(--color-content-secondary);
    height: 1rem;
    width: 6rem;
    position: relative;
    transform: rotate(-90deg);

    > * {
      position: absolute;
    }

    &__track-progress {
      height: .25rem;
      max-width: 100%;
      background: var(--primary);
      z-index: 1;
      pointer-events: none;
      border-radius: .25rem;
      margin: .375rem 0 0 0;
    }

    input[type=range] {
      -webkit-appearance: none;
      width: 100%;
      margin: 0;
      height: 1rem;
      z-index: 0;
      cursor: pointer;
      left: 0;
      background: transparent;

      &:hover::-webkit-slider-thumb {
        transform: scale(1.25);
      }

      &::-webkit-slider-runnable-track {
        width: 100%;
        height: .25rem;
        background: var(--track);
        border: none;
        border-radius: .25rem;
      }

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: none;
        height: 1rem;
        width: 16px;
        border-radius: 50%;
        background: var(--primary);
        margin-top: -.375rem;
        transition: transform .1s ease;
      }
    }
  }
</style>