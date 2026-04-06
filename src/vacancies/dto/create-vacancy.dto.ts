export class CreateVacancyDto {
    category: string;   // production, office, tech
    type: string;       // Full-time, Part-time

    titleUz: string;
    titleRu: string;
    titleEn: string;

    deptUz: string;
    deptRu: string;
    deptEn: string;

    locUz: string;
    locRu: string;
    locEn: string;

    reqUz: string[];    // Talablar massivi
    reqRu: string[];
    reqEn: string[];

    dutyUz: string[];   // Vazifalar massivi
    dutyRu: string[];
    dutyEn: string[];
}