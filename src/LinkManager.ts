interface LinkManager{
  queues: Link[];
}

interface Link{
  url: string;
  isComplete: boolean;
}

class LinkManager{
  constructor(){
    this.queues = [];
  }

  first(): Link{
    return this.queues[0];
  }

  split(value: number): Link[]{
    if(value > this.queues.length){
      value = this.queues.length;
    }

    return this.queues
      .filter(link=>!link.isComplete)
      .slice(0,value+1);
  }

  get(url: string): Link{
    return this.queues.filter(q=>q.url === url)[0]
  }

  add(url: string): void{
    const link = this.get(url);
    if(link) return;

    this.queues.push(new Link(url));
  }

  remove(queue: Link): void{
    this.queues = this.queues.filter(q=>q.url === queue.url);
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