const graphql = require('graphql')

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLString,
    GraphQLNonNull
} = graphql
//Scalar Type
/**
 * String = GraphQLString
 * int
 * Float
 * Boolean
 * ID
 */
const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'Represents a Person type',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type:new GraphQLNonNull(GraphQLInt) },
        isMarried: { type: GraphQLBoolean },
        gpa: { type: GraphQLFloat },

        justAType: {
            type: Person,
            resolve(parent, args){
                return parent
            }
        }

    })
})
//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields : {
        person: {
            type: Person,
            resolve(parent, args){
                let personObj = {
                    name: 'Nilton',
                    age: 36,
                    isMarried: true,
                    gpa: 3.5
                }
                return personObj
            }
        }
    }
})

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
})