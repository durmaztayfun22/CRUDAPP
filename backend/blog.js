import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    image: {
        type: String
    },
    name: {
        type: String
    },
    weight: {
        type: Number
    },
    stature: {
        type: Number
    },
    goal: {
        type: Number
    }
});


const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
