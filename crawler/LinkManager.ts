interface LinkManager{
  data: Link[];
}

interface Link{
  url: string;
  isComplete: boolean;
}

class LinkManager{
  constructor(){
    this.data = [];
  }

  split(value: number): Link[]{
    if(value > this.data.length){
      value = this.data.length;
    }

    return this.data
      .filter(link=>!link.isComplete)
      .slice(0,value+1);
  }

  get(url: string): Link{
    return this.data.filter(q=>q.url === url)[0]
  }

  add(url: string): void{
    this.data.push(new Link(url));
  }

  remove(queue: Link): void{
    this.data = this.data.filter(q=>q.url === queue.url);
  }
}

class Link{
  constructor(url: string){
    this.url = url
    this.isComplete = false;
  }

  setComplete(value: boolean){
    this.isComplete = value;
  }
}

export default LinkManager;