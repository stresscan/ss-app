import FormGroupInput from "./Inputs/formGroupInput.vue";
import ToggleButton from "./Inputs/toggleButton.vue";

import DropDown from "./Dropdown.vue";
import PaperTable from "./PaperTable.vue";
import Button from "./Button";

import Card from "./Cards/Card.vue";
import ChartCard from "./Cards/ChartCard.vue";
import StatsCard from "./Cards/StatsCard.vue";

import SidebarPlugin from "./SidebarPlugin/index";

import LocationMap from "./Map.vue";

let components = {
  FormGroupInput,
  ToggleButton,
  Card,
  ChartCard,
  StatsCard,
  PaperTable,
  DropDown,
  SidebarPlugin,
  LocationMap
};

export default components;

export {
  FormGroupInput,
  ToggleButton,
  Card,
  ChartCard,
  StatsCard,
  PaperTable,
  DropDown,
  Button,
  SidebarPlugin,
  LocationMap
};
