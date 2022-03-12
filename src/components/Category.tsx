import React, { useState } from "react";
import Tag from "../components/Tag";
import {
  VStack,
  Box,
  Wrap,
  WrapItem,
  Button,
  Input,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useCategoryDrag } from "./useCategoryDrag";
import useMutation from "./useMutation";
import { graphql } from "react-relay";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { catchJSON } from "../utils/editor";

const DeleteCategoryMutation = graphql`
  mutation CategoryDeleteMutation(
    $input: DeleteCategoryInput!
    $connections: [ID!]!
  ) {
    deleteCategory(input: $input) {
      category {
        __id @deleteEdge(connections: $connections)
      }
    }
  }
`;

const InsertCategoryMutation = graphql`
  mutation CategoryInsertCategoryMutation(
    $input: CreateCategoryInput!
    $connections: [ID!]!
  ) {
    createCategory(input: $input) {
      category
        @appendNode(connections: $connections, edgeTypeName: "CategoriesEdge") {
        id
        rowId
        name
        color
        organizationId
        tagsByCategoryId {
          __id
          edges {
            node {
              name
              rowId
            }
          }
        }
      }
    }
  }
`;

export function AddCategory({ connectionId, organization }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("E53E3E");
  const [isCategoryPending, insertCategory] = useMutation(
    InsertCategoryMutation
  ) as [boolean, (config?: any) => void];

  // Editor submit callback
  function onSubmit(event) {
    event.preventDefault();
    insertCategory({
      variables: {
        input: {
          organizationId: organization,
          name,
          color,
        },
        connections: [connectionId],
      },
      updater: (store) => {},
    });
    // Reset form text
    setName("");
    setColor("");
  }

  const size = useBreakpointValue(["sm", "sm", "sm", "md", "md"]);

  return (
    <VStack paddingX={2}>
      <Input
        size={size}
        maxWidth={28}
        borderRadius={8}
        paddingX={2}
        paddingY={1}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        value={name}
        data-cy="add_category_name"
      />
      <Input
        size={size}
        maxWidth={28}
        borderRadius={8}
        paddingX={2}
        paddingY={1}
        onChange={(e) => setColor(e.target.value)}
        placeholder="Color"
        value={color}
      />
      <Button data-cy="add_category_button" onClick={(e) => onSubmit(e)}>
        Add
      </Button>
    </VStack>
  );
}

export function Category({
  category,
  index,
  moveCategory,
  tags,
  path,
  onClick,
  connections,
  edit,
}: {
  category: any;
  index: number;
  moveCategory: any;
  tags: number[];
  path: string;
  onClick?: any;
  connections?: any;
  edit?: boolean;
}) {
  const [ref] = useCategoryDrag({ category, index, onDrop: moveCategory });
  const { rowId, color, name, tagsByCategoryId, organizationId } = category;
  const [isConfirmOpen, setConfirmIsOpen] = useState(false);
  const [isDeleteCategoryPending, deleteCategory] = useMutation(
    DeleteCategoryMutation
  ) as [boolean, (config?: any) => void];

  const parsed = catchJSON(name);
  const view = useEditor({
    editable: false,
    content: parsed,
    extensions: [StarterKit],
  });

  function onDelete({ categoryId, connections }) {
    deleteCategory({
      variables: {
        input: {
          categoryId,
        },
        connections,
      },
      updater: (store) => {},
    });
  }

  return (
    <AccordionItem key={rowId} ref={ref} data-cy="category">
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <EditorContent editor={view} />
            {tagsByCategoryId?.edges
              .filter((edge) => tags?.includes(edge.node.rowId))
              .map((edge) => {
                return (
                  <Badge
                    data-cy="category_title_tag"
                    key={edge.node.rowId}
                    variant="outline"
                    color="white"
                    bg={`#${color.replace("#", "")}`}
                    px={2}
                    mx={2}
                    boxShadow="none"
                  >
                    <Box>{edge.node.name}</Box>
                  </Badge>
                );
              })}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        {edit && (
          <Button
            data-cy="delete_category"
            onClick={(e) => onDelete({ categoryId: rowId, connections })}
          >
            Delete
          </Button>
        )}
      </h2>
      <AccordionPanel pb={4}>
        <Wrap>
          {tagsByCategoryId?.edges.map((tag, index) => {
            const { name, rowId } = tag.node;
            let query = { tags: [] };
            if (tags?.includes(rowId)) {
              query.tags = tags.filter((tag) => tag !== rowId);
            } else {
              query.tags = [...tags, rowId];
            }
            query.tags = query.tags.filter((tag) => !!tag);

            return (
              <WrapItem key={index}>
                <Tag
                  active={tags.includes(rowId)}
                  href={{
                    pathname: `/${organizationId}/${path}`,
                    query,
                  }}
                  {...{ color, name, onClick }}
                />
              </WrapItem>
            );
          })}
        </Wrap>
      </AccordionPanel>
    </AccordionItem>
  );
}
