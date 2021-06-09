import {Component, Input, OnInit} from '@angular/core';
import {DatalayerService} from '../../app/@core/services/finsec/data-layer/data-layer.service';
import {TargetService} from "../../app/@core/services/finsec/dual-list/target.service";

@Component({
             selector: 'finsec-dual-list',
             templateUrl: './finsec-dual-list.component.html',
             styleUrls: ['./finsec-dual-list.component.scss'],
           })
export class FinsecDualListComponent implements OnInit {
  static tube: Array<string>;
  @Input() id: string;
  @Input() targetType: string;
  @Input() query: any;
  source: Array<string> = [];
  target = [];
  message;

  constructor(private datalayerService: DatalayerService, private targetService: TargetService) {
  }

  compare(a: any, b: any) {
    const arr = FinsecDualListComponent.tube;
    return arr.indexOf(a._id) - arr.indexOf(b._id);
  }

  showMessage(e: any) {
    this.message = {selectChange: e};
  }

  ngOnInit(): void {
    const tube = [];
    this.datalayerService.rootNode(this.targetType, null, this.query).subscribe(data => {
      data.forEach(function (item) {
        tube.push({
                    _id: item.id,
                    _name: item.name,
                  });
      });
      FinsecDualListComponent.tube = tube;
      this.source = FinsecDualListComponent.tube;
    });
  }

  attach($event) {
    const targetItems = [];
    $event.forEach(function (item) {
      targetItems.push(item._id);
    });
    this.targetService.addItem(targetItems);
    // TODO: when the user changes the list, attach the references to the main form object
    // TODO: define the main form object. In the service definition if the user needs to
    // add a new threat the service is no longer the main object but the threat
    // It seems like the form component and the dual list need to share the main object and
    // change its state accordingly
  }

}
