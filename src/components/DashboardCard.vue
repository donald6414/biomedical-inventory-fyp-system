<template>
    <div>
      <v-card :title="heading" :text="money ? formatPrice(data) + ' TSH' : formatPrice(data)" cols="3">
      </v-card>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: String,
      value: Number,
      cash:Boolean
    },
    setup(props) {
      const heading = props.title
      const data = props.value
      const money = props.cash
  
      // Functions
      function formatPrice(price) {
        return new Intl.NumberFormat().format(price);
      }
  
      return {
        heading,
        data,
        money,
        formatPrice
      }
    }
  }
  </script>
  
  <style scoped>
  </style>