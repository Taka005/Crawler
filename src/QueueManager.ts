interface QueueManager {
  queues: string[];
}

class QueueManager{
  constructor(){
    this.queues = [];
  }

  first(): string{
    return this.queues[0];
  }

  split(value: number): string[]{
    if(value > this.queues.length){
      value = this.queues.length;
    }

    return this.queues.slice(0,value+1);
  }

  add(queue: string): void{
    this.queues.push(queue);
  }

  remove(queue: string): void{
    this.queues = this.queues.filter(q=>q === queue);
  }
}

export default QueueManager;