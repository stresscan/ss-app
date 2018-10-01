import {
  FormGroupInput,
  ToggleButton,
  Card,
  DropDown,
  Button
} from "../components/index";
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(Vue) {
    Vue.component("ss-fg-input", FormGroupInput);
    Vue.component("ss-toggle-button", ToggleButton);
    Vue.component("drop-down", DropDown);
    Vue.component("card", Card);
    Vue.component("p-button", Button);
  }
};

export default GlobalComponents;
