export class Organization {
    constructor(id?: string,
    name?: string,
    areaOfInterest?: Array<string>,
    orgType?: string,
    specializations?: Array<{name?: string, desc?: string}>,
    address?: string,
    pointOfContact?: Array<{name?: string, phone?: string, email?: string}>,
    details?: string,
    latitude?:string,
    longitude?:string,
    registration?:boolean,
    website?: string) {}
}
