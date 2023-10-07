import {makeExecutableSchema} from "@graphql-tools/schema";
import {loadSchemaSync} from "@graphql-tools/load";
import {GraphQLFileLoader} from "@graphql-tools/graphql-file-loader";
import {resolvers} from "./resolvers/index.js";
import path from "path";
import {fileURLToPath} from "url";

const __graph = path.dirname(fileURLToPath(import.meta.url))

export const schema = makeExecutableSchema({
    typeDefs: loadSchemaSync(path.resolve(__graph, 'schemas/**/*.graphql'), {
        loaders: [new GraphQLFileLoader()],
    }),
    resolvers
})