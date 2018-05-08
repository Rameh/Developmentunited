//Creates a new group
//Requires: name
//Accepts: description, hidden, private, ownerUid


export class Group {
    id: number;
    name = '';
    hidden = false;
    //private = false;
    ownerUid = '';
  
    constructor (id: number, name: string, hidden:boolean, ownerUid:string){
        this.id = id;
        this.name = name;
        this.hidden = hidden;
        this.ownerUid=ownerUid;
     }
  }