import React from "react"
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button
} from "@chakra-ui/react"

function alert({ title, body, click, isOpen, setIsOpen }) {
    const onClose = () => setIsOpen(false)
    const cancelRef = React.useRef()

    return (
        <>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            {title}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {body}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button data-cy="alert_confirm" variant="solid" color="white" backgroundColor="primary.500" _hover={{ background: "hover.500" }} onClick={() => { click(); setIsOpen(false); }} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default alert;