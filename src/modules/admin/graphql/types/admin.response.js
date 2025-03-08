import { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID, GraphQLBoolean } from "graphql";

const ImageType = new GraphQLObjectType({
    name: "ImageType",
    fields: {
        secure_url: { type: GraphQLString },
        public_id: { type: GraphQLString },
    },
});


const UserType = new GraphQLObjectType({
    name: "UserType",
    fields: {
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        mobileNumber: { type: GraphQLString },
        role: { type: GraphQLString },
        isFreezed: { type: GraphQLBoolean },
        profilePicture: { type: ImageType },
        coverPicture: { type: ImageType },
    }
});


const CompanyType = new GraphQLObjectType({
    name: "CompanyType",
    fields: {
        id: { type: GraphQLID },
        companyName: { type: GraphQLString },
        description: { type: GraphQLString },
        industry: { type: GraphQLString },
        address: { type: GraphQLString },
        numberOfEmployees: { type: GraphQLString },
        companyEmail: { type: GraphQLString },
        Logo: { type: ImageType },
        coverPic: { type: ImageType },
    }
});

export const allUsersResponseAndCompanies = new GraphQLObjectType({
    name: "AllUsersResponseAndCompanies",
    fields: {
        users: { type: new GraphQLList(UserType) },
        companies: { type: new GraphQLList(CompanyType) }
    }
});
