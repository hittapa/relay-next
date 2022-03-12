/**
 * @generated SignedSource<<e655a94b7ce49e370e5ccceff0f89ec8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteOrganizationUserInput = {
  clientMutationId?: string | null;
  organizationId: number;
  userId: number;
};
export type OrganizationMenuDeleteOrganizationUserMutation$variables = {
  input: DeleteOrganizationUserInput;
  connections: ReadonlyArray<string>;
};
export type OrganizationMenuDeleteOrganizationUserMutationVariables = OrganizationMenuDeleteOrganizationUserMutation$variables;
export type OrganizationMenuDeleteOrganizationUserMutation$data = {
  readonly deleteOrganizationUser: {
    readonly organizationUser: {
      readonly id: string;
      readonly organizationByOrganizationId: {
        readonly rowId: number;
        readonly slug: string | null;
        readonly userByUserId: {
          readonly email: string | null;
        } | null;
      } | null;
    } | null;
  } | null;
};
export type OrganizationMenuDeleteOrganizationUserMutationResponse = OrganizationMenuDeleteOrganizationUserMutation$data;
export type OrganizationMenuDeleteOrganizationUserMutation = {
  variables: OrganizationMenuDeleteOrganizationUserMutationVariables;
  response: OrganizationMenuDeleteOrganizationUserMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rowId",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationMenuDeleteOrganizationUserMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteOrganizationUserPayload",
        "kind": "LinkedField",
        "name": "deleteOrganizationUser",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "OrganizationUser",
            "kind": "LinkedField",
            "name": "organizationUser",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Organization",
                "kind": "LinkedField",
                "name": "organizationByOrganizationId",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "userByUserId",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "OrganizationMenuDeleteOrganizationUserMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteOrganizationUserPayload",
        "kind": "LinkedField",
        "name": "deleteOrganizationUser",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "OrganizationUser",
            "kind": "LinkedField",
            "name": "organizationUser",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "filters": null,
                "handle": "deleteEdge",
                "key": "",
                "kind": "ScalarHandle",
                "name": "id",
                "handleArgs": [
                  {
                    "kind": "Variable",
                    "name": "connections",
                    "variableName": "connections"
                  }
                ]
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Organization",
                "kind": "LinkedField",
                "name": "organizationByOrganizationId",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "userByUserId",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c240c555f69a897b7f2b3fa52c862688",
    "id": null,
    "metadata": {},
    "name": "OrganizationMenuDeleteOrganizationUserMutation",
    "operationKind": "mutation",
    "text": "mutation OrganizationMenuDeleteOrganizationUserMutation(\n  $input: DeleteOrganizationUserInput!\n) {\n  deleteOrganizationUser(input: $input) {\n    organizationUser {\n      id\n      organizationByOrganizationId {\n        rowId\n        slug\n        userByUserId {\n          email\n          id\n        }\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c12cba8c81c07ec8a449c986859e0a6f";

export default node;
