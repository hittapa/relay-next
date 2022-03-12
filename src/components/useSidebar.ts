import { useMemo } from "react"
import { graphql, useFragment } from 'react-relay';
import useMutation from './useMutation'
import { rearrange } from "./useCategoryDrag";




const SortCategoryMutation = graphql`
  mutation useSidebarSortMutation($input:SortCategoryInput!) {
    sortCategory(input: $input) {
      query {
        allCategories {
          __id
          edges {
          node {
            tagsByCategoryId {
              __id
              edges {
                node {
                  name
                  rowId
                }
              }
            }
            rowId
            name
            color
            organizationId
            configCategoriesByCategoryId {
              edges {
                node {
                  collapse
                  sort
                }
              }
            }
          }
        }
      }
    }
  }
}
`

export function useSidebar({ categories, messages }) {
  const [isSortCategoryPending, sortCategory] = useMutation(SortCategoryMutation);
  const messageTagConnections = useMemo(() => {
    return messages?.allMessages?.edges?.map(edge => {
      return edge.node.messageTagsByMessageId.__id;
    })
  }, [messages]);

  /**
   * Run sort category mutation
   * @param {number} dragged Index of dragged item in category list
   * @param {number} hovered Index of drop zone in category list
   */
  function moveCategory(dragged, hovered) {
    if(typeof sortCategory === 'function') {
    sortCategory({
      variables: {
        input: {
          categoryIds: sidebarCollection.rowIds,
          sort: rearrange(sidebarCollection.sort, dragged, hovered)
        }
      }
    })
  }
  }

  const sidebarCollection = useMemo(() => ({
    // for dnd
    rowIds: categories?.edges.map(edge => edge.node.rowId),
    sort: categories?.edges.map((edge, index) => {
      // sort categories if no sort exist, occurs when user has not used DnD before
      if (edge.node.sort > 0) {
        return edge.node.sort;
      } else {
        return index + 1;
      }
    }),
    categories: categories?.edges.map(edge => {
        return {
          node: {
            // sort nodes, graphile has trouble with sort across join
            // would need default category config on user creation to make it work
            sort: edge.node.configCategoriesByCategoryId?.edges[0]?.node.sort,
            ...edge.node
          }
        }
      }).sort((a, b) => {
        if (a.node.sort < b.node.sort) {
          return -1;
        } else {
          return 1;
        }
      }),
      __id: categories?.__id
  }), [categories]);

  return [sidebarCollection, moveCategory, messageTagConnections]
}