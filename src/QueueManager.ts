interface QueueManager {
  queues: URL[];
}

class QueueManager{
  constructor(){
    this.queues = [];
  }

  first(): URL{
    return this.queues[0];
  }

  split(value: number): URL[]{
    if(value > this.queues.length){
      value = this.queues.length;
    }

    return this.queues.slice(0,value+1);
  }

  add(queue: URL): void{
    this.queues.push(queue);
  }

  remove(queue: URL): void{
    this.queues = this.queues.filter(q=>q.href === queue.href);
  }
}

export default QueueManager;