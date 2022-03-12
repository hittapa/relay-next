import React, { useState } from "react";
import { Box, Text, Input, Button, useBreakpointValue } from "@chakra-ui/react";
import useMutation from "./useMutation";
import Link from "next/link";
import { graphql } from "react-relay";

const InsertTagMutation = graphql`
  mutation TagInsertTagMutation($input: CreateTagInput!, $connections: [ID!]!) {
    createTag(input: $input) {
      tag @appendNode(connections: $connections, edgeTypeName: "TagsEdge") {
        id
        rowId
        name
      }
    }
  }
`;

const DeleteTagMutation = graphql`
  mutation TagDeleteTagMutation(
    $tag: DeleteTagInput!
    $messageTag: DeleteMessageTagInput!
    $tagConnections: [ID!]!
    $messageTagConnections: [ID!]!
  ) {
    deleteMessageTag(input: $messageTag) {
      query {
        allMessages {
          nodes {
            messageTagsByMessageId {
              edges {
                node {
                  messageId
                  tagByTagId {
                    id @deleteEdge(connections: $messageTagConnections)
                  }
                }
              }
            }
            content
          }
        }
      }
    }
    deleteTag(input: $tag) {
      tag {
        id @deleteEdge(connections: $tagConnections)
      }
    }
  }
`;

const UpdateTagMutation = graphql`
  mutation TagUpdateTagMutation($input: UpdateTagInput!) {
    updateTag(input: $input) {
      tag {
        rowId
        name
      }
    }
  }
`;

const InsertMessageTagMutation = graphql`
  mutation TagInsertMessageTagMutation(
    $input: CreateMessageTagInput!
    $connections: [ID!]!
  ) {
    createMessageTag(input: $input) {
      messageTag
        @appendNode(
          connections: $connections
          edgeTypeName: "MessageTagsEdge"
        ) {
        messageId
        tagId
        tagByTagId {
          name
          categoryByCategoryId {
            color
          }
        }
      }
    }
  }
`;

export function AddTag({ connection, category }) {
  const [name, setName] = useState("");
  const [isTagPending, insertTag] = useMutation(InsertTagMutation);

  // Editor submit callback
  function onSubmit(event) {
    event.preventDefault();
    if (typeof insertTag === "function") {
      insertTag({
        variables: {
          input: {
            name: name,
            categoryId: parseInt(category),
          },
          connections: [connection],
        },
        updater: (store) => {},
      });
      // Reset form text
      setName("");
    }
  }

  const breakpoint = useBreakpointValue(["sm", "sm", "sm", "md", "md"]);

  return (
    <Box>
      <Input
        size={breakpoint}
        maxWidth={28}
        borderLeftRadius={8}
        borderRightRadius={0}
        paddingX={2}
        paddingY={1}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tag Name"
        data-cy="add_tag_text"
        value={name}
      />
      <Button
        data-cy="add_tag_button"
        borderLeftRadius={0}
        size={breakpoint}
        onClick={onSubmit}
      >
        +
      </Button>
    </Box>
  );
}

function style({ active, color }) {
  const valid = color.replace("#", "");
  if (active) {
    return {
      color: "white",
      bg: `#${valid}`,
      _active: { bg: `#${valid}` },
      _hover: {
        bg: `#${valid}`,
        boxShadow: "2px 2px 2px 2px rgba(0,0,0,0.15)",
      },
    };
  } else {
    return {
      color: `#${valid}`,
      borderColor: `#${valid}`,
      bg: "white",
      _active: { bg: `white` },
      _hover: { bg: `white`, boxShadow: "2px 2px 2px 2px rgba(0,0,0,0.15)" },
    };
  }
}

export default function Tag({ color, name, active, href, onClick }) {
  return (
    <Box
      fontSize={[10, 10, 12, 12, 12]}
      p={2}
      minWidth="inherit"
      height="inherit"
      border="2px"
      {...style({ active, color })}
      data-cy="tag"
    >
      {!onClick && (
        <Text mt={1}>
          <Link {...{ href }} shallow={true}>
            {name}
          </Link>
        </Text>
      )}
      {onClick && (
        <Text mt={1} onClick={() => onClick(href)} cursor="pointer">
          {name}
        </Text>
      )}
    </Box>
  );
}
