import React, { useState } from "react";
import { Box, Button, Select, Input } from "@chakra-ui/react";
import { Grid, Heading, Divider, Flex, Spacer } from "@chakra-ui/react";
import { graphql, useFragment } from "react-relay/hooks";
import useMutation from "./useMutation";

const gridButtonStyle = {
  color: "white",
  backgroundColor: "#888888",
  borderRadius: "15px",
};

const gridInputStyle = {
  borderColor: "#adadad",
  color: "#adadad",
  borderRadius: "15px",
  borderWidth: "2px",
};

const InsertConfigMutation = graphql`
  mutation OrganizationMenuInsertConfigMutation(
    $input: CreateUserConfigInput!
  ) {
    createUserConfig(input: $input) {
      userConfig {
        defaultOrganization
      }
    }
  }
`;

const InsertInviteMutation = graphql`
  mutation OrganizationMenuInsertInviteMutation(
    $input: CreateInviteInput!
    $connections: [ID!]!
  ) {
    createInvite(input: $input) {
      invite
        @appendNode(connections: $connections, edgeTypeName: "InvitesEdge") {
        organizationId
        email
      }
    }
  }
`;

const DeleteOrganizationUserMutation = graphql`
  mutation OrganizationMenuDeleteOrganizationUserMutation(
    $input: DeleteOrganizationUserInput!
    $connections: [ID!]!
  ) {
    deleteOrganizationUser(input: $input) {
      organizationUser {
        id @deleteEdge(connections: $connections)
        organizationByOrganizationId {
          rowId
          slug
          userByUserId {
            email
          }
        }
      }
    }
  }
`;

const DeleteInviteMutation = graphql`
  mutation OrganizationMenuDeleteInviteMutation(
    $input: DeleteInviteInput!
    $connections: [ID!]!
  ) {
    deleteInvite(input: $input) {
      invite {
        id @deleteEdge(connections: $connections)
        organizationId
        email
      }
    }
  }
`;

const organizationUsersFragment = graphql`
  fragment OrganizationMenuFragment_organizationUsers on Query
  @argumentDefinitions(organization: { type: "Int" }) {
    allOrganizationUsers(condition: { organizationId: $organization }) {
      __id
      edges {
        node {
          userId
          organizationId
          userByUserId {
            email
          }
          organizationByOrganizationId {
            rowId
            slug
            userByUserId {
              email
            }
          }
        }
      }
    }
  }
`;

const organizationFragment = graphql`
  fragment OrganizationMenuFragment_organization on Query {
    allOrganizations {
      edges {
        node {
          rowId
          slug
        }
      }
    }
  }
`;

const inviteFragment = graphql`
  fragment OrganizationMenuFragment_invite on Query
  @argumentDefinitions(organization: { type: "Int" }) {
    allInvites(condition: { organizationId: $organization }) {
      __id
      edges {
        node {
          id
          organizationId
          email
        }
      }
    }
  }
`;

const userConfigFragment = graphql`
  fragment OrganizationMenuFragment_userConfig on Query {
    allUserConfigs {
      edges {
        node {
          defaultOrganization
        }
      }
    }
  }
`;

function sendEmail(email, slug) {
  return fetch("/api/invite", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: `email=${email}&slug=${slug}`, // body data type must match "Content-Type" header
  });
}

export function OrganizationMenu({ query, organization }) {
  const [addEmail, setAddEmail] = useState("");
  const [isConfigPending, insertConfig] = useMutation(InsertConfigMutation) as [
    boolean,
    (config?: any) => void
  ];
  const [isInvitePending, insertInvite] = useMutation(InsertInviteMutation) as [
    boolean,
    (config?: any) => void
  ];
  const [isDeleteOrgUserPending, deleteOrgUser] = useMutation(
    DeleteOrganizationUserMutation
  ) as [boolean, (config?: any) => void];
  const [isDeleteInvitePending, deleteInvite] = useMutation(
    DeleteInviteMutation
  ) as [boolean, (config?: any) => void];
  const { allOrganizationUsers } = useFragment(
    organizationUsersFragment,
    query
  );
  const defaultOrganization =
    allOrganizationUsers?.edges[0].node.organizationByOrganizationId;
  const defaultUser = allOrganizationUsers?.edges[0].node.userByUserId;
  const { allOrganizations } = useFragment(organizationFragment, query);
  const { allInvites } = useFragment(inviteFragment, query);

  function onAddUser() {
    // slug not used in insert invite
    sendEmail(addEmail, defaultOrganization.slug);
    // run relay mutation
    insertInvite({
      variables: {
        input: {
          organizationId: organization,
          email: addEmail,
        },
        connections: [allInvites.__id],
      },
      updater: (store) => {},
    });
  }

  function onRemoveUser(userId) {
    deleteOrgUser({
      variables: {
        input: {
          organizationId: organization,
          userId,
        },
        connections: [allOrganizationUsers.__id],
      },
    });
  }

  function onRemoveInvite(email) {
    deleteInvite({
      variables: {
        input: {
          organizationId: organization,
          email,
        },
        connections: [allInvites.__id],
      },
    });
  }

  return (
    <>
      <Flex>
        <Spacer />
        <Select
          onChange={(e) => {
            insertConfig({
              variables: {
                input: {
                  defaultOrganization: parseInt(e.target.value),
                },
              },
              updater: (store) => {},
            });
            window.location.href = `/${e.target.value}`;
          }}
          width="200px"
          bg="black"
          color="white"
          borderRadius="20"
          value={organization}
        >
          {allOrganizations?.edges?.map((edge) => {
            const { rowId, slug } = edge.node;
            return (
              <option
                key={rowId}
                value={rowId}
                defaultValue={organization}
                style={{ backgroundColor: "black" }}
              >
                {slug}
              </option>
            );
          })}
        </Select>
      </Flex>

      <Heading as="h2" size="xl" my="5" color="#666666">
        Admins
      </Heading>
      <Grid templateColumns="repeat(6, 1fr)" gap={6} mb="5">
        <Box>{defaultUser?.email}</Box>
      </Grid>

      <Divider orientation="horizontal" />

      <Heading as="h2" size="xl" my="5" color="#666666">
        Users
      </Heading>
      <Grid templateColumns="repeat(6, 1fr)" gap={6} mb="5">
        {allInvites?.edges
          ?.filter((edge) => {
            const { email } = edge.node;
            // do not show user's own invite, and show only focused organization
            return email !== defaultUser?.email;
          })
          .map((edge) => {
            const { email } = edge.node;
            return (
              <span key={email}>
                <Box>{email}</Box>
                <Button
                  size="sm"
                  onClick={() => onRemoveInvite(email)}
                  style={gridButtonStyle}
                >
                  Remove
                </Button>
                <Button
                  size="sm"
                  onClick={() => sendEmail(email, defaultOrganization.slug)}
                  style={gridButtonStyle}
                >
                  Resend Invite
                </Button>
              </span>
            );
          })}
        {allOrganizationUsers?.edges
          ?.filter((edge) => {
            // do not show user's own organization entry
            return edge.node.userByUserId.email !== defaultUser?.email;
          })
          .map((edge) => {
            const { userByUserId, organizationByOrganizationId, userId } =
              edge.node;
            const { slug } = organizationByOrganizationId;
            const { email } = userByUserId;
            return (
              <span key={slug}>
                <Box>{email}</Box>
                <Button
                  size="sm"
                  onClick={() => onRemoveUser(userId)}
                  style={gridButtonStyle}
                >
                  Remove
                </Button>
                <Button
                  size="sm"
                  onClick={() => sendEmail(email, slug)}
                  style={gridButtonStyle}
                >
                  Reset Password
                </Button>
              </span>
            );
          })}
        <Input
          type="email"
          placeholder="Email"
          style={gridInputStyle}
          onChange={(e) => setAddEmail(e.target.value)}
        />
        <Button size="sm" style={gridButtonStyle} onClick={onAddUser}>
          Add
        </Button>
      </Grid>
    </>
  );
}
