import {ForceGraph} from './forceGraph';

export class ForceLink {
  // optional - defining optional implementation properties - required for relevant typing assistance
  id?: number;
  label?: any;
  name?: string;

  // must - defining enforced implementation properties
  source: ForceGraph | string | number;
  target: ForceGraph | string | number;

  constructor(source, target) {
    this.source = source;
    this.target = target;
  }
}
