<template>
  <div id="grid-container">
  <div class="grid-item">
    <div>Selected: {{ selected }}</div>

    <select id="select" v-model="selected">
      <option>C++</option>
      <option>Java</option>
    </select>

    <textarea 
      class="coding" 
      id="code-input" 
      v-model="code" 
      :disabled="selected == ''" 
      placeholder="Write code">
    </textarea>

    <button 
      id="compile-button" 
      @click="runCompiler">
      Compile and Run
    </button>
  </div>

  <div class="spacing"></div>

  <div class="grid-item">
    <textarea 
      class="coding" 
      id="code-output" 
      v-model="output" 
      disabled>{{ output }}
    </textarea>
  </div>
</div>
</template>

<script lang="ts">

  export default{
    name: "Compiler",
    
    data() {
      return {
          selected: "",
          code: "",
          output: "Code"
      }
    },
    methods: {
      runCompiler(){
      }
    }
  }
</script>


<style scoped>

#grid-container{
  display: flex;
}

.grid-item{
  display: grid;
}
.spacing{
  min-width: 50px;
}
#select{
  max-width: 400px;
}

.coding{
  background-color: #2c3e50;
  color: white;
  border: none;
  resize: none;
  height: 350px;
  width: 400px;
  padding: 10px;
}

#code-output{
  margin-top: 46px;
}

#compile-button{
  border-radius: 5px;
  display: block;
  width: 100px;
  height: 40px;
  margin: 10px auto 0px auto;
  color: white;
  background-color: green;
  border: black;
  cursor: pointer;
}
</style>
