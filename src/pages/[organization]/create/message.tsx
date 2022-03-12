import React, { useState } from "react";
import Nav from "../../../components/Nav";
import { Sidebar } from "../../../components/Sidebar";
import { withRelay } from "relay-nextjs";
import { graphql, usePreloadedQuery } from "react-relay/hooks";
import { Grid, Box, Button, Center } from "@chakra-ui/react";
import { getClientEnvironment } from "../../../lib/client_environment";
import Editor from "../../../components/Editor";
import useMutation from "../../../components/useMutation";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import CharaterCount from "@tiptap/extension-character-count";
import { useRouter } from "next/router";
import { parse } from "../../../utils/route";

const InsertMessageMutation = graphql`
  mutation messageInsertMutation($input: CreateMessageInput!) {
    createMessage(input: $input) {
      messages {
        rowId
        content
        organizationId
        loomSharedUrl
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

const CreateQuery = graphql`
  query messageCreateQuery($organization: Int!, $tag: [Int]) {
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
  const [isInsertMessagePending, insertMessage] = useMutation(
    InsertMessageMutation
  ) as [boolean, (config?: any) => void];
  const router = useRouter();
  const { organization, tags } = router.query;
  const [loom, setLoom] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      CharaterCount,
      Mention.configure({
        suggestion: {
          char: " ",
          prefixSpace: false,
          render: () => ({
            onStart: async (props) => {
              const chars = props.editor.storage.characterCount.characters();
              const { state } = props.editor.view;
              const { $from, $to } = state.selection;

              if (
                chars > 20 &&
                !props.editor.storage.predictiveSemaphore &&
                (new Date() > props.editor.storage.predictiveTimeout ||
                  props.editor.storage.predictiveTimeout === undefined)
              ) {
                props.editor.storage.predictiveSemaphore = true;
                const existing = props.editor.getText();
                const res = await fetch("/api/nlp", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    text: props.editor.getText().trimEnd(),
                  }),
                });
                const { text } = await res.json();
                props.editor.storage.predictiveText =
                  JSON.parse(text).data.text;
                const dt = new Date();
                dt.setSeconds(dt.getSeconds() + 30);
                props.editor.storage.predictiveTimeout = dt;
                const replaced = JSON.parse(text).data.text.replace(
                  existing,
                  ""
                );
                props.editor.commands.insertContent(replaced.trimEnd());
                props.editor.storage.predictiveSemaphore = false;
              }
            },
            decorationTag: "",
          }),
        },
      }),
    ],
    content: "",
  });
  const path = router.pathname.split("/");
  const parsedTags = parse(tags);

  function onClick(href) {
    const organizationId = parse(organization)[0];
    const content = JSON.stringify(editor?.getJSON());
    const loomSharedUrl = loom;
    insertMessage({
      variables: {
        input: {
          organizationId,
          content,
          loomSharedUrl,
          tags: parsedTags,
        },
      },
      updater: (store) => {
        // redirect to edit page on save
        const payload = store.getRootField("createMessage");
        const messages = payload.getLinkedRecords("messages");
        const rowId = messages[0].getValue("rowId");
        href.pathname = `${href.pathname}/${rowId}`;
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
        <Center my={5}>
          <Button
            onClick={() => router.push(`/${organization}/create/category`)}
            data-cy="create_category"
          >
            New Category
          </Button>
        </Center>
        <Sidebar
          path="edit/message"
          tags={parsedTags}
          edit={true}
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
        tags: parse(ctx.query.tag)[0],
        organization: parse(ctx.query.organization)[0],
      },
    };
  },
});
