import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlCliet } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      <div> hello </div>
      {!data
        ? null
        : data.posts.map((post) => <div key={post.id}>{post.title}</div>)}
    </>
  );
};
export default withUrqlClient(createUrqlCliet, { ssr: true })(Index);
