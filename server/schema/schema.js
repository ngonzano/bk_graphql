const graphql = require('graphql')
var _ = require('lodash')

const User = require("../model/user")
const Hobby = require("../model/hobby")
const Post = require("../model/post")

//dummy data

// const usersData = [
//     { id: '1', name: 'Nilton', age: 36, profession: 'Developer' },
//     { id: '2', name: 'yohanna', age: 33, profession: 'Cajera'},
//     { id: '3', name: 'Ivanna', age: 11, profession: 'Doctora' },
//     { id: '4', name: 'Luana', age: 7, profession: 'Abogada' },
//     { id: '5', name: 'Hanna', age: 3, profession: 'Policia' },
//     { id: '6', name: 'Lia', age: 2, profession: 'Bombera' },
// ]

// const hobbiesData = [
//     { id: '1', title: 'bailar', description: 'bailar mucha', userId: '6' },
//     { id: '2', title: 'jugar', description: 'Jugar con bloques', userId: '5'},
//     { id: '3', title: 'leer', description: 'leer muchos libros' , userId: '4'},
//     { id: '4', title: 'bromear', description: 'bromear con todos', userId: '3' },
//     { id: '5', title: 'llorar', description: 'llorar por las puras', userId: '2' },
//     { id: '6', title: 'molestar', description: 'molestar a todos', userId: '1' },
// ]

// const postData = [
//     { id: '1', description: 'comment bailar mucha', userId: '1' },
//     { id: '2', description: 'comment Jugar con bloques', userId: '1'},
//     { id: '3', description: 'comment leer muchos libros', userId: '4' },
//     { id: '4', description: 'comment bromear con todos', userId: '5' },
//     { id: '5', description: 'comment llorar por las puras', userId: '2' },
//     { id: '6', description: 'comment molestar a todos', userId: '2' },
// ]

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql

//create types
const UserType = new graphql.GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: graphql.GraphQLString},
        name: {type: graphql.GraphQLString},
        age: {type: graphql.GraphQLInt},
        profession: {type: graphql.GraphQLString},

        posts: {
            type: new graphql.GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({ 
                    userId: parent.id
                })
                // return _.filter(postData, { userId: parent.id })
            }
        },

        hobbies: {
            type: new graphql.GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({
                    userId: parent.id,
                })
                // return _.filter(hobbiesData, { userId: parent.id })
            }
        }
    })
})
const HobbyType = new graphql.GraphQLObjectType({
    name: 'Hobby',
    description: 'Documentation for hobby...',
    fields: () => ({
        id: { type: graphql.GraphQLID },
        title: { type: graphql.GraphQLString },
        description: { type: graphql.GraphQLString },
        user:{
            type: UserType,
            resolve(parent, args) {
                return _.find(usersData, { id: parent.userId } )
            }
        }
    })
})
const PostType = new graphql.GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: {type: graphql.GraphQLID},
        description: {type: graphql.GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(
                    usersData, { id: parent.userId }
                )
            }
        }        
    })
})
const RootQuery = new GraphQLObjectType({
    name: 'schemaRootQueryType',
    description: 'description',
    fields: {
        user: {
            type: UserType,
            args: { id:{ type: GraphQLString } },
            resolve(parent, args) {
                return User.findById(args.id);
                // return _.find( usersData, { id: args.id })
                // let user = {
                //     id: '1234',
                //     age: 36,
                //     name: 'Nilton Gonzano'
                // }

                // return user
            }
        },
        users: {
            type: new graphql.GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
                // return usersData
            }
            /*
    query{
        users{
          name
        }
      }
    */
        },
        
        hobby: {
            type: HobbyType,
            args: { id: { type: graphql.GraphQLID } },
            resolve(parent, args){
                return Hobby.findById(args.id);
                // return _.find( hobbiesData, { id: args.id })
            }
        },
        hobbies: {
            type: new graphql.GraphQLList(HobbyType),
            resolve(parent,args){
                return Hobby.find({ id: args.userId });
                // return hobbiesData
            }
        },

        post: {
            type: PostType,
            args: { id: { type: graphql.GraphQLID }},
            resolve(parent, args){
                return Post.findById(args.id);
                // return _.find( postData, { id: args.id } )
            }
        },
        posts: {
            type: new graphql.GraphQLList(PostType),
            resolve(parent,args){
                return Post.find({});
                //    return postData
            }
        }
    }
})

//Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                profession: { type: GraphQLString }
            },
           async resolve(parent, args) {
                let user = User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession,
                })
                return user.save()
            }
            /*
            mutation{
                createUser(name:"Nilton", age:36, profession:"Developer"){
                id
                name
                age
                profession
              }
            }
            */
        },
        updateUser: {
            type: UserType,
            args: { 
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: { type: GraphQLString }
            },
            resolve(parent, args) {
                 return (updateUser = User.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession,
                        }
                    },
                    { new: true }
                 ))
            }
/**
 * mutation {
 updateUser(
    id:"668092a5751fa9d9d673f140",
    name: "Hanna Greacy",
    age: 40,
    profession: "Informatico"
){
  id
  name
  age
  profession
	}
}
*/
        },
        removeUser: {
            type: UserType,
            args: {
              id: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                try {
                    const removedUser = await User.findOneAndDelete({ _id: args.id }).exec();
                    if (!removedUser) {
                        throw new Error('User not found');
                    }
                    return removedUser;
                } catch (err) {
                    throw new Error('Error removing user: ' + err.message);
                }
            }
          },

        createPost: {
            type: PostType,
            args: {
                description: { type: GraphQLString },
                userId: { type: GraphQLID }
            },
            resolve(parent, args) {
                let post = Post({
                    description: args.description,
                    userId: args.userId,
                })
                return post.save();
            }
        },
        updatePost:{
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString)},
                description: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args){
                return (updatedPost = Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            description: args.description
                        }
                    },
                    { new: true }
                ))
            }
            // mutation {
            //     updatePost(
            //    id:"66809c651b6d311450541e4e",
            //    description: "actualizar el post"
            //    ){
            //      id
            //      description
            //        }
            //    }            
        },
        removePost: {
            type: PostType,
            args: {
              id: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                try {
                    const removedPost = await Post.findOneAndDelete({ _id: args.id }).exec();
                    if (!removedPost) {
                        throw new Error('User not found');
                    }
                    return removedPost;
                } catch (err) {
                    throw new Error('Error removing user: ' + err.message);
                }
            }
          },

        createHobby: {
            type: HobbyType,
            args: {
                userId: { type: GraphQLID },
                title: { type: GraphQLString },
                description: { type: GraphQLString }
            },
            resolve(parent, args) {
                let hobby = Hobby({
                    userId: args.userId,
                    title: args.title,
                    description: args.description,
                })
                return hobby.save();
            }
            /*
            mutation  
{
  createHobby(userId: "66861ce32fee1f5a384b9c4f", title: "title", description: "description")
  {
         id
         title
         description
      } 
}  
      /////
      createHobby(userId: \$userId, title: \$title, description: \$description){
         id
         title
         description
      }   
            */
        },
        updateHobby: {
            type: HobbyType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent,args){
                return (updateHobby = Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            title:args.title,
                            description: args.description
                        }
                    },
                    { new: true }
                ))
            }

        },
        removeHobby: {
            type: HobbyType,
            args: {
              id: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                try {
                    const removedHobby = await Hobby.findOneAndDelete({ _id: args.id }).exec();
                    if (!removedHobby) {
                        throw new Error('User not found');
                    }
                    return removedHobby;
                } catch (err) {
                    throw new Error('Error removing user: ' + err.message);
                }
            }
          },
    }
})

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
