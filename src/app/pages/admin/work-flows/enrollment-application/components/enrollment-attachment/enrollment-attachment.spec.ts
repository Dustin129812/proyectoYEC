import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentAttachment } from './enrollment-attachment';

describe('EnrollmentAttachment', () => {
    let component: EnrollmentAttachment;
    let fixture: ComponentFixture<EnrollmentAttachment>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EnrollmentAttachment]
        }).compileComponents();

        fixture = TestBed.createComponent(EnrollmentAttachment);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
