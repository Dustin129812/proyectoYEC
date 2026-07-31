import { Injectable } from '@angular/core';
import { DpaInterface } from '@utils/interfaces';
import { CoreEnum } from '@utils/enums';

@Injectable({
    providedIn: 'root'
})
export class DpaService {
    private getDpa(): DpaInterface[] {
        const dpa = sessionStorage.getItem(CoreEnum.dpa);

        return dpa ? (JSON.parse(dpa) as DpaInterface[]) : [];
    }

    findProvinces(): DpaInterface[] {
        return this.getDpa().filter(item => item.parentId === null);
    }

    findDpaByParentId(parentId: string): DpaInterface[] {
        return this.getDpa().filter(item => item.parentId === parentId);
    }

    setDpa(value: DpaInterface[]): void {
        sessionStorage.setItem(CoreEnum.dpa, JSON.stringify(value));
    }
}
