<template>
  <Teleport to="body">
    <div class="global-loader" v-if="loading">
      <svg
        width="80"
        height="80"
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
      >
        <g fill="none" fill-rule="evenodd" stroke-width="2">
          <circle cx="22" cy="22" r="1">
            <animate
              attributeName="r"
              begin="0s"
              dur="1.8s"
              values="1; 20"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.165, 0.84, 0.44, 1"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              begin="0s"
              dur="1.8s"
              values="1; 0"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.3, 0.61, 0.355, 1"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  </Teleport>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { application } from "../application";

export default defineComponent({
  setup() {
    const loading = computed(() => {
      return application.loading;
    });
    return { loading };
  },
});
</script>

<style scoped>
.global-loader {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.5s ease;
}
.global-loader.hide {
  opacity: 0;
  pointer-events: none;
}

@media (prefers-color-scheme: dark) {
  .global-loader {
    color: #00c6ff;
  }
}
</style>