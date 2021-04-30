<template>
  <div>
    <h2 class="mb-30">Template: vue2-webpack-js</h2>

    <h3>lib: network</h3>
    <p>send request: {{ requestTestStatus }}</p>

    <h3 class="mt-10">lib: scss</h3>
    <p class="scss">this text should <strong>not be black</strong></p>
  </div>
</template>

<script>
import getUsersAPI from '@/api/test';

export default {
  name: 'CheckList',
  data() {
    return {
      requestTestStatus: '',
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    async getUser() {
      const res = await getUsersAPI();

      if (Array.isArray(res) && res.length === 10) {
        this.requestTestStatus = 'success';
      } else {
        this.requestTestStatus = 'fail';
      }
    },
  },
};
</script>

<style lang="scss">
.scss {
  color: $c-main;
}

.mb-30 {
  margin-bottom: 30px;
}

.mt-10 {
  margin-top: 10px;
}
</style>
