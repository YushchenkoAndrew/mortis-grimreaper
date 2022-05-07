import { AnyAction } from 'redux';

import { GetDynamicParams } from '../../projects/reducer/namespace';

const PREFIX = "COLORS";

const INIT_STATE = {
  info: false,
  action: "info",

  id: -1,
  colors: ["#FFF", "#FFF", "#FFF", "#FFF", "#FFF"],
  // stroke: "",
  // scale: "",
  // spacing: { x: "", y: "" },
  // width: "",
  // height: "",
  // path: "",

  page: 0,
  items: [
    { colors: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"] },
    { colors: ["#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557"] },
    { colors: ["#FFCDB2", "#FFB4A2", "#E5989B", "#B5838D", "#6D6875"] },
    { colors: ["#CB997E", "#EDDCD2", "#FFF1E6", "#F0EFEB", "#DDBEA9"] },
    { colors: ["#003049", "#D62828", "#F77F00", "#FCBF49", "#EAE2B7"] },
    { colors: ["#000000", "#14213D", "#FCA311", "#E5E5E5", "#FFFFFF"] },
    { colors: ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF"] },
    { colors: ["#03045E", "#023E8A", "#0077B6", "#0096C7", "#00B4D8"] },
    { colors: ["#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C", "#D90429"] },
    { colors: ["#05668D", "#028090", "#00A896", "#02C39A", "#F0F3BD"] },
    { colors: ["#03071E", "#370617", "#6A040F", "#9D0208", "#D00000"] },
    { colors: ["#FFB5A7", "#FCD5CE", "#F8EDEB", "#F9DCC4", "#FEC89A"] },
    { colors: ["#D8E2DC", "#FFE5D9", "#FFCAD4", "#F4ACB7", "#9D8189"] },
    { colors: ["#EF476F", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"] },
    { colors: ["#606C38", "#283618", "#FEFAE0", "#DDA15E", "#BC6C25"] },
    { colors: ["#011627", "#FDFFFC", "#2EC4B6", "#E71D36", "#FF9F1C"] },
    { colors: ["#FFBE0B", "#FB5607", "#FF006E", "#8338EC", "#3A86FF"] },
    { colors: ["#7400B8", "#6930C3", "#5E60CE", "#5390D9", "#4EA8DE"] },
    { colors: ["#006D77", "#83C5BE", "#EDF6F9", "#FFDDD2", "#E29578"] },
    { colors: ["#1A535C", "#4ECDC4", "#F7FFF7", "#FF6B6B", "#FFE66D"] },
    { colors: ["#3D5A80", "#98C1D9", "#E0FBFC", "#EE6C4D", "#293241"] },
    { colors: ["#F6BD60", "#F7EDE2", "#F5CAC3", "#84A59D", "#F28482"] },
    { colors: ["#FFA69E", "#FAF3DD", "#B8F2E6", "#AED9E0", "#5E6472"] },
    { colors: ["#EDC4B3", "#E6B8A2", "#DEAB90", "#D69F7E", "#CD9777"] },
    { colors: ["#22223B", "#4A4E69", "#9A8C98", "#C9ADA7", "#F2E9E4"] },
    { colors: ["#F94144", "#F3722C", "#F8961E", "#F9C74F", "#90BE6D"] },
    { colors: ["#FF9F1C", "#FFBF69", "#FFFFFF", "#CBF3F0", "#2EC4B6"] },
    { colors: ["#D8F3DC", "#B7E4C7", "#95D5B2", "#74C69D", "#52B788"] },
    { colors: ["#CAD2C5", "#84A98C", "#52796F", "#354F52", "#2F3E46"] },
    { colors: ["#5F0F40", "#9A031E", "#FB8B24", "#E36414", "#0F4C5C"] },
    { colors: ["#555B6E", "#89B0AE", "#BEE3DB", "#FAF9F9", "#FFD6BA"] },
    { colors: ["#355070", "#6D597A", "#B56576", "#E56B6F", "#EAAC8B"] },
    { colors: ["#247BA0", "#70C1B3", "#B2DBBF", "#F3FFBD", "#FF1654"] },
    { colors: ["#8E9AAF", "#CBC0D3", "#EFD3D7", "#FEEAFA", "#DEE2FF"] },
    { colors: ["#FFCBF2", "#F3C4FB", "#ECBCFD", "#E5B3FE", "#E2AFFF"] },
    { colors: ["#ECF8F8", "#EEE4E1", "#E7D8C9", "#E6BEAE", "#B2967D"] },
    { colors: ["#335C67", "#FFF3B0", "#E09F3E", "#9E2A2B", "#540B0E"] },
    { colors: ["#F72585", "#7209B7", "#3A0CA3", "#4361EE", "#4CC9F0"] },
    { colors: ["#F08080", "#F4978E", "#F8AD9D", "#FBC4AB", "#FFDAB9"] },
    { colors: ["#7BDFF2", "#B2F7EF", "#EFF7F6", "#F7D6E0", "#F2B5D4"] },
    { colors: ["#50514F", "#F25F5C", "#FFE066", "#247BA0", "#70C1B3"] },
    { colors: ["#007F5F", "#2B9348", "#55A630", "#80B918", "#AACC00"] },
    { colors: ["#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA", "#ADB5BD"] },
    { colors: ["#283D3B", "#197278", "#EDDDD4", "#C44536", "#772E25"] },
    { colors: ["#9C89B8", "#F0A6CA", "#EFC3E6", "#F0E6EF", "#B8BEDD"] },
    { colors: ["#FFFFFF", "#84DCC6", "#A5FFD6", "#FFA69E", "#FF686B"] },
    { colors: ["#CFDBD5", "#E8EDDF", "#F5CB5C", "#242423", "#333533"] },
    { colors: ["#03045E", "#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8"] },
    { colors: ["#0B132B", "#1C2541", "#3A506B", "#5BC0BE", "#6FFFE9"] },
    { colors: ["#0466C8", "#0353A4", "#023E7D", "#002855", "#001845"] },
    { colors: ["#9B5DE5", "#F15BB5", "#FEE440", "#00BBF9", "#00F5D4"] },
    { colors: ["#FFFFFF", "#00171F", "#003459", "#007EA7", "#00A8E8"] },
    { colors: ["#588B8B", "#FFFFFF", "#FFD5C2", "#F28F3B", "#C8553D"] },
    { colors: ["#FE938C", "#E6B89C", "#EAD2AC", "#9CAFB7", "#4281A4"] },
    { colors: ["#2D00F7", "#6A00F4", "#8900F2", "#A100F2", "#B100E8"] },
    { colors: ["#353535", "#3C6E71", "#FFFFFF", "#D9D9D9", "#284B63"] },
    { colors: ["#C9CBA3", "#FFE1A8", "#E26D5C", "#723D46", "#472D30"] },
    { colors: ["#463F3A", "#8A817C", "#BCB8B1", "#F4F3EE", "#E0AFA0"] },
    { colors: ["#8ECAE6", "#219EBC", "#023047", "#FFB703", "#FB8500"] },
    { colors: ["#10002B", "#240046", "#3C096C", "#5A189A", "#7B2CBF"] },
    { colors: ["#E2E2DF", "#D2D2CF", "#E2CFC4", "#F7D9C4", "#FAEDCB"] },
    { colors: ["#FF595E", "#FFCA3A", "#8AC926", "#1982C4", "#6A4C93"] },
    { colors: ["#390099", "#9E0059", "#FF0054", "#FF5400", "#FFBD00"] },
    { colors: ["#F94144", "#F3722C", "#F8961E", "#F9844A", "#F9C74F"] },
    { colors: ["#F7B267", "#F79D65", "#F4845F", "#F27059", "#F25C54"] },
    { colors: ["#70D6FF", "#FF70A6", "#FF9770", "#FFD670", "#E9FF70"] },
    { colors: ["#FADDE1", "#FFC4D6", "#FFA6C1", "#FF87AB", "#FF5D8F"] },
    { colors: ["#D4E09B", "#F6F4D2", "#CBDFBD", "#F19C79", "#A44A3F"] },
    { colors: ["#220901", "#621708", "#941B0C", "#BC3908", "#F6AA1C"] },
    { colors: ["#FFFCF2", "#CCC5B9", "#403D39", "#252422", "#EB5E28"] },
    { colors: ["#ED6A5A", "#F4F1BB", "#9BC1BC", "#5CA4A9", "#E6EBE0"] },
    { colors: ["#114B5F", "#1A936F", "#88D498", "#C6DABF", "#F3E9D2"] },
    { colors: ["#540D6E", "#EE4266", "#FFD23F", "#3BCEAC", "#0EAD69"] },
    { colors: ["#CB997E", "#DDBEA9", "#FFE8D6", "#B7B7A4", "#A5A58D"] },
    { colors: ["#6F1D1B", "#BB9457", "#432818", "#99582A", "#FFE6A7"] },
    { colors: ["#233D4D", "#FE7F2D", "#FCCA46", "#A1C181", "#619B8A"] },
    { colors: ["#FFAC81", "#FF928B", "#FEC3A6", "#EFE9AE", "#CDEAC0"] },
    { colors: ["#4F000B", "#720026", "#CE4257", "#FF7F51", "#FF9B54"] },
    { colors: ["#64A6BD", "#90A8C3", "#ADA7C9", "#D7B9D5", "#F4CAE0"] },
    { colors: ["#5BC0EB", "#FDE74C", "#9BC53D", "#E55934", "#FA7921"] },
    { colors: ["#0D3B66", "#FAF0CA", "#F4D35E", "#EE964B", "#F95738"] },
    { colors: ["#CDB4DB", "#FFC8DD", "#FFAFCC", "#BDE0FE", "#A2D2FF"] },
    { colors: ["#EEE2DF", "#EED7C5", "#C89F9C", "#C97C5D", "#B36A5E"] },
    { colors: ["#797D62", "#9B9B7A", "#D9AE94", "#F1DCA7", "#FFCB69"] },
    { colors: ["#DCDCDD", "#C5C3C6", "#46494C", "#4C5C68", "#1985A1"] },
    { colors: ["#BCE784", "#5DD39E", "#348AA7", "#525174", "#513B56"] },
    { colors: ["#FF99C8", "#FCF6BD", "#D0F4DE", "#A9DEF9", "#E4C1F9"] },
    { colors: ["#ECC8AF", "#E7AD99", "#CE796B", "#C18C5D", "#495867"] },
    { colors: ["#0D1B2A", "#1B263B", "#415A77", "#778DA9", "#E0E1DD"] },
    { colors: ["#FF4800", "#FF5400", "#FF6000", "#FF6D00", "#FF7900"] },
    { colors: ["#2D3142", "#4F5D75", "#BFC0C0", "#FFFFFF", "#EF8354"] },
    { colors: ["#495867", "#577399", "#BDD5EA", "#F7F7FF", "#FE5F55"] },
    { colors: ["#2D3142", "#BFC0C0", "#FFFFFF", "#EF8354", "#4F5D75"] },
    { colors: ["#fe4a49", "#2ab7ca", "#fed766", "#e6e6ea", "#f4f4f8"] },
    { colors: ["#eee3e7", "#ead5dc", "#eec9d2", "#f4b6c2", "#f6abb6"] },
    { colors: ["#011f4b", "#03396c", "#005b96", "#6497b1", "#b3cde0"] },
    { colors: ["#051e3e", "#251e3e", "#451e3e", "#651e3e", "#851e3e"] },
    { colors: ["#dec3c3", "#e7d3d3", "#f0e4e4", "#f9f4f4", "#ffffff"] },
    { colors: ["#4a4e4d", "#0e9aa7", "#3da4ab", "#f6cd61", "#fe8a71"] },
    { colors: ["#2a4d69", "#4b86b4", "#adcbe3", "#e7eff6", "#63ace5"] },
    { colors: ["#fe9c8f", "#feb2a8", "#fec8c1", "#fad9c1", "#f9caa7"] },
    { colors: ["#009688", "#35a79c", "#54b2a9", "#65c3ba", "#83d0c9"] },
    { colors: ["#ee4035", "#f37736", "#fdf498", "#7bc043", "#0392cf"] },
    { colors: ["#ffffff", "#d0e1f9", "#4d648d", "#283655", "#1e1f26"] },
    { colors: ["#eeeeee", "#dddddd", "#cccccc", "#bbbbbb", "#aaaaaa"] },
    { colors: ["#ffe9dc", "#fce9db", "#e0a899", "#dfa290", "#c99789"] },
    { colors: ["#96ceb4", "#ffeead", "#ff6f69", "#ffcc5c", "#88d8b0"] },
    { colors: ["#6e7f80", "#536872", "#708090", "#536878", "#36454f"] },
    { colors: ["#4b3832", "#854442", "#fff4e6", "#3c2f2f", "#be9b7b"] },
    { colors: ["#3b5998", "#8b9dc3", "#dfe3ee", "#f7f7f7", "#ffffff"] },
    { colors: ["#008744", "#0057e7", "#d62d20", "#ffa700", "#ffffff"] },
    { colors: ["#3385c6", "#4279a3", "#476c8a", "#49657b", "#7f8e9e"] },
    { colors: ["#d2d4dc", "#afafaf", "#f8f8fa", "#e5e6eb", "#c0c2ce"] },
    { colors: ["#a8e6cf", "#dcedc1", "#ffd3b6", "#ffaaa5", "#ff8b94"] },
    { colors: ["#d11141", "#00b159", "#00aedb", "#f37735", "#ffc425"] },
    { colors: ["#6f7c85", "#75838d", "#7e8d98", "#8595a1", "#8c9da9"] },
    { colors: ["#ebf4f6", "#bdeaee", "#76b4bd", "#58668b", "#5e5656"] },
    { colors: ["#ff77aa", "#ff99cc", "#ffbbee", "#ff5588", "#ff3377"] },
    { colors: ["#eeeeee", "#dddddd", "#cccccc", "#bbbbbb", "#29a8ab"] },
    { colors: ["#fff6e9", "#ffefd7", "#fffef9", "#e3f0ff", "#d2e7ff"] },
    { colors: ["#edc951", "#eb6841", "#cc2a36", "#4f372d", "#00a0b0"] },
    { colors: ["#84c1ff", "#add6ff", "#d6eaff", "#eaf4ff", "#f8fbff"] },
    { colors: ["#2e003e", "#3d2352", "#3d1e6d", "#8874a3", "#e4dcf1"] },
    { colors: ["#8d5524", "#c68642", "#e0ac69", "#f1c27d", "#ffdbac"] },
    { colors: ["#343d46", "#4f5b66", "#65737e", "#a7adba", "#c0c5ce"] },
    { colors: ["#bfd6f6", "#8dbdff", "#64a1f4", "#4a91f2", "#3b7dd8"] },
    { colors: ["#e3c9c9", "#f4e7e7", "#eedbdb", "#cecbcb", "#cbdadb"] },
    { colors: ["#01bf2b", "#f04554", "#eff9fb", "#5a3626", "#290b0a"] },
    { colors: ["#f0f4f7", "#c8beb9", "#fac57d", "#a81817", "#344d2f"] },
  ],
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type) {
    // FIXME:
    case `${PREFIX}_INIT`:
      return { ...state, ...action.value };

    case `${PREFIX}_PATTERN_LOADED`:
      return {
        ...state,
        page: state.page + 1,
        items: [...state.items, ...action.value],
      };

    case `${PREFIX}_ACTION_CHANGED`: {
      // const prev = state.items.filter(({ id }) => id === state.id);

      return {
        ...state,
        action: action.value,
        // info: ["create", "update"].includes(action.value) || state.info,
        // ...(action.value === "create"
        //   ? {
        //       mode: "Fill",
        //       colors: "",
        //       stroke: "",
        //       scale: "",
        //       spacing: { x: "", y: "" },
        //       width: "",
        //       height: "",
        //       path: "",
        //     }
        //   : DataToState(prev[0])),
      };
    }

    case `${PREFIX}_COLORS_CHANGED`: {
      const index = GetDynamicParams(action.type, action.readFrom ?? "");
      return {
        ...state,
        colors: state.colors.map((item, i) =>
          i != index[0]
            ? item
            : action.value.toUpperCase().replace(/[^A-F0-9#]+/g, "")
        ),
      };
    }

    case `${PREFIX}_INFO_CHANGED`:
      return { ...state, info: action.value, action: "info" };

    // FIXME:
    case `${PREFIX}_CACHED`:
    //   fetch(`${basePath}/api/admin/cache?id=${CacheId(PREFIX)}`, {
    //     method: "POST",
    //     body: JSON.stringify(StateToData(state)),
    //   }).catch(() => null);
    //   return state;

    case `${PREFIX}_CACHE_FLUSH`:
    //   fetch(`${basePath}/api/admin/cache?id=${CacheId(PREFIX)}`, {
    //     method: "DELETE",
    //   }).catch(() => null);

    default:
      return state;
  }
}
