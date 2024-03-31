import { useState } from 'react';
import DefaultHeader from '../../components/admin/default/DefaultHeader';
import DefaultFooter from '../../components/default/DefaultFooter';
import DefaultHead from '../../components/Header/Header';
import { checkIfUserExist } from '../../lib/auth';

export interface AdminProjectsProps {}

// function FetchHandler(url: string, type: string = "Project") {
//   return new Promise((resolve, reject) => {
//     const toastId = toast.loading("Please wait...");
//     fetch(url, { method: "POST" })
//       .then((res) => res.json())
//       .then((data: DefaultRes) => {
//         if (data.status !== "OK") {
//           resolve(false);
//           return toast.update(toastId, {
//             render: `${type}: ${data.message}`,
//             type: "error",
//             isLoading: false,
//             ...ToastDefault,
//           });
//         }

//         resolve(true);
//         toast.update(toastId, {
//           render: `${type}: Success`,
//           type: "success",
//           isLoading: false,
//           ...ToastDefault,
//         });
//       })
//       .catch((err) => {
//         resolve(false);
//         return toast.update(toastId, {
//           render: `${type}: ${err.message}`,
//           type: "error",
//           isLoading: false,
//           ...ToastDefault,
//         });
//       });
//   });
// }

export default function AdminProjects(props: AdminProjectsProps) {
  const [page, onNextPage] = useState<number>(0);
  const [hasMore, onReachEnd] = useState(props.hasMore);
  const [projects, onScrollLoad] = useState(props.projects);

  return (
    <>
      <DefaultHead>
        <title>Projects</title>
        <link
          rel="preload"
          href={`${basePath}/fonts/pixel-bit-advanced.ttf`}
          as="font"
          crossOrigin=""
        />
      </DefaultHead>
      <DefaultHeader />

      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        transition={Bounce}
        closeOnClick
        theme="colored"
        rtl={false}
        draggable
      /> */}

      {/* <Container className="mt-4">
        <InfiniteScroll
          className="row"
          dataLength={projects.length}
          next={() =>
            preloadData<ProjectData>("projects", page + 1, {
              "file[role]": "thumbnail",
            })
              .then((data) => onScrollLoad([...projects, ...data]))
              .catch(() => onReachEnd(false))
              .finally(() => onNextPage(page + 1))
          }
          hasMore={hasMore}
          loader={
            <Col lg="4" md="6" sm="11" className="my-3 text-center p-4">
              <Container className="d-flex h-100 w-80">
                <Col className="align-self-center text-center">
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                </Col>
              </Container>
            </Col>
          }
        >
          <AddCard href={`${basePath}/admin/projects/create`} />
          {projects.map((item, i) => {
            const img = item.files.map(
              (file) => `${voidUrl}/${item.name}/${formPath(file)}`
            );

            return (
              <AdminCard
                key={i}
                id={item.id || 0}
                title={item.title}
                flag={item.flag as FlagType}
                href={`/projects/${item.name}`}
                img={img.length > 1 ? img : img[0]}
                desc={item.desc}
                event={{
                  metrics: {
                    href: `${basePath}/admin/projects/metrics/${item.name}`,
                  },
                  modify: {
                    href: `${basePath}/admin/projects/update/${item.name}`,
                  },
                  delete: {
                    // onClick: () => {
                    //   FetchHandler(
                    //     `${basePath}/api/link/del?project_id=${item.id}&project=${item.name}`,
                    //     "Link"
                    //   ).then((ok) => {
                    //     if (!ok) return;
                    //     FetchHandler(
                    //       `${basePath}/api/file/del?project_id=${item.id}&project=${item.name}`,
                    //       "Files"
                    //     ).then((ok) => {
                    //       if (!ok) return;
                    //       FetchHandler(
                    //         `${basePath}/api/projects/del?project=${item.name}&flag=${item.flag}`
                    //       ).then((ok) => {
                    //         if (!ok) return;
                    //         setTimeout(() => window.location.reload(), 1000);
                    //       });
                    //     });
                    //   });
                    // },
                  },
                }}
              />
            );
          })}
        </InfiniteScroll>
      </Container> */}

      <DefaultFooter name="Menu">
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}

// export const getServerSideProps = withIronSessionSsr(
//   async function getServerSideProps({ req }) {
//     if (!req.session.user || !(await checkIfUserExist(req.session.user))) {
//       return {
//         redirect: {
//           basePath: false,
//           destination: `${basePath}/admin/login`,
//           permanent: false,
//         },
//       };
//     }

//     const projects = await LoadRecords("project", {
//       page: 0,
//       "file[role]": "thumbnail",
//     });

//     return {
//       props: {
//         hasMore: !!projects,
//         projects: projects || [],
//       },
//     };
//   },
//   sessionConfig
// );
