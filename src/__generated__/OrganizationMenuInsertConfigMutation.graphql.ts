/**
 * @generated SignedSource<<becebdc17ad8b02be48fb3515a5e4e5b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateUserConfigInput = {
  clientMutationId?: string | null;
  defaultOrganization: number;
};
export type OrganizationMenuInsertConfigMutation$variables = {
  input: CreateUserConfigInput;
};
export type OrganizationMenuInsertConfigMutationVariables = OrganizationMenuInsertConfigMutation$variables;
export type OrganizationMenuInsertConfigMutation$data = {
  readonly createUserConfig: {
    readonly userConfig: {
      readonly defaultOrganization: number;
    } | null;
  } | null;
};
export type OrganizationMenuInsertConfigMutationResponse = OrganizationMenuInsertConfigMutation$data;
export type OrganizationMenuInsertConfigMutation = {
  variables: OrganizationMenuInsertConfigMutationVariables;
  response: OrganizationMenuInsertConfigMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "defaultOrganization",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationMenuInsertConfigMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateUserConfigPayload",
        "kind": "LinkedField",
        "name": "createUserConfig",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "UserConfig",
            "kind": "LinkedField",
            "name": "userConfig",
            "plural": false,
            "selections": [
              (v2/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "OrganizationMenuInsertConfigMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateUserConfigPayload",
        "kind": "LinkedField",
        "name": "createUserConfig",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "UserConfig",
            "kind": "LinkedField",
            "name": "userConfig",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
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
    "cacheID": "5db121a57a5a11a26177c686aa4c90ba",
    "id": null,
    "metadata": {},
    "name": "OrganizationMenuInsertConfigMutation",
    "operationKind": "mutation",
    "text": "mutation OrganizationMenuInsertConfigMutation(\n  $input: CreateUserConfigInput!\n) {\n  createUserConfig(input: $input) {\n    userConfig {\n      defaultOrganization\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7c0cd16dc403e74fc1f30635d556718d";

export default node;
