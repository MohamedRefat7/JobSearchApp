import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { adminQuery } from "./modules/admin/graphql/admin.graphql.query.js";


const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "MainQuery",
        fields: {
            ...adminQuery
        }
    })
})

export default schema;