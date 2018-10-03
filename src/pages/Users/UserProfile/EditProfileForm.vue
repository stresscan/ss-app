<template>
  <div>
    <card class="card" title="Editar Dados">
      <div>
        <form @submit.prevent="onUpdateProfile">
          <div class="row">
            <div class="col-md-12">
              <ss-fg-input readonly type="email" label="Email" placeholder="Email" v-model.trim="email"></ss-fg-input>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <ss-fg-input readonly type="text" label="Usuário" placeholder="Usuário" v-model.trim="username"></ss-fg-input>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-6">
              <ss-fg-input :class="{'has-error': $v.name.$error}" @input="delayTouch($v.name)" type="text" label="Nome" placeholder="Nome" v-model.trim="name"></ss-fg-input>
              <ul class="field-error-message" v-if="$v.name.$error">
                <li v-if="!$v.name.required">
                  Campo requerido
                </li>
                <li v-if="!$v.name.minLength">
                  Nome precisa ter no mínimo {{ $v.name.$params.minLength.min }} caracteres
                </li>
              </ul>
            </div>
            <div class="col-sm-6">
              <ss-fg-input :class="{'has-error': $v.surname.$error}" @input="delayTouch($v.surname)" type="text" label="Sobrenome" placeholder="Sobrenome" v-model.trim="surname">
              </ss-fg-input>
              <ul class="field-error-message" v-if="$v.surname.$error">
                <li v-if="!$v.surname.required">
                  Campo requerido
                </li>
                <li v-if="!$v.surname.minLength">
                  Sobrenome precisa ter no mínimo {{ $v.surname.$params.minLength.min }} caracteres
                </li>
              </ul>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-4 col-md-6">
              <span v-if="!postalCode" class="fakePostalCode form-control">{{ postalCodeMock }}</span>
              <ss-fg-input :offline="!reactiveOnlineApp || offlineData" :spinner="searchingPostalCode" :class="{'has-error': $v.postalCode.$error}" @input="delayTouch($v.postalCode)" type="text" v-mask="'#####-###'" maxlength="9" label="CEP" v-model.trim="postalCode"></ss-fg-input>
              <ul class="field-error-message " v-if="$v.postalCode.$error">
                <li v-if="!$v.postalCode.isValid">
                  Esse CEP não é válido
                </li>
              </ul>
            </div>
            <div class="col-sm-8 col-md-6">
              <ss-fg-input :offline="!reactiveOnlineApp || offlineData" :class="{'has-error': $v.address.$error}" @input="delayTouch($v.address)" maxlength="100" type="text" label="Endereço" placeholder="Endereço" v-model.trim="address"></ss-fg-input>
              <ul class="field-error-message " v-if="$v.address.$error">
                <li v-if="!$v.address.minLength ">
                  Endereço precisa ter no mínimo {{ $v.address.$params.minLength.min }} caracteres
                </li>
              </ul>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-10 col-md-8">
              <ss-fg-input :offline="!reactiveOnlineApp || offlineData" :class="{'has-error': $v.city.$error}" @input="delayTouch($v.city)" type="text" label="Cidade" placeholder="Cidade" maxlength="50" v-model.trim="city">
              </ss-fg-input>
              <ul class="field-error-message " v-if="$v.city.$error">
                <li v-if="!$v.city.minLength ">
                  Cidade precisa ter no mínimo {{ $v.city.$params.minLength.min }} caracteres
                </li>
              </ul>
            </div>
            <div class="col-sm-2 col-md-4">
              <ss-fg-input :offline="!reactiveOnlineApp || offlineData" :uppercase="true" :class="{'has-error': $v.estate.$error}" @input="delayTouch($v.estate)" type="text" label="UF" maxlength="2" placeholder="UF" v-model.trim="estate">
              </ss-fg-input>
              <ul class="field-error-message " v-if="$v.estate.$error">
                <li v-if="!$v.estate.minLength || !$v.estate.maxLength">
                  UF precisa ter {{ $v.estate.$params.minLength.min }} caracteres
                </li>
              </ul>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-8">
              <ss-fg-input :offline="!reactiveOnlineApp || offlineData" :class="{'has-error': $v.district.$error}" @input="delayTouch($v.district)" type="text" label="Bairro" placeholder="Bairro" v-model.trim="district">
              </ss-fg-input>
              <ul class="field-error-message " v-if="$v.district.$error">
                <li v-if="!$v.district.minLength ">
                  Bairro precisa ter no mínimo {{ $v.district.$params.minLength.min }} caracteres
                </li>
              </ul>
            </div>
            <div class="col-sm-4">
              <ss-fg-input type="text" maxlength="10" label="Número" placeholder="Número" v-model.trim="number">
              </ss-fg-input>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-6">
              <ss-fg-input type="text" label="Telefone" v-mask="'(##) #####-####'" placeholder="Telefone" v-model.trim="phoneNumber">
              </ss-fg-input>
            </div>
            <div class="col-sm-6">
              <ss-fg-input type="text" label="Telefone 2" v-mask="'(##) #####-####'" placeholder="Telefone 2" v-model.trim="phoneNumberTwo">
              </ss-fg-input>
            </div>
          </div>

          <div class="text-center">
            <p-button :loading="updatingUserProfile" native-type="submit" type="info" :disabled="$v.$invalid || updatingUserProfile" round>
              {{ buttonText }}
            </p-button>
          </div>
          <div class="clearfix"></div>
        </form>
      </div>
    </card>
    <change-password @notifySuccess="emitNotify" @notifyError="emitNotify" :email="email" />
  </div>
</template>

<script>
import ChangePassword from "./ChangePassword.vue";
import {
  email,
  required,
  minLength,
  maxLength,
  sameAs
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mask } from "vue-the-mask";
import axios from "axios";
import { emitNotifyMixin } from "@/mixins/Notify";
import usersProfileService from "@/services/UsersProfileService";
import offlineUserService from "@/services/offline/OfflineUsersService";
import storageService from "@/services/StorageService";
import { isOnline } from "@/services/offline/isOnlineService";
import logService from "@/services/LogService";

const touchMap = new WeakMap();

export default {
  name: "EditProfileForm",
  components: {
    ChangePassword
  },
  directives: { mask },
  mixins: [validationMixin, emitNotifyMixin],
  props: {
    uid: String,
    reactiveOnlineApp: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      offlineData: false,
      place: "",
      username: "",
      email: "",
      phoneNumber: "",
      phoneNumberTwo: "",
      name: "",
      surname: "",
      address: "",
      city: "",
      district: "",
      number: "",
      estate: "",
      postalCode: "",
      postalCodeMock: "",
      searchingPostalCode: false,
      buttonText: "Atualizar dados",
      updatingUserProfile: false,
      profilePictureUrl: "",
      coverPictureUrl: ""
    };
  },
  validations: {
    name: {
      required,
      minLength: minLength(4)
    },
    surname: {
      required,
      minLength: minLength(4)
    },
    postalCode: {
      isValid(value) {
        if (value === "") return true;

        return new Promise((resolve, reject) => {
          this.address = "";
          this.city = "";
          this.estate = "";
          this.district = "";
          this.searchingPostalCode = true;

          axios.get(`https://viacep.com.br/ws/${this.postalCode}/json/`).then(
            address => {
              if (address.data.erro) {
                this.searchingPostalCode = false;
                resolve(false);
              }

              this.address = address.data.logradouro;
              this.city = address.data.localidade;
              this.estate = address.data.uf;
              this.district = address.data.bairro;
              this.searchingPostalCode = false;

              resolve(true);
            },
            e => {
              this.searchingPostalCode = false;
              resolve(false);
            }
          );
        });
      }
    },
    city: {
      minLength: minLength(4)
    },
    estate: {
      minLength: minLength(2),
      maxLength: minLength(2)
    },
    address: {
      minLength: minLength(4)
    },
    district: {
      minLength: minLength(4)
    }
  },
  async created() {
    let userData = {};

    const isOnline = await isOnline();

    console.log("isOnline edit profile", isOnline);

    if (!isOnline) {
      userData = await offlineUserService.getUser();
      this.profilePictureUrl = userData.profilePictureUrl;
      this.coverPictureUrl = userData.coverPictureUrl;
      this.offlineData = true;

      this.emitNotify({
        type: "Network",
        msg: `O aplicativo está offline. Alteração de dados está limitada a alguns dados.`
      });
    } else {
      try {
        userData = await usersProfileService.get(this.uid);
      } catch (e) {
        console.error(`online user profile couldn't be find ${e.message}`);

        if (e.message.includes("offline")) {
          this.offlineData = true;
          this.emitNotify({
            type: "Network",
            msg: `Parece que você está offline ou com uma conexão lenta. Alteração de dados está limitada.`
          });
        } else {
          this.emitNotify({
            type: "Error",
            msg: `Não foi possível recuperar os seus dados, por favor tente novamente.`
          });

          logService.logError(
            new Date().getTime(),
            `Não foi possível recuperar os dados do usuário ${e.message}`,
            "EditProfileForm",
            "created",
            this.stateUid
          );
        }

        userData = null;
      }
    }

    console.log({ userData });

    this.name = userData.name;
    this.surname = userData.surname;
    this.email = userData.email;
    this.username = userData.username;
    this.postalCodeMock = userData.postalCode;
    this.city = userData.city;
    this.estate = userData.estate;
    this.address = userData.address;
    this.number = userData.number;
    this.district = userData.district;
    this.phoneNumber = userData.phoneNumber;
    this.phoneNumberTwo = userData.phoneNumberTwo;

    if (!this.coverPictureUrl) {
      try {
        this.coverPictureUrl = await storageService.getImageUrl(
          this.uid,
          "cover.jpg"
        );

        offlineUserService.persiste({
          coverPictureUrl: this.coverPictureUrl
        });
      } catch {}
    }

    if (!this.profilePictureUrl) {
      try {
        this.profilePictureUrl = await storageService.getImageUrl(
          this.uid,
          "profile.jpg"
        );

        offlineUserService.persiste({
          profilePictureUrl: this.profilePictureUrl
        });
      } catch {}
    }

    console.log({ userData });

    this.$emit("userDataIsLoaded", {
      name: this.name,
      surname: this.surname,
      username: this.username,
      phoneNumber: this.phoneNumber,
      email: this.email,
      coverPictureUrl: this.coverPictureUrl,
      profilePictureUrl: this.profilePictureUrl
    });
  },
  methods: {
    delayTouch($v) {
      $v.$reset();

      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v));
      }
      touchMap.set($v, setTimeout($v.$touch, 1000));
    },
    async onUpdateProfile() {
      this.buttonText = "Atualizando dados...";
      this.updatingUserProfile = true;
      this.$v.$touch();

      const userProfile = {
        id: this.uid,
        name: this.name,
        surname: this.surname,
        number: this.number,
        phoneNumber: this.phoneNumber,
        phoneNumberTwo: this.phoneNumberTwo
      };

      // the initial value of the postalcode is always empty
      // the value filled up in the form is a mock value
      // because of that only update this if the user change the value
      if (this.postalCode) {
        userProfile.postalCode = this.postalCode;
        userProfile.address = this.address;
        userProfile.city = this.city;
        userProfile.estate = this.estate;
        userProfile.district = this.district;
      }

      try {
        await usersProfileService.update(userProfile);
        offlineUserService.persiste(userProfile);

        this.buttonText = "Atualizar dados";
        this.updatingUserProfile = false;

        this.emitNotify({
          type: "Success",
          msg: `Seus dados foram atualizados com sucesso`
        });
      } catch (e) {
        console.error(`user profile couldn't be updated by the user ${e}`);

        this.buttonText = "Atualizar dados";
        this.updatingUserProfile = false;

        this.emitNotify({
          type: "Error",
          msg: `Ocorreu um erro inesperado na tentativa de atualizar os seus dados, por favor tente novamente`
        });

        logService.logError(
          new Date().getTime(),
          `User profile couldn't be updated by the user ${e.message}`,
          "EditProfileForm",
          "onUpdateProfile",
          this.stateUid
        );
      }
    }
  }
};
</script>
<style>
.fakePostalCode {
  position: absolute;
  top: 37px;
  left: 34px;
  height: 0 !important;
  border: none !important;
  padding: 0 !important;
}

@media (min-width: 992px) {
  .fakePostalCode {
    top: 44px;
  }
}
</style>
