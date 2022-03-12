import React from "react";
import Nav from "../../../components/Nav";
import { withRelay } from "relay-nextjs";
import { graphql, usePreloadedQuery } from "react-relay/hooks";
import { Grid, Box, Center } from "@chakra-ui/react";
import { getClientEnvironment } from "../../../lib/client_environment";
import Editor from "../../../components/Editor";
import useMutation from "../../../components/useMutation";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/router";
import { SketchPicker } from "react-color";
import { parse } from "../../../utils/route";

const InsertCategoryMutation = graphql`
  mutation categoryInsertMutation($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      category {
        rowId
        name
        color
        organizationId
      }
    }
  }
`;

const CreateQuery = graphql`
  query categoryCreateQuery($organization: Int!, $tag: [Int]) {
    query {
      ...SidebarFragment_messages
        @arguments(organization: $organization, tag: $tag)
      ...SidebarFragment_categories
        @arguments(organization: $organization, tag: $tag)
      ...NavFragment_organization @arguments(organization: $organization)
    }
  }
`;

function Create({ preloadedQuery }) {
  const { query } = usePreloadedQuery(CreateQuery, preloadedQuery) as any;
  const [isInsertCategoryPending, insertCategory] = useMutation(
    InsertCategoryMutation
  ) as [boolean, (config?: any) => void];
  const router = useRouter();
  const { organization, tags } = router.query;
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });
  const path = router.pathname.split("/");
  const [color, setColor] = React.useState({ hex: "#000000" });

  function onClick() {
    const name = JSON.stringify(editor.getJSON());
    const organizationId = parse(organization)[0];
    insertCategory({
      variables: {
        input: {
          name,
          color: color.hex,
          organizationId,
        },
      },
      updater: (store) => {
        const payload = store.getRootField("createCategory");
        const category = payload.getLinkedRecord("category");
        const rowId = category.getValue("rowId");
        router.push({
          pathname: `/${organization}/edit/category/${rowId}`,
          query: {
            tags,
          },
        });
      },
    });
  }

  return (
    <Grid
      data-cy="grid"
      templateColumns="[nav] 4rem [sidebar] 2fr [content] 7fr"
      bg={"background.50"}
      color={"text.600"}
      minHeight="100vh"
      d={["none", "none", "none", "grid", "grid"]}
    >
      <Nav {...{ query, organization, path }} />
      <Box gridColumn="sidebar" maxHeight="99vh" overflowY="scroll">
        <Center mt={8}>
          <SketchPicker color={color} onChange={setColor} />
        </Center>
      </Box>
      <Box
        as="main"
        gridColumn="content"
        pt={2}
        px={8}
        mx="auto"
        sx={{ textAlign: "center" }}
        width="100%"
        maxHeight="99vh"
        overflowY="scroll"
      >
        <Editor {...{ editor, onClick }} />
      </Box>
    </Grid>
  );
}

function Loading() {
  return <div>Loading...</div>;
}
interface NextCtx {
  cookies: any;
}

export default withRelay(Create, CreateQuery, {
  // Fallback to render while the page is loading.
  // This property is optional.
  fallback: <Loading />,
  // Create a Relay environment on the client-side.
  // Note: This function must always return the same value.
  createClientEnvironment: () => getClientEnvironment(),
  // Gets server side props for the page.
  serverSideProps: async (ctx) => {
    // This is an example of getting an auth token from the request context.
    // If you don't need to authenticate users this can be removed and return an
    // empty object instead.

    return {
      token: (ctx.req as unknown as NextCtx).cookies[process.env.COOKIE_NAME],
    };
  },
  // Server-side props can be accessed as the second argument
  // to this function.
  createServerEnvironment: async (
    ctx,
    // The object returned from serverSideProps. If you don't need a token
    // you can remove this argument.
    { token }
  ) => {
    const { createServerEnvironment } = await import(
      "../../../lib/server_environment"
    );
    return createServerEnvironment(token);
  },
  variablesFromContext: (ctx) => {
    return {
      ...ctx.query,
      ...{
        tags: parse(ctx.query.tag),
        organization: parse(ctx.query.organization)[0],
      },
    };
  },
});
