import { ref, onMounted, provide, inject, computed, onUnmounted, type Ref } from 'vue';
import { BREAKPOINTS } from '@/constants';

const APP_WIDTH_KEY = Symbol('APP_WIDTH_KEY');
const APP_HEIGHT_KEY = Symbol('APP_HEIGHT_KEY');
const APP_IS_MOBILE_KEY = Symbol('APP_IS_MOBILE_KEY');
const APP_IS_TABLET_KEY = Symbol('APP_IS_TABLET_KEY');
const APP_IS_DESCTOP_KEY = Symbol('APP_IS_DESCTOP_KEY');
const APP_IS_LARDE_DESCTOP_KEY = Symbol('APP_IS_LARDE_DESCTOP_KEY');

export function useWindowResize() {
  const appWidth = ref(window.innerWidth);
  const appHeight = ref(window.innerHeight);

  const updateSize = () => {
    appWidth.value = window.innerWidth;
    appHeight.value = window.innerHeight;
  };

  const isMobile = computed(() => appWidth.value < BREAKPOINTS.MOBILE);
  const isTablet = computed(
    () => appWidth.value >= BREAKPOINTS.MOBILE && appWidth.value < BREAKPOINTS.TABLET,
  );
  const isDesktop = computed(
    () => appWidth.value >= BREAKPOINTS.DESKTOP && appWidth.value < BREAKPOINTS.LARDE_DESCTOP,
  );
  const isLargeDesktop = computed(() => appWidth.value >= BREAKPOINTS.LARDE_DESCTOP);

  onMounted(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize);
  });

  provide(APP_WIDTH_KEY, appWidth);
  provide(APP_HEIGHT_KEY, appHeight);
  provide(APP_IS_MOBILE_KEY, isMobile);
  provide(APP_IS_TABLET_KEY, isTablet);
  provide(APP_IS_DESCTOP_KEY, isDesktop);
  provide(APP_IS_LARDE_DESCTOP_KEY, isLargeDesktop);
  return { appWidth, appHeight, isMobile, isTablet, isDesktop, isLargeDesktop };
}

export function useInjectWindowResize() {
  const appWidth = inject<Ref<number>>(APP_WIDTH_KEY, ref(0));
  const appHeight = inject<Ref<number>>(APP_HEIGHT_KEY, ref(0));
  const isMobile = inject<Ref<number>>(APP_IS_MOBILE_KEY, ref(0));
  const isTablet = inject<Ref<number>>(APP_IS_TABLET_KEY, ref(0));
  const isDesktop = inject<Ref<number>>(APP_IS_DESCTOP_KEY, ref(0));
  const isLargeDesktop = inject<Ref<number>>(APP_IS_LARDE_DESCTOP_KEY, ref(0));
  return { appHeight, appWidth, isMobile, isTablet, isDesktop, isLargeDesktop };
}
