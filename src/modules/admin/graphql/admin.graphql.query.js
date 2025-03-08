import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import { findAllUsersAndCompanies } from "./admin.graphql.service.js";
import { allUsersResponseAndCompanies } from "./types/admin.response.js";
import { allMiddleware } from "../../../graphql/functions.js";

import { isAuthenticated } from "../../../graphql/authantication.graphql.js";
import { roles } from "../../../utils/enum/enum.js";

export const adminQuery = {
  allUsersAndCompanies: {
    type: new GraphQLObjectType({
      name: "AllUsersAndCompaniesResponse",
      fields: {
        success: { type: GraphQLBoolean },
        status: { type: GraphQLInt },
        results: { type: allUsersResponseAndCompanies },
      },
    }),
    resolve: allMiddleware(
      findAllUsersAndCompanies,
      isAuthenticated(roles.admin)
    ),
  },
};
