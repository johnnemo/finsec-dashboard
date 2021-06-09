export class Notification {
  constructor(
    public id: string,
    public description: string,
    public subtype: string,
    public details: any,
    public name: any,
    public created: any,
    public modified: any,
    public domain: string,
  ) {
    this.id = id;
    this.description = description;
    this.subtype = subtype;
    this.details = details;
    this.name = name;
    this.created = created;
    this.modified = modified;
    this.domain = domain;
  }
}
