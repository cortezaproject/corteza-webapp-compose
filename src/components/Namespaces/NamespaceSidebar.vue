<template>
  <aside>
    <b-list-group class="vh-100 bg-white overflow-auto">
      <b-list-group-item class="p-2 sticky-top">
        <b-form-input placeholder="Search namespaces"></b-form-input>
      </b-list-group-item>
      <b-list-group-item to="1" class="p-2" active-class="active text-primary border-top-0 border-bottom-0"><span class="text-truncate d-block" >CrasCrasCrasCrasCrasCrasCras justo odio</span></b-list-group-item>
      <b-list-group-item to="2" class="p-2" active-class="active text-primary border-top-0 border-bottom-0"><span class="text-truncate d-block" >CrasCrasCrasCrasCrasCrasCras justo odio</span></b-list-group-item>
      <b-list-group-item to="3" class="p-2" active-class="active text-primary border-top-0 border-bottom-0"><span class="text-truncate d-block" >CrasCrasCrasCrasCrasCrasCras justo odio</span></b-list-group-item>
    </b-list-group>
  </aside>
</template>

<style scoped lang="scss">
  aside {
    width: 200px;

    .list-group-item {
      &.active {
        border-right: 3px solid $primary;
        background-color: rgba($primary, 0.15);
      }
    }
  }
</style>
