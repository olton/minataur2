import GraphQLJSON, {GraphQLJSONObject} from "graphql-type-json";

const Query = {
    hello: () => 'Hello World!'
}

const Mutation = {
}

const Subscription = {
}

const Json = {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
}

export const resolvers = {Query, Mutation, Subscription, ...Json}