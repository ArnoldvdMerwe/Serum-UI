<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormPage',
  components: {},

  data() {
    return {
      firstName: null,
      lastName: null
    };
  }
});
</script>

<template lang="pug">
q-page(
  padding
  )
  div.row.flex-center
    q-form.col-3
      q-input.q-pa-sm(
        filled
        v-model='firstName'
        color='blue'
        bg-color='white'
        label='First name'
        )
      q-input.q-pa-sm(
        filled
        v-model='lastName'
        color='blue'
        bg-color='white'
        label='Last name'
        )
      div.row.flex-center
        q-btn.q-pa-md.col-4(
          rounded
          label="Submit"
          type="submit"
          )
</template>
