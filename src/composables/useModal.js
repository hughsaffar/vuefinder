import {ref, shallowRef} from "vue";

export default function () {
    const type = shallowRef(null);
    const visible = ref(false);
    const data = ref();

    const open = (modal, payload = null) => {
        visible.value = true;
        type.value = modal;
        data.value = payload;
    }

    const close = () => {
        visible.value = false;
        type.value = null;
    }

    return {visible, type, data, open, close}
}
