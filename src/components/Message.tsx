import React from "react";
import { graphql } from "react-relay";
import useMutation from "./useMutation";
import { Box, Badge, Button, HStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { catchJSON } from "../utils/editor";
import { useRouter } from "next/router";

const DeleteTagMutation = graphql`
  mutation MessageDeleteTagMutation(
    $input: RemoveMessageTagInput!
    $connections: [ID!]!
  ) {
    removeMessageTag(input: $input) {
      query {
        allMessages {
          nodes {
            messageTagsByMessageId {
              edges {
                node {
                  messageId
                  tagByTagId {
                    id @deleteEdge(connections: $connections)
                    rowId
                  }
                }
              }
            }
            content
          }
        }
      }
    }
  }
`;

const LoomEmbed = dynamic(() => import("./LoomEmbed"), {
  ssr: false,
});

export function AddTagToMessage({ click }) {
  return (
    <Button mr={1} data-cy="add_tag_to_message" onClick={click}>
      +
    </Button>
  );
}

export default function Message({ message, tags }) {
  const {
    rowId,
    content,
    loomSharedUrl,
    messageTagsByMessageId,
    organizationId,
  } = message;
  const parsed = catchJSON(content);
  const messageTags = messageTagsByMessageId.edges.map(
    ({ node }) => node.tagByTagId
  );
  const [isDeleteMessageTagPending, deleteMessageTag] = useMutation(
    DeleteTagMutation
  ) as [boolean, (config?: any) => void];
  const editor = useEditor({
    editable: false,
    content: parsed,
    extensions: [StarterKit],
  });
  const router = useRouter();

  function onDeleteMessageTag(tagId, connectionId) {
    deleteMessageTag({
      variables: {
        input: {
          messageId: rowId,
          tagId: tagId,
        },
        connections: [connectionId],
      },
      updater: (store) => {},
    });
  }

  function onDoubleClick() {
    router.push({
      pathname: `/${organizationId}/edit/message/${rowId}`,
      query: {
        tags,
      },
    });
  }

  function colorize({ active, color }) {
    if (active) {
      return {
        color: "white",
        bg: `#${color.replace("#", "")}`,
      };
    }
    return {
      color: `#${color.replace("#", "")}`,
      bg: "white",
    };
  }

  return (
    <Box
      boxShadow="4px 4px 15px 0 rgb(10 8 59 / 6%)"
      borderRadius="10px"
      textAlign="left"
      display="inline-block"
      data-cy="message"
      {...{ onDoubleClick }}
    >
      <Box p={4} data-cy="body">
        <EditorContent editor={editor} />
        {loomSharedUrl && <LoomEmbed {...{ loomSharedUrl }} />}
      </Box>
      <Box data-cy="tags" px={4} py={2} minWidth="340px">
        {messageTags.map((messageTag, index) => {
          const { name, categoryByCategoryId, rowId } = messageTag;
          const { color } = categoryByCategoryId;
          return (
            <Badge
              data-cy="message_tag"
              key={index}
              px={2}
              mt={1}
              border={`2px solid #${color.replace("#", "")}`}
              {...colorize({ active: tags?.includes(rowId), color })}
            >
              <Box>{name}</Box>
            </Badge>
          );
        })}
      </Box>
    </Box>
  );
}
