import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { getUrl } from "src/environments/URLs.service";
import { Program } from "../model/program.model";

@Injectable({
    providedIn: 'root'
})

export class ProgramService {

    $programs: Subject<Program[]> = new Subject();
    programs: Program[] = []
    _isLoading: boolean = false;
    constructor(private http: HttpClient) { }


    dispatchAllProgramsSummary() {
        if (this._isLoading) {
            return;
        }
        if (this.programs.length == 0) {
            this._isLoading = true
            this.http.get<Program[]>(getUrl("programs")).subscribe(programs => {
                this.programs = programs;
                this.$programs.next(programs)
                this._isLoading = false
            });
            this.$programs;
        }
        else {
            this.$programs.next(this.programs)
        }
    }

    getAllProgramSummary() {
        return this.$programs;
    }

    getProgram(programId: number) {
        return this.http.get<Program>(getUrl("program", { key: "{{programId}}", value: String(programId) }));
    }
}