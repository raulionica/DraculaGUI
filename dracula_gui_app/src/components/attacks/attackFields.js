import { toNumber } from "../../utils/formatted/numberFormat";
import {
  DRACI_LOSS_ENUM,
  DRACI_WIN_ENUM,
  PREOTI_ENUM,
} from "./AttackEnums";

const attackFields = {
  /* ----------------------
   * PLAYERS
   * ---------------------- */
  players: {
    title: "Attack Players",
    icon: "ui:characters",
    supportsWine: false,
    getInitialValues: () => ({
      count: "1",
      draci: "1",
      preoti: "1",
    }),
    sections: [
      {
        title: null,
        fields: [
            {
              key: "preoti",
              label: "Priests",
              icon: "bonus:priests",
              color: "#ffffffff",
              suggestions: PREOTI_ENUM,
            },
          {
            key: "draci",
            label: "Gremlins",
            icon: "bonus:gremlins",
            color: "#e73639",
            suggestions: DRACI_LOSS_ENUM,
          },
        ],
      },
    ],
    buildCommand: (form) => ({
      runner: "attack",
      method: "attack_players",
      payload: {
        max_count: Number(form.count) || 1,
        draci: toNumber(form.draci) || 1,
        preoti: toNumber(form.preoti) || 1,
      },
    }),
  },

  /* ----------------------
   * INSTITUTIONS
   * ---------------------- */
  primarii: {
    title: "Attack Institutions",
    icon: "ui:court_house",
    supportsWine: true,
    getInitialValues: () => ({
      count: "1",
      draci: "1",
      preoti: "1",
      with_wine: false,
    }),
    sections: [
      {
        title: null,
        fields: [
            {
              key: "preoti",
              label: "Priests",
              icon: "bonus:priests",
              color: "#ffffffff",
              suggestions: PREOTI_ENUM,
            },
          {
            key: "draci",
            label: "Gremlins to send",
            icon: "bonus:gremlins",
            color: "#e73639",
            suggestions: DRACI_LOSS_ENUM,
          },
        ],
      },
    ],
    buildCommand: (form) => ({
      runner: "attack",
      method: "attack_primarii",
      payload: {
        category: "primarii",
        pub_attack: Number(form.count) || 0,
        draci: toNumber(form.draci),
        preoti: toNumber(form.preoti),
        with_wine: !!form.with_wine,
      },
    }),
  },

  /* ----------------------
   * CHESTS
   * ---------------------- */
  chest: {
    title: "Attack Chests",
    icon: "ui:chest",
    supportsWine: false,
    getInitialValues: () => ({
      draci: "1",
      preoti: "1",
    }),
    sections: [
      {
        title: null,
        fields: [
            {
              key: "preoti",
              label: "Priests",
              icon: "bonus:priests",
              color: "#ffffffff",
              suggestions: PREOTI_ENUM,
            },
          {
            key: "draci",
            label: "Gremlins to send",
            icon: "bonus:gremlins",
            color: "#e73639",
            suggestions: DRACI_LOSS_ENUM,
          },
        ],
      },
    ],
    buildCommand: (form) => ({
      runner: "attack",
      method: "attack_chests",
      payload: {
        draci: toNumber(form.draci),
        preoti: toNumber(form.preoti),
      },
    }),
  },

  /* ----------------------
   * GOVERNMENT SPECIAL
   * ---------------------- */
  government: {
    title: "Government Attack",
    icon: "ui:government",
    supportsWine: true,
    getInitialValues: () => ({
      count: "2",
      preoti_loss: "1",
      draci_loss: "1.000.000",
      preoti_win: "1",
      draci_win: "5.000.000",
      with_wine: false,
    }),
    sections: [
      {
        title: "LOSS",
        fields: [
            {
              key: "preoti_loss",
              label: "Priests loss",
              icon: "bonus:priests",
              color: "#ffffffff",
              suggestions: PREOTI_ENUM,
            },
          {
            key: "draci_loss",
            label: "Gremlins loss",
            icon: "bonus:gremlins",
            color: "#e73639",
            suggestions: DRACI_LOSS_ENUM,
          },
        ],
      },
      {
        title: "WIN",
        fields: [
            {
              key: "preoti_win",
              label: "Priests win",
              icon: "bonus:priests",
              color: "#ffffffff",
              suggestions: PREOTI_ENUM,
            },
          {
            key: "draci_win",
            label: "Gremlins win",
            icon: "bonus:gremlins",
            color: "#e73639",
            suggestions: DRACI_WIN_ENUM,
          },
        ],
      },
    ],
    buildCommand: (form) => ({
      runner: "attack",
      method: "attack_special",
      payload: {
        category: "government",
        pub_attack: Number(form.count) || 0,
        draci_loss: toNumber(form.draci_loss),
        preoti_loss: toNumber(form.preoti_loss),
        draci_win: toNumber(form.draci_win),
        preoti_win: toNumber(form.preoti_win),
        with_wine: !!form.with_wine,
      },
    }),
  },

  /* ----------------------
   * PARLIAMENT SPECIAL
   * ---------------------- */
  parliament: {
    title: "Parliament Attack",
    icon: "ui:parliament",
    supportsWine: true,
    getInitialValues: () => ({
      count: "2",
      preoti_loss: "1",
      draci_loss: "15.000.000",
      preoti_win: "1",
      draci_win: "150.000.000",
      with_wine: false,
    }),
    sections: [
      {
        title: "LOSS",
        fields: [
         {
            key: "preoti_loss",
            label: "Priests loss",
            icon: "bonus:priests",
            color: "#ffffffff",
            suggestions: PREOTI_ENUM,
          },
          {
            key: "draci_loss",
            label: "Gremlins loss",
            icon: "bonus:gremlins",
            color: "#e73639",
            suggestions: DRACI_LOSS_ENUM,
          },
        ],
      },
      {
        title: "WIN",
        fields: [
        {
            key: "preoti_win",
            label: "Priests win",
            icon: "bonus:priests",
            color: "#ffffffff",
            suggestions: PREOTI_ENUM,
        },
          {
            key: "draci_win",
            label: "Gremlins win",
            icon: "bonus:gremlins",
            color: "#e73639",
            suggestions: DRACI_WIN_ENUM,
          },
        ],
      },
    ],
    buildCommand: (form) => ({
      runner: "attack",
      method: "attack_special",
      payload: {
        category: "parliament",
        pub_attack: Number(form.count) || 0,
        draci_loss: toNumber(form.draci_loss),
        preoti_loss: toNumber(form.preoti_loss),
        draci_win: toNumber(form.draci_win),
        preoti_win: toNumber(form.preoti_win),
        with_wine: !!form.with_wine,
      },
    }),
  },
};

export default attackFields;
