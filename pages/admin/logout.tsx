import sessionConfig from "../../config/session";
import { checkIfUserExist } from "../../lib/api/session";
import { basePath } from "../../config";

export default function Logout() {
  return <></>;
}

// export const getServerSideProps = withIronSessionSsr(
//   async function getServerSideProps({ req }) {
//     if (req.session.user && (await checkIfUserExist(req.session.user))) {
//       redis.del(`SESSION:${req.session.user}`);
//       await req.session.destroy();

//       return {
//         redirect: {
//           basePath: false,
//           destination: basePath,
//           permanent: false,
//         },
//       };
//     }

//     return {
//       redirect: {
//         basePath: false,
//         destination: `${basePath}/admin/login`,
//         permanent: false,
//       },
//     };
//   },
//   sessionConfig
// );
