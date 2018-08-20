<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="row">
            <div class="col-md-12">
              <slot name="left-content" />
            </div>
            <div class="col-md-12">
              <slot name="right-content" />
            </div>
          </div>

          <!-- <div class="modal-header">
            <slot name="header">
            </slot>
          </div> -->

          <!-- <div class="modal-body">
            <slot name="body">
            </slot>
          </div> -->

          <!-- <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div> -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {};
</script>

<style>
.modal-mask {
  position: absolute;
  z-index: 9998;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  margin: 0px auto;
  padding: 5px;
  background-color: #fff;
  border-radius: 2px;
  border: solid 1px #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  position: absolute;
  width: 100%;
}

.modal-header h3 {
  margin: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>


