export class ForceGraph {
  // optional - defining optional implementation properties - required for relevant typing assistance
  x?: number;
  y?: number;
  attributes?: any;
  name?: string;
  type: string;
  value?: number | null;
  itemStyle?: any;
  symbolSize?: number;
  draggable: boolean;
  category?: string;
  id: string;

  constructor(id, type) {
    this.id = id;
    this.type = type;
  }
}

