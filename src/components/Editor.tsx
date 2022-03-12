import React from "react";
import { Box, Button, Stack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { EditorContent } from "@tiptap/react";

const DynamicLoomSDK = dynamic(() => import("./LoomSDK"), {
  ssr: false,
});

export default function Editor({ editor, onClick }) {
  return (
    <>
      <Box height={100} data-cy="editor">
        <Box as={EditorContent} editor={editor} h={100} data-cy="editor" />
      </Box>
      <br />
      <br />
      <br />
      <Stack spacing={4} direction="row" align="center">
        <Button data-cy="save" width="170px" borderRadius={20} {...{ onClick }}>
          Save
        </Button>
      </Stack>
    </>
  );
}
