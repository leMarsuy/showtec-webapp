import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-role-accordion',
  templateUrl: './role-accordion.component.html',
  styleUrl: './role-accordion.component.scss',
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '0px',
          opacity: 0,
        }),
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
        }),
      ),
      transition('collapsed <=> expanded', [animate('200ms ease-in-out')]),
    ]),
  ],
})
export class RoleAccordionComponent implements OnInit {
  @Input() fGroup!: FormGroup;
  @Input() config!: any;
  @Input() state!: any;

  ngOnInit(): void {
    this.state.expanded = this.state.state;
  }

  permissionClicked(state: any, config: any) {
    if (config.persistent) return;

    this.fGroup.markAsDirty();

    state.expanded = !state.expanded;
    state.state = !state.state;

    this.fGroup.controls['hasAccess'].setValue(state.state);

    //Change config.methods into !isEmpty()
    if (!state.state && config?.methods) {
      //Uncheck all methods
      Object.keys(config.methods).forEach((key) => {
        state['methods'][key].state = false;
        this.fGroup.get('methods')?.get(key)?.setValue(false);
      });
    }

    //Uncheck all children
    if (!state.state && config?.children?.length) {
      //Uncheck children states
      config.children.forEach((child: any, index: number) => {
        const childState = state['children'][child.path];
        childState.state = false;

        const childrenFormArray = this.fGroup.get('children') as any;

        const childFormGroup = childrenFormArray.controls.find(
          (formGroup: FormGroup) => formGroup.value['path'] === child.path,
        );

        childFormGroup.controls['hasAccess'].setValue(false);

        //Uncheck all child methods
        if (childState?.['methods']) {
          Object.keys(childState?.['methods']).forEach((key) => {
            childState['methods'][key].state = false;

            childFormGroup.controls['methods']?.get(key).setValue(false);
          });
        }
      });
    }
  }

  methodClicked(state: any, key: string) {
    state.state = !state.state;
    this.fGroup.get('methods')?.get(key)?.setValue(state.state);

    this.fGroup.markAsDirty();
  }
}
