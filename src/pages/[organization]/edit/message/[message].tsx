import React, { useState } from "react";
import Nav from "../../../../components/Nav";
import { Sidebar } from "../../../../components/Sidebar";
import { withRelay } from "relay-nextjs";
import { graphql, usePreloadedQuery, useFragment } from "react-relay/hooks";
import { Grid, Box } from "@chakra-ui/react";
import { getClientEnvironment } from "../../../../lib/client_environment";
import Editor from "../../../../components/Editor";
import { catchJSON } from "../../../../utils/editor";
import useMutation from "../../../../components/useMutation";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/router";
import { parse } from "../../../../utils/route";

const UpdateMessageMutation = graphql`
  mutation MessageUpdateMessageMutation($input: UpdateMessageInput!) {
    updateMessage(input: $input) {
      messages {
        rowId
        content
        loomSharedUrl
        organizationId
        messageTagsByMessageId {
          __id
          edges {
            node {
              __id
              tagId
              tagByTagId {
                __id
                rowId
                name
                categoryByCategoryId {
                  color
                }
              }
            }
          }
        }
      }
    }
  }
`;

const EditQuery = graphql`
  query Message_messageQuery($message: Int!, $organization: Int!, $tag: [Int]) {
    query {
      ...Message_messageFragment @arguments(message: $message)
      ...SidebarFragment_messages
        @arguments(organization: $organization, tag: $tag)
      ...SidebarFragment_categories
        @arguments(organization: $organization, tag: $tag)
      ...NavFragment_organization @arguments(organization: $organization)
    }
  }
`;

const messageFragment = graphql`
  fragment Message_messageFragment on Query
  @argumentDefinitions(message: { type: "Int!" }) {
    query {
      messageByRowId(rowId: $message) {
        content
        organizationId
        rowId
        loomSharedUrl
        messageTagsByMessageId {
          edges {
            node {
              tagId
            }
          }
        }
      }
    }
  }
`;

function Edit({ preloadedQuery }) {
  const { query } = usePreloadedQuery(EditQuery, preloadedQuery) as any;
  const { messageByRowId } = useFragment(messageFragment, query).query;
  const [isUpdateMessagePending, updateMessage] = useMutation(
    UpdateMessageMutation
  ) as [boolean, (config?: any) => void];
  const [loom, setLoom] = useState(messageByRowId.loomSharedUrl);
  const editor = useEditor({
    extensions: [StarterKit],
    content: catchJSON(messageByRowId.content),
  });
  const router = useRouter();
  const { organization, tags, message } = router.query;
  const path = router.pathname.split("/");
  const parsedTags = parse(tags);

  function onClick(href) {
    const id = messageByRowId.rowId;
    const content = JSON.stringify(editor.getJSON());
    const loomSharedUrl = loom;
    updateMessage({
      variables: {
        input: {
          id,
          content,
          loomSharedUrl,
        },
      },
      updater: (store) => {
        // redirect to tiles on save and edit on tag click
        router.push(href);
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
        <Sidebar
          path={`edit/message/${message}`}
          tags={parsedTags}
          {...{ query, onClick }}
        />
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
        <Editor
          {...{ editor }}
          onClick={() =>
            onClick({
              pathname: `/${organization}`,
              query: {
                tags: parsedTags,
              },
            })
          }
        />
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

export default withRelay(Edit, EditQuery, {
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
      "../../../../lib/server_environment"
    );
    return createServerEnvironment(token);
  },
  variablesFromContext: (ctx) => {
    return {
      ...ctx.query,
      ...{
        message: parse(ctx.query.message)[0],
        tag: parse(ctx.query.tag),
        organization: parse(ctx.query.organization)[0],
      },
    };
  },
});
