const fs = require("fs");
let artworks = []
class Artwork{
    constructor({id,title,votes,description,author,iconFile}){
        this.id = id;
        this.title = title;
        this.votes = votes;
        this.description = description;
        this.author = author;
        this.iconFile = iconFile;
    }
    static loadAll(){
        let buffer = fs.readFileSync(__dirname+"/artworks.json");
        let raw = JSON.parse(buffer.toString());
        artworks = raw.map(obj=>new Artwork(obj));
    }
    static find(id){
        return artworks.find(artwork=>artwork.id===id);
    }
    static saveAll(){
        return fs.writeFileSync(__dirname+"/artworks.json",JSON.stringify(artworks))
    }
    static get all(){
        return artworks;
    }
    serialise(){
        return {
            id:this.id,
            title:this.title,
            votes:this.votes,
            description:this.description,
            author:this.author
        };
    }
}
module.exports = Artwork;